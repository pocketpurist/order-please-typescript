import React from 'react';
import { CheckCircle2, Printer, ArrowRight } from 'lucide-react';
import { TableDetails, OrderItem } from '../types';
import { playPosClick } from '../utils/audio';

interface KitchenSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  table: TableDetails;
  orderItems: OrderItem[];
  ticketNumber: number;
}

export const KitchenSuccessModal: React.FC<KitchenSuccessModalProps> = ({
  isOpen,
  onClose,
  table,
  orderItems,
  ticketNumber,
}) => {
  if (!isOpen) return null;

  const total = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0) * 1.0825;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs">
      <div
        id="modal-kitchen-dispatched"
        className="bg-[#FDFCF8] border-2 border-[#2D2D2A] w-full max-w-md p-6 text-[#2D2D2A] shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150"
      >
        <div className="text-center space-y-2 pb-4 border-b-2 border-[#2D2D2A]">
          <div className="w-12 h-12 border-2 border-[#2D2D2A] mx-auto flex items-center justify-center bg-white text-[#D9480F]">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div className="pos-label">DISPATCH SUCCESSFUL</div>
          <h3 className="font-display text-3xl uppercase font-medium">TICKET #{ticketNumber}</h3>
          <p className="font-mono-code text-xs text-[#2D2D2A]/70 uppercase font-bold">
            TABLE {table.tableNumber} • SENT TO EXPEDITE LINE
          </p>
        </div>

        {/* Receipt simulation */}
        <div className="bg-white border-2 border-[#2D2D2A] p-4 font-mono-code text-xs space-y-2 max-h-48 overflow-y-auto">
          <div className="flex justify-between border-b border-[#2D2D2A]/20 pb-1 text-[11px] text-[#2D2D2A]/60 font-bold uppercase">
            <span>ITEM</span>
            <span>AMT</span>
          </div>
          {orderItems.map((item, idx) => (
            <div key={idx} className="flex justify-between items-baseline">
              <span className="truncate pr-2">
                <span className="text-[#D9480F] font-bold">{item.quantity}x</span> {item.name}
              </span>
              <span className="shrink-0 font-bold">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="border-t border-[#2D2D2A]/20 pt-2 flex justify-between font-bold text-sm">
            <span>TOTAL BILLED</span>
            <span className="text-[#D9480F]">${total.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={() => {
              playPosClick();
              alert(`Simulated kitchen chit printed for Ticket #${ticketNumber}`);
            }}
            className="flex-1 py-3 border-2 border-[#2D2D2A] bg-white font-mono-code text-xs font-bold uppercase flex items-center justify-center gap-1.5 hover:bg-neutral-100 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>PRINT CHIT</span>
          </button>
          <button
            id="btn-next-order-done"
            onClick={() => {
              playPosClick();
              onClose();
            }}
            className="flex-1 py-3 bg-[#2D2D2A] text-white border-2 border-[#2D2D2A] font-mono-code text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 hover:bg-[#D9480F] hover:border-[#D9480F] transition-colors cursor-pointer"
          >
            <span>NEXT TICKET</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
