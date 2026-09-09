import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { DishItem } from '../types';
import { playPosClick } from '../utils/audio';

interface AddNoteModalProps {
  dish: DishItem | null;
  onClose: () => void;
  onConfirm: (dish: DishItem, seatNumber: number, modifiers: string[], note: string) => void;
  defaultSeat: number;
}

export const AddNoteModal: React.FC<AddNoteModalProps> = ({
  dish,
  onClose,
  onConfirm,
  defaultSeat,
}) => {
  if (!dish) return null;

  const [selectedSeat, setSelectedSeat] = useState(defaultSeat);
  const [selectedMods, setSelectedMods] = useState<string[]>([]);
  const [customNote, setCustomNote] = useState('');

  const toggleModifier = (mod: string) => {
    playPosClick();
    if (selectedMods.includes(mod)) {
      setSelectedMods(selectedMods.filter((m) => m !== mod));
    } else {
      setSelectedMods([...selectedMods, mod]);
    }
  };

  const handleConfirm = () => {
    playPosClick();
    onConfirm(dish, selectedSeat, selectedMods, customNote.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div
        id="modal-dish-modifier"
        className="bg-[#FDFCF8] border-2 border-[#2D2D2A] w-full max-w-lg p-6 text-[#2D2D2A] shadow-2xl space-y-5"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-[#2D2D2A]">
          <div>
            <div className="pos-label">ITEM CUSTOMIZATION</div>
            <h3 className="font-display text-2xl uppercase font-medium">{dish.name}</h3>
          </div>
          <button
            id="btn-close-modifier-modal"
            onClick={onClose}
            className="p-1 border-2 border-[#2D2D2A] hover:bg-[#2D2D2A] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Seat selection */}
        <div>
          <label className="pos-label block mb-1.5">ASSIGN TO SEAT</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5, 6].map((seat) => (
              <button
                key={seat}
                onClick={() => {
                  playPosClick();
                  setSelectedSeat(seat);
                }}
                className={`w-9 h-9 border-2 border-[#2D2D2A] font-mono-code font-bold text-xs uppercase cursor-pointer ${
                  selectedSeat === seat
                    ? 'bg-[#2D2D2A] text-white'
                    : 'bg-white text-[#2D2D2A] hover:bg-neutral-100'
                }`}
              >
                {seat}
              </button>
            ))}
          </div>
        </div>

        {/* Preset Modifiers */}
        {dish.availableModifiers && dish.availableModifiers.length > 0 && (
          <div>
            <label className="pos-label block mb-1.5">PREPARATION OPTIONS</label>
            <div className="flex flex-wrap gap-2">
              {dish.availableModifiers.map((mod) => {
                const active = selectedMods.includes(mod);
                return (
                  <button
                    key={mod}
                    onClick={() => toggleModifier(mod)}
                    className={`px-3 py-1.5 border-2 border-[#2D2D2A] font-mono-code text-xs font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer ${
                      active
                        ? 'bg-[#2D2D2A] text-white'
                        : 'bg-white text-[#2D2D2A] hover:bg-neutral-100'
                    }`}
                  >
                    {active && <Check className="w-3 h-3 text-[#D9480F]" />}
                    <span>{mod}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Special Instructions */}
        <div>
          <label className="pos-label block mb-1.5">KITCHEN SPECIAL NOTES</label>
          <textarea
            value={customNote}
            onChange={(e) => setCustomNote(e.target.value)}
            placeholder="e.g., Dressing on side, severe nut allergy, extra crispy..."
            rows={2}
            className="w-full bg-white border-2 border-[#2D2D2A] p-2.5 font-mono-code text-xs text-[#2D2D2A] focus:outline-none focus:ring-1 focus:ring-[#D9480F] resize-none"
          />
        </div>

        {/* Bottom Actions */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 py-3 border-2 border-[#2D2D2A] font-mono-code text-xs font-bold uppercase hover:bg-neutral-100 cursor-pointer"
          >
            CANCEL
          </button>
          <button
            id="btn-confirm-add-modifier"
            onClick={handleConfirm}
            className="flex-1 py-3 bg-[#2D2D2A] text-white border-2 border-[#2D2D2A] font-mono-code text-xs font-bold uppercase tracking-wider hover:bg-[#D9480F] hover:border-[#D9480F] transition-colors cursor-pointer"
          >
            ADD TO ORDER • ${dish.price.toFixed(2)}
          </button>
        </div>
      </div>
    </div>
  );
};
