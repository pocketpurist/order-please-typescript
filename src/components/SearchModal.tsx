import React, { useState, useEffect } from 'react';
import { Search, X, Plus } from 'lucide-react';
import { DishItem } from '../types';
import { playPosClick } from '../utils/audio';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  dishes: DishItem[];
  onAddDish: (dish: DishItem) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  dishes,
  onAddDish,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isOpen) {
      setSearchTerm('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredDishes = dishes.filter(
    (d) =>
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.groupId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-black/60 backdrop-blur-xs">
      <div
        id="modal-quick-search"
        className="bg-[#FDFCF8] border-2 border-[#2D2D2A] w-full max-w-xl text-[#2D2D2A] shadow-2xl overflow-hidden"
      >
        {/* Search Header Input */}
        <div className="p-4 border-b-2 border-[#2D2D2A] flex items-center gap-3 bg-white">
          <Search className="w-5 h-5 text-[#D9480F] shrink-0" />
          <input
            autoFocus
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="TYPE DISH NAME, INGREDIENT, OR CATEGORY..."
            className="flex-1 bg-transparent font-mono-code text-xs sm:text-sm font-bold uppercase text-[#2D2D2A] placeholder:text-[#2D2D2A]/40 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 border-2 border-[#2D2D2A] hover:bg-[#2D2D2A] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[380px] overflow-y-auto p-3 divide-y divide-[#2D2D2A]/10">
          {filteredDishes.length === 0 ? (
            <div className="p-8 text-center font-mono-code text-xs text-[#2D2D2A]/50 uppercase">
              No matching menu items found.
            </div>
          ) : (
            filteredDishes.map((dish) => (
              <div
                key={dish.id}
                className="py-2.5 px-3 flex items-center justify-between hover:bg-neutral-100 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-display text-lg uppercase font-medium">
                      {dish.name}
                    </span>
                    <span className="font-mono-code text-[10px] bg-[#2D2D2A] text-white px-1.5 py-0.5 rounded-[2px] uppercase font-bold">
                      {dish.groupId}
                    </span>
                  </div>
                  <p className="text-xs text-[#2D2D2A]/60 font-sans line-clamp-1">
                    {dish.description}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-mono-code font-bold text-[#D9480F] text-sm">
                    ${dish.price.toFixed(2)}
                  </span>
                  <button
                    onClick={() => {
                      playPosClick();
                      onAddDish(dish);
                      onClose();
                    }}
                    className="flex items-center gap-1 px-2.5 py-1.5 bg-[#2D2D2A] text-white font-mono-code text-xs font-bold uppercase hover:bg-[#D9480F] transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>ADD</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
