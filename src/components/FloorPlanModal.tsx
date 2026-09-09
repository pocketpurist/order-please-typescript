import React from 'react';
import { X, Users, Check } from 'lucide-react';
import { TableDetails } from '../types';
import { playPosClick } from '../utils/audio';

interface FloorPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  tables: TableDetails[];
  currentTable: TableDetails;
  onSelectTable: (table: TableDetails) => void;
}

export const FloorPlanModal: React.FC<FloorPlanModalProps> = ({
  isOpen,
  onClose,
  tables,
  currentTable,
  onSelectTable,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div
        id="modal-floor-plan"
        className="bg-[#FDFCF8] border-2 border-[#2D2D2A] w-full max-w-xl p-6 text-[#2D2D2A] shadow-2xl space-y-5"
      >
        <div className="flex items-center justify-between pb-3 border-b-2 border-[#2D2D2A]">
          <div>
            <div className="pos-label">FLOOR PLAN DISPATCH</div>
            <h3 className="font-display text-2xl uppercase font-medium">SWITCH TABLE ASSIGNMENT</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 border-2 border-[#2D2D2A] hover:bg-[#2D2D2A] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {tables.map((table) => {
            const isCurrent = table.id === currentTable.id;
            return (
              <button
                key={table.id}
                onClick={() => {
                  playPosClick();
                  onSelectTable(table);
                  onClose();
                }}
                className={`p-4 border-2 border-[#2D2D2A] text-left transition-all relative cursor-pointer ${
                  isCurrent
                    ? 'bg-[#2D2D2A] text-white ring-2 ring-[#D9480F]'
                    : 'bg-white hover:bg-neutral-100 text-[#2D2D2A]'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-display text-2xl font-medium">
                    TABLE {table.tableNumber}
                  </span>
                  {isCurrent && <Check className="w-4 h-4 text-[#D9480F]" />}
                </div>

                <div className="font-mono-code text-[11px] uppercase font-bold space-y-0.5">
                  <div className={isCurrent ? 'text-neutral-300' : 'text-[#2D2D2A]/60'}>
                    {table.guestCount} GUESTS
                  </div>
                  <div className={isCurrent ? 'text-[#D9480F]' : 'text-[#D9480F]'}>
                    {table.status.toUpperCase()}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
