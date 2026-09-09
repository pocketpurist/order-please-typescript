import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { PosHeader } from './components/PosHeader';
import { FoodGroupGrid } from './components/FoodGroupGrid';
import { DishList } from './components/DishList';
import { LiveOrderSidebar } from './components/LiveOrderSidebar';
import { PosFooter } from './components/PosFooter';
import { SearchModal } from './components/SearchModal';
import { FloorPlanModal } from './components/FloorPlanModal';
import { AddNoteModal } from './components/AddNoteModal';
import { KitchenSuccessModal } from './components/KitchenSuccessModal';
import { FOOD_GROUPS, MENU_ITEMS, INITIAL_ORDER_ITEMS, AVAILABLE_TABLES } from './data/mockData';
import { FoodGroupId, MenuItem, OrderItem, TableDetails } from './types';
import { playPosClick, playKitchenChime } from './utils/audio';

export default function App() {
  const [selectedGroupId, setSelectedGroupId] = useState<FoodGroupId | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>(INITIAL_ORDER_ITEMS);
  const [currentTable, setCurrentTable] = useState<TableDetails>(AVAILABLE_TABLES[0]);
  const [ticketCounter, setTicketCounter] = useState(1048);

  // Seat selection state
  const [selectedSeat, setSelectedSeat] = useState<number>(1);

  // Modals state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isFloorPlanOpen, setIsFloorPlanOpen] = useState(false);
  const [customizingDish, setCustomizingDish] = useState<MenuItem | null>(null);
  const [isKitchenSuccessOpen, setIsKitchenSuccessOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const selectedGroup = FOOD_GROUPS.find((g) => g.id === selectedGroupId) || null;
  const filteredDishes = selectedGroupId
    ? MENU_ITEMS.filter((item) => item.groupId === selectedGroupId)
    : [];

  const subtotal = orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Handlers
  const handleSelectGroup = (groupId: FoodGroupId) => {
    setSelectedGroupId(groupId);
  };

  const handleBackToGroups = () => {
    setSelectedGroupId(null);
  };

  const handleAddDish = (dish: MenuItem, seat?: number, selectedModifiers?: string[], note?: string) => {
    setOrderItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.menuItemId === dish.id &&
          item.seatNumber === (seat || selectedSeat) &&
          JSON.stringify(item.selectedModifiers || []) === JSON.stringify(selectedModifiers || []) &&
          item.note === note
      );

      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + 1,
        };
        return updated;
      }

      const newItem: OrderItem = {
        id: `ord-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        menuItemId: dish.id,
        name: dish.name,
        price: dish.price,
        quantity: 1,
        selectedModifiers: selectedModifiers || [],
        note,
        seatNumber: seat || selectedSeat,
      };
      return [...prev, newItem];
    });
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setOrderItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean) as OrderItem[]
    );
  };

  const handleDeleteItem = (id: string) => {
    setOrderItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleUpdateItemNote = (id: string, newNote: string) => {
    setOrderItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, note: newNote } : item))
    );
  };

  const handleClearOrder = () => {
    setOrderItems([]);
  };

  const handleFireToKitchen = () => {
    if (orderItems.length === 0) return;
    setIsKitchenSuccessOpen(true);
  };

  const handleHoldOrder = () => {
    alert(`Order for Table ${currentTable.tableNumber} held in active memory.`);
  };

  const handleSplitBill = () => {
    alert(`Table ${currentTable.tableNumber} bill split by ${currentTable.guestCount} seats.`);
  };

  const handleNextTicket = () => {
    setTicketCounter((c) => c + 1);
    setOrderItems([]);
    setSelectedGroupId(null);
    setIsKitchenSuccessOpen(false);
    const nextTable =
      AVAILABLE_TABLES.find((t) => t.tableNumber !== currentTable.tableNumber) ||
      AVAILABLE_TABLES[0];
    setCurrentTable(nextTable);
  };

  return (
    <div className="h-screen w-screen bg-[#FDFCF8] text-[#2D2D2A] font-sans flex flex-col overflow-hidden select-none">
      {/* 1. Global Navigation matching Variation 7 */}
      <PosHeader
        currentTable={currentTable}
        waiterName="Alex M."
        waiterId="#402"
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenFloorPlan={() => setIsFloorPlanOpen(true)}
      />

      {/* 2. Container: 1fr 380px/420px grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px] overflow-hidden">
        {/* Main Pane: Category Select or Dish Items */}
        <main
          id="pos-main-pane"
          className="h-full overflow-hidden border-r-0 lg:border-r-2 border-[#2D2D2A] relative bg-[#FDFCF8]"
        >
          <AnimatePresence mode="wait">
            {!selectedGroup ? (
              <motion.div
                key="category-grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.12 }}
                className="h-full"
              >
                <FoodGroupGrid
                  groups={FOOD_GROUPS}
                  selectedGroupId={selectedGroupId}
                  onSelectGroup={handleSelectGroup}
                />
              </motion.div>
            ) : (
              <motion.div
                key={`dish-list-${selectedGroup.id}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.12 }}
                className="h-full"
              >
                <DishList
                  group={selectedGroup}
                  dishes={filteredDishes}
                  onBackToCategories={handleBackToGroups}
                  onAddDish={(dish, seat) => handleAddDish(dish, seat)}
                  onOpenDishNotes={(dish) => setCustomizingDish(dish)}
                  selectedSeat={selectedSeat}
                  onChangeSeat={(seat) => setSelectedSeat(seat)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Aside: Active Order Sidebar (Desktop always visible, mobile slide-over) */}
        <div className="hidden lg:block h-full overflow-hidden">
          <LiveOrderSidebar
            orderItems={orderItems}
            onUpdateQuantity={handleUpdateQuantity}
            onDeleteItem={handleDeleteItem}
            onUpdateItemNote={handleUpdateItemNote}
            onClearOrder={handleClearOrder}
            isMobileDrawerOpen={false}
            onToggleMobileDrawer={() => {}}
          />
        </div>

        {/* Mobile Slide-over Drawer for Order */}
        {isMobileDrawerOpen && (
          <div className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-xs flex justify-end">
            <div className="w-full max-w-md h-full bg-[#f4f3ef] border-l-2 border-[#2D2D2A] flex flex-col">
              <div className="p-3 border-b-2 border-[#2D2D2A] flex justify-between items-center bg-white">
                <span className="pos-label">MOBILE ORDER VIEW</span>
                <button
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="px-3 py-1 border-2 border-[#2D2D2A] font-mono-code text-xs font-bold uppercase"
                >
                  CLOSE [X]
                </button>
              </div>
              <div className="flex-1 overflow-hidden">
                <LiveOrderSidebar
                  orderItems={orderItems}
                  onUpdateQuantity={handleUpdateQuantity}
                  onDeleteItem={handleDeleteItem}
                  onUpdateItemNote={handleUpdateItemNote}
                  onClearOrder={handleClearOrder}
                  isMobileDrawerOpen={isMobileDrawerOpen}
                  onToggleMobileDrawer={() => setIsMobileDrawerOpen(false)}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. Terminal Footer matching Variation 7 */}
      <PosFooter
        orderCount={orderItems.reduce((acc, item) => acc + item.quantity, 0)}
        onFireToKitchen={handleFireToKitchen}
        onHoldOrder={handleHoldOrder}
        onSplitBill={handleSplitBill}
        isMobileDrawerOpen={isMobileDrawerOpen}
        onToggleMobileDrawer={() => setIsMobileDrawerOpen(!isMobileDrawerOpen)}
        subtotal={subtotal}
      />

      {/* Interactive Modals */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        dishes={MENU_ITEMS}
        onAddDish={(dish) => handleAddDish(dish, selectedSeat)}
      />

      <FloorPlanModal
        isOpen={isFloorPlanOpen}
        onClose={() => setIsFloorPlanOpen(false)}
        tables={AVAILABLE_TABLES}
        currentTable={currentTable}
        onSelectTable={(table) => setCurrentTable(table)}
      />

      <AddNoteModal
        dish={customizingDish}
        defaultSeat={selectedSeat}
        onClose={() => setCustomizingDish(null)}
        onConfirm={(dish, seat, modifiers, note) => {
          handleAddDish(dish, seat, modifiers, note);
          setCustomizingDish(null);
        }}
      />

      <KitchenSuccessModal
        isOpen={isKitchenSuccessOpen}
        onClose={handleNextTicket}
        table={currentTable}
        orderItems={orderItems}
        ticketNumber={ticketCounter}
      />
    </div>
  );
}
