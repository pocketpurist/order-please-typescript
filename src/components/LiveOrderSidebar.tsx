import React, { useState } from 'react';
import { Trash2, Edit3, Plus, Minus, X, UtensilsCrossed } from 'lucide-react';
import { OrderItem } from '../types';
import { playPosClick } from '../utils/audio';

interface LiveOrderSidebarProps {
  orderItems: OrderItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onDeleteItem: (id: string) => void;
  onUpdateItemNote: (id: string, newNote: string) => void;
  onClearOrder: () => void;
  isMobileDrawerOpen: boolean;
  onToggleMobileDrawer: () => void;
}

export const LiveOrderSidebar: React.FC<LiveOrderSidebarProps> = ({
  orderItems,
  onUpdateQuantity,
  onDeleteItem,
  onUpdateItemNote,
  onClearOrder,
  isMobileDrawerOpen,
  onToggleMobileDrawer,
}) => {
  const [editingItem, setEditingItem] = useState<OrderItem | null>(null);
  const [editNoteText, setEditNoteText] = useState('');

  const subtotal = orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = subtotal * 0.0825;
  const total = subtotal + tax;
  const totalItemCount = orderItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleStartEdit = (item: OrderItem) => {
    playPosClick();
    setEditingItem(item);
    setEditNoteText(item.note || '');
  };

  const handleSaveEdit = () => {
    if (editingItem) {
      playPosClick();
      onUpdateItemNote(editingItem.id, editNoteText.trim());
      setEditingItem(null);
    }
  };

  return (
    <>
      <aside
        id="pos-live-order-sidebar"
        className="w-full lg:w-[380px] xl:w-[420px] bg-[#f4f3ef] border-l-2 border-[#2D2D2A] flex flex-col h-full select-none shrink-0"
      >
        {/* Sidebar Header */}
        <div className="p-6 sm:p-7 border-b-2 border-[#2D2D2A] flex items-center justify-between bg-[#f4f3ef]">
          <div>
            <div className="pos-label">ACTIVE ORDER</div>
            <div className="font-mono-code text-xs text-[#2D2D2A]/60 font-semibold mt-0.5">
              {totalItemCount} {totalItemCount === 1 ? 'ITEM' : 'ITEMS'} QUEUED
            </div>
          </div>
          {orderItems.length > 0 && (
            <button
              id="btn-clear-order"
              onClick={() => {
                playPosClick();
                if (confirm('Clear all queued items from order?')) {
                  onClearOrder();
                }
              }}
              className="font-mono-code text-[11px] text-[#2D2D2A]/60 hover:text-[#D9480F] transition-colors uppercase font-bold"
            >
              CLEAR ALL
            </button>
          )}
        </div>

        {/* Order Items List */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-7 space-y-4">
          {orderItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#2D2D2A]/40 space-y-3">
              <div className="w-12 h-12 border-2 border-dashed border-[#2D2D2A]/30 rounded-full flex items-center justify-center">
                <UtensilsCrossed className="w-5 h-5 text-[#2D2D2A]/40" />
              </div>
              <div className="font-mono-code text-xs uppercase tracking-wider text-[#2D2D2A]/60">
                NO ITEMS IN QUEUE
              </div>
              <p className="text-xs text-[#2D2D2A]/50 max-w-xs font-sans">
                Select a food category to start building table ticket.
              </p>
            </div>
          ) : (
            orderItems.map((item) => (
              <div
                key={item.id}
                id={`order-item-${item.id}`}
                className="mb-4 pb-4 border-b border-[#2D2D2A]/15 last:border-b-0"
              >
                {/* Row 1: Qty, Name, Price */}
                <div className="flex justify-between items-start gap-2 mb-1.5">
                  <div className="flex items-start gap-2">
                    <span className="font-mono-code font-bold text-[#D9480F] text-sm shrink-0">
                      {item.quantity}x
                    </span>
                    <div>
                      <span className="font-semibold text-sm text-[#2D2D2A] leading-snug">
                        {item.name}
                      </span>
                      {item.seatNumber && (
                        <span className="ml-2 font-mono-code text-[10px] text-[#2D2D2A]/60 uppercase font-bold">
                          [SEAT {item.seatNumber}]
                        </span>
                      )}
                    </div>
                  </div>

                  <span className="font-mono-code font-bold text-[#D9480F] text-sm">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>

                {/* Modifiers as ink tags */}
                {item.selectedModifiers && item.selectedModifiers.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1 mb-2 pl-6">
                    {item.selectedModifiers.map((mod, idx) => (
                      <span
                        key={idx}
                        className="font-mono-code text-[10px] bg-[#2D2D2A] text-white px-1.5 py-0.5 rounded-[2px] uppercase tracking-wider font-bold"
                      >
                        {mod}
                      </span>
                    ))}
                  </div>
                )}

                {/* Custom Note */}
                {item.note && (
                  <p className="pl-6 text-xs text-[#D9480F] font-mono-code italic mt-1">
                    * {item.note}
                  </p>
                )}

                {/* Bottom Action Controls */}
                <div className="pl-6 flex items-center justify-between mt-2 pt-1">
                  <div className="flex items-center border border-[#2D2D2A] bg-white">
                    <button
                      id={`btn-minus-${item.id}`}
                      onClick={() => {
                        playPosClick();
                        onUpdateQuantity(item.id, -1);
                      }}
                      className="w-6 h-6 flex items-center justify-center hover:bg-[#2D2D2A] hover:text-white transition-colors cursor-pointer text-[#2D2D2A]"
                      title="Decrease quantity"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-7 text-center font-mono-code text-xs font-bold text-[#2D2D2A]">
                      {item.quantity}
                    </span>
                    <button
                      id={`btn-plus-${item.id}`}
                      onClick={() => {
                        playPosClick();
                        onUpdateQuantity(item.id, 1);
                      }}
                      className="w-6 h-6 flex items-center justify-center hover:bg-[#2D2D2A] hover:text-white transition-colors cursor-pointer text-[#2D2D2A]"
                      title="Increase quantity"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      id={`btn-edit-${item.id}`}
                      onClick={() => handleStartEdit(item)}
                      className="p-1 text-[#2D2D2A]/60 hover:text-[#2D2D2A] transition-colors"
                      title="Edit note"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      id={`btn-delete-${item.id}`}
                      onClick={() => {
                        playPosClick();
                        onDeleteItem(item.id);
                      }}
                      className="p-1 text-[#2D2D2A]/60 hover:text-[#D9480F] transition-colors"
                      title="Delete item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Order Summary at Bottom matching Variation 7 */}
        <div className="p-6 sm:p-7 border-t-2 border-[#2D2D2A] bg-white">
          <div className="space-y-1.5 font-mono-code text-xs text-[#2D2D2A]/70 mb-3">
            <div className="flex justify-between">
              <span className="uppercase">SUBTOTAL</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="uppercase">TAX (8.25%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex justify-between items-baseline pt-2 border-t border-[#2D2D2A]/20">
            <span className="pos-label text-xs">TOTAL</span>
            <span
              id="sidebar-total-val"
              className="font-display text-4xl sm:text-5xl font-normal text-[#D9480F] leading-none"
            >
              ${total.toFixed(2)}
            </span>
          </div>
        </div>
      </aside>

      {/* Edit Note Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[#FDFCF8] border-2 border-[#2D2D2A] w-full max-w-sm p-6 text-[#2D2D2A] shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b-2 border-[#2D2D2A] mb-3">
              <span className="pos-label">EDIT ITEM NOTE</span>
              <button
                onClick={() => setEditingItem(null)}
                className="p-1 text-[#2D2D2A] hover:bg-[#2D2D2A] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs font-semibold mb-2">{editingItem.name}</p>
            <textarea
              value={editNoteText}
              onChange={(e) => setEditNoteText(e.target.value)}
              placeholder="e.g., Medium Rare, dressing on side, allergy note..."
              rows={3}
              className="w-full bg-white border-2 border-[#2D2D2A] p-2.5 text-xs font-mono-code text-[#2D2D2A] focus:outline-none focus:ring-1 focus:ring-[#D9480F] resize-none mb-3"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setEditingItem(null)}
                className="flex-1 py-2 border-2 border-[#2D2D2A] font-mono-code text-xs font-bold uppercase hover:bg-neutral-100"
              >
                CANCEL
              </button>
              <button
                id="btn-save-note"
                onClick={handleSaveEdit}
                className="flex-1 py-2 bg-[#2D2D2A] text-white font-mono-code text-xs font-bold uppercase tracking-wider hover:bg-black"
              >
                SAVE NOTE
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
