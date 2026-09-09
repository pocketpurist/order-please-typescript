import React from 'react';
import { motion } from 'motion/react';
import { FoodGroup, FoodGroupId } from '../types';
import { playPosClick } from '../utils/audio';

interface FoodGroupGridProps {
  groups: FoodGroup[];
  selectedGroupId: FoodGroupId | null;
  onSelectGroup: (groupId: FoodGroupId) => void;
}

export const FoodGroupGrid: React.FC<FoodGroupGridProps> = ({
  groups,
  selectedGroupId,
  onSelectGroup,
}) => {
  return (
    <div className="h-full flex flex-col p-5 sm:p-8 lg:p-10 overflow-y-auto bg-[#FDFCF8]">
      {/* Display Title matching Variation 7 spec */}
      <div className="flex flex-wrap items-baseline justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <span className="pos-label block mb-1">TERMINAL MENU SELECTOR</span>
          <h2
            id="category-display-title"
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-normal leading-[0.9] tracking-tight uppercase text-[#2D2D2A]"
          >
            CATEGORY<br />SELECT
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <span className="border-2 border-[#2D2D2A] px-3 py-1 font-mono-code text-xs font-bold uppercase bg-white">
            {groups.length} FOOD GROUPS
          </span>
        </div>
      </div>

      {/* Variation 7 Category Grid */}
      <div
        id="pos-category-grid"
        className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5 flex-1 auto-rows-fr"
      >
        {groups.map((group) => {
          const isSelected = selectedGroupId === group.id;

          return (
            <motion.button
              key={group.id}
              id={`category-tile-${group.id}`}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.1 }}
              onClick={() => {
                playPosClick();
                onSelectGroup(group.id);
              }}
              className={`border-2 border-[#2D2D2A] p-4 sm:p-6 text-center bg-white transition-all flex flex-col justify-between items-center relative cursor-pointer select-none group shadow-xs ${
                isSelected ? 'bg-[#2D2D2A] text-white ring-2 ring-[#D9480F]' : 'hover:bg-[#fcfbf7]'
              }`}
            >
              {/* Subtle top indicator pip */}
              <div
                className="w-8 h-1 mb-2 rounded-full transition-all group-hover:w-12"
                style={{ backgroundColor: group.themeColor }}
              />

              <div className="my-auto py-2">
                <span
                  role="img"
                  aria-label={group.name}
                  className="text-3xl sm:text-4xl block mb-2 sm:mb-3 select-none transform transition-transform group-hover:scale-110"
                >
                  {group.iconEmoji}
                </span>

                <h3
                  className={`font-display text-lg sm:text-xl uppercase tracking-wide font-medium ${
                    isSelected ? 'text-white' : 'text-[#2D2D2A]'
                  }`}
                >
                  {group.name}
                </h3>

                <p
                  className={`text-xs mt-1.5 line-clamp-1 font-sans ${
                    isSelected ? 'text-neutral-300' : 'text-[#2D2D2A]/60'
                  }`}
                >
                  {group.tagline}
                </p>
              </div>

              {/* Bottom Metadata Pill in Space Mono */}
              <div className="w-full pt-2 border-t border-[#2D2D2A]/10 flex items-center justify-between font-mono-code text-[11px] font-bold">
                <span
                  className="uppercase px-1.5 py-0.5 rounded"
                  style={{
                    backgroundColor: isSelected ? 'rgba(255,255,255,0.15)' : `${group.themeColor}15`,
                    color: isSelected ? '#ffffff' : group.themeColor,
                  }}
                >
                  {group.itemCount} ITEMS
                </span>
                <span className="text-[#D9480F] group-hover:translate-x-0.5 transition-transform">
                  &rarr;
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
