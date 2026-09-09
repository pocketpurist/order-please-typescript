import React from 'react';
import { Send, Clock, Split, ShoppingBag } from 'lucide-react';
import { playPosClick, playKitchenChime } from '../utils/audio';

interface PosFooterProps {
  orderCount: number;
  onFireToKitchen: () => void;
  onHoldOrder: () => void;
  onSplitBill: () => void;
  isMobileDrawerOpen: boolean;
  onToggleMobileDrawer: () => void;
  subtotal: number;
}

export const PosFooter: React.FC<PosFooterProps> = ({
  orderCount,
  onFireToKitchen,
  onHoldOrder,
  onSplitBill,
  isMobileDrawerOpen,
  onToggleMobileDrawer,
  subtotal,
}) => {
  return (
    <footer
      id="pos-terminal-footer"
      className="bg-white border-t-2 border-[#2D2D2A] px-4 sm:px-8 lg:px-10 py-3.5 sm:py-4 flex flex-wrap items-center justify-between gap-3 shrink-0 select-none"
    >
      {/* Mobile Drawer Trigger (if small screen) */}
      <div className="lg:hidden flex items-center gap-2">
        <button
          id="btn-mobile-order-drawer"
          onClick={() => {
            playPosClick();
            onToggleMobileDrawer();
          }}
          className="flex items-center gap-2 px-3 py-2 border-2 border-[#2D2D2A] bg-white font-mono-code text-xs font-bold uppercase tracking-wider"
        >
          <ShoppingBag className="w-4 h-4 text-[#D9480F]" />
          <span>ORDER ({orderCount})</span>
          <span className="text-[#D9480F]">${subtotal.toFixed(2)}</span>
        </button>
      </div>

      {/* Variation 7 Actions */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-4">
        <button
          id="btn-split-bill"
          onClick={() => {
            playPosClick();
            onSplitBill();
          }}
          className="font-mono-code text-xs sm:text-[13px] font-bold px-4 sm:px-6 py-2.5 sm:py-3 border-2 border-[#2D2D2A] bg-white text-[#2D2D2A] hover:bg-[#2D2D2A] hover:text-white transition-colors uppercase tracking-wider cursor-pointer"
        >
          SPLIT BILL
        </button>

        <button
          id="btn-hold-order"
          onClick={() => {
            playPosClick();
            onHoldOrder();
          }}
          className="font-mono-code text-xs sm:text-[13px] font-bold px-4 sm:px-6 py-2.5 sm:py-3 border-2 border-[#2D2D2A] bg-white text-[#2D2D2A] hover:bg-[#2D2D2A] hover:text-white transition-colors uppercase tracking-wider cursor-pointer"
        >
          HOLD ORDER
        </button>

        <button
          id="btn-fire-to-kitchen"
          disabled={orderCount === 0}
          onClick={() => {
            playKitchenChime();
            onFireToKitchen();
          }}
          className={`font-mono-code text-xs sm:text-[13px] font-bold px-5 sm:px-7 py-2.5 sm:py-3 border-2 border-[#2D2D2A] uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
            orderCount === 0
              ? 'bg-neutral-200 text-neutral-400 border-neutral-300 cursor-not-allowed'
              : 'bg-[#2D2D2A] text-white hover:bg-[#D9480F] hover:border-[#D9480F]'
          }`}
        >
          <Send className="w-3.5 h-3.5" />
          <span>FIRE TO KITCHEN</span>
        </button>
      </div>

      {/* Right: Terminal Station ID */}
      <div className="font-mono-code text-xs text-[#2D2D2A]/70 uppercase font-bold tracking-widest hidden sm:block">
        TERMINAL STATION: 04
      </div>
    </footer>
  );
};
