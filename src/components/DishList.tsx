import React from 'react';
import { ArrowLeft, Plus, Flame, Clock, Sparkles } from 'lucide-react';
import { DishItem, FoodGroup } from '../types';
import { playPosClick } from '../utils/audio';

interface DishListProps {
  group: FoodGroup;
  dishes: DishItem[];
  onBackToCategories: () => void;
  onAddDish: (dish: DishItem, seatNumber?: number, selectedModifiers?: string[]) => void;
  onOpenDishNotes: (dish: DishItem) => void;
  selectedSeat: number;
  onChangeSeat: (seat: number) => void;
}

export const DishList: React.FC<DishListProps> = ({
  group,
  dishes,
  onBackToCategories,
  onAddDish,
  onOpenDishNotes,
  selectedSeat,
  onChangeSeat,
}) => {
  return (
    <div className="h-full flex flex-col p-5 sm:p-8 lg:p-10 overflow-y-auto bg-[#FDFCF8]">
      {/* Navigation & Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b-2 border-[#2D2D2A]">
        <div className="flex items-center gap-3">
          <button
            id="btn-back-to-categories"
            onClick={() => {
              playPosClick();
              onBackToCategories();
            }}
            className="flex items-center gap-2 px-3 py-2 border-2 border-[#2D2D2A] bg-white font-mono-code text-xs font-bold uppercase tracking-wider hover:bg-[#2D2D2A] hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>CATEGORIES</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-2xl">{group.iconEmoji}</span>
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-medium uppercase text-[#2D2D2A] leading-tight">
                {group.name}
              </h2>
              <span className="font-mono-code text-[11px] text-[#2D2D2A]/60 font-bold uppercase tracking-wider">
                {dishes.length} ITEMS AVAILABLE
              </span>
            </div>
          </div>
        </div>

        {/* Seat Allocation Selector in Space Mono */}
        <div className="flex items-center gap-2 bg-white border-2 border-[#2D2D2A] px-3 py-1.5">
          <span className="pos-label text-[11px]">ASSIGN SEAT:</span>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5, 6].map((seat) => (
              <button
                key={seat}
                id={`btn-seat-${seat}`}
                onClick={() => {
                  playPosClick();
                  onChangeSeat(seat);
                }}
                className={`w-6 h-6 flex items-center justify-center font-mono-code text-xs font-bold transition-colors cursor-pointer ${
                  selectedSeat === seat
                    ? 'bg-[#2D2D2A] text-white'
                    : 'text-[#2D2D2A] hover:bg-neutral-200'
                }`}
              >
                {seat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Dish Grid */}
      <div
        id="pos-dish-grid"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {dishes.map((dish) => {
          const isOut = dish.isSoldOut;

          return (
            <div
              key={dish.id}
              id={`dish-card-${dish.id}`}
              className={`border-2 border-[#2D2D2A] bg-white p-4 sm:p-5 flex flex-col justify-between transition-all ${
                isOut ? 'opacity-40 pointer-events-none' : 'hover:border-[#D9480F]'
              }`}
            >
              <div>
                <div className="flex justify-between items-start gap-2 mb-1.5">
                  <span className="font-mono-code text-[11px] text-[#2D2D2A]/50 font-bold uppercase">
                    ITEM #{dish.id.toUpperCase()}
                  </span>
                  <span className="font-mono-code font-bold text-[#D9480F] text-base">
                    ${dish.price.toFixed(2)}
                  </span>
                </div>

                <h3 className="font-display text-xl uppercase text-[#2D2D2A] font-medium leading-snug">
                  {dish.name}
                </h3>

                <p className="text-xs text-[#2D2D2A]/70 font-sans mt-1 line-clamp-2">
                  {dish.description}
                </p>

                {/* Dietary Tags in Space Mono ink style */}
                {dish.dietary && dish.dietary.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2.5">
                    {dish.dietary.map((tag, idx) => (
                      <span
                        key={idx}
                        className="font-mono-code text-[10px] bg-[#2D2D2A] text-white px-1.5 py-0.5 uppercase tracking-wider font-bold"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-[#2D2D2A]/15 flex items-center justify-between gap-2">
                <button
                  id={`btn-customize-${dish.id}`}
                  onClick={() => {
                    playPosClick();
                    onOpenDishNotes(dish);
                  }}
                  className="font-mono-code text-xs font-bold text-[#2D2D2A] hover:text-[#D9480F] uppercase tracking-wider py-1 cursor-pointer"
                >
                  + MODIFIER
                </button>

                <button
                  id={`btn-add-${dish.id}`}
                  onClick={() => {
                    playPosClick();
                    onAddDish(dish, selectedSeat);
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-[#2D2D2A] text-white hover:bg-[#D9480F] transition-colors font-mono-code text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>ADD TO ORDER</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
