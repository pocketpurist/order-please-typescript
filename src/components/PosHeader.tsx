import React, { useEffect, useState } from 'react';
import { Search, Volume2, VolumeX, ChevronDown, BatteryMedium, Sparkles } from 'lucide-react';
import { TableDetails } from '../types';
import { playPosClick, toggleMuteAudio } from '../utils/audio';

interface PosHeaderProps {
  currentTable: TableDetails;
  waiterName: string;
  waiterId: string;
  onOpenSearch: () => void;
  onOpenFloorPlan: () => void;
}

export const PosHeader: React.FC<PosHeaderProps> = ({
  currentTable,
  waiterName,
  waiterId,
  onOpenSearch,
  onOpenFloorPlan,
}) => {
  const [secondsElapsed, setSecondsElapsed] = useState(515); // ~08:35 in seconds
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleMuteToggle = () => {
    const nextMuted = toggleMuteAudio();
    setMuted(nextMuted);
    if (!nextMuted) {
      playPosClick();
    }
  };

  return (
    <header
      id="pos-status-header"
      className="bg-[#FDFCF8] text-[#2D2D2A] border-b-2 border-[#2D2D2A] px-4 sm:px-8 py-3.5 sm:py-4 flex flex-wrap items-center justify-between gap-3 select-none shrink-0"
    >
      {/* Left: Terminal Station Pill & Table Pill */}
      <div className="flex items-center gap-2.5 sm:gap-4">
        <div className="border-2 border-[#2D2D2A] px-3 py-1 font-mono-code font-bold text-xs tracking-wider uppercase bg-white">
          BISTRO_POS_V1
        </div>

        <button
          id="btn-switch-table-header"
          onClick={() => {
            playPosClick();
            onOpenFloorPlan();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 border-2 border-[#2D2D2A] hover:bg-[#2D2D2A] hover:text-white transition-colors group text-left cursor-pointer bg-white"
          title="Switch Table or Edit Party Size"
        >
          <span className="w-2 h-2 rounded-full bg-[#D9480F] group-hover:bg-white animate-pulse"></span>
          <span className="font-mono-code font-bold text-xs tracking-wider uppercase">
            TABLE {currentTable.tableNumber} • {currentTable.guestCount} GUESTS
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-[#2D2D2A] group-hover:text-white transition-transform ml-1" />
        </button>
      </div>

      {/* Center: Live Timer & Battery status */}
      <div className="flex items-center gap-3">
        <div className="font-mono-code text-xs uppercase tracking-widest text-[#2D2D2A] font-bold">
          {formatTimer(secondsElapsed)} • 92% BATT
        </div>
      </div>

      {/* Right: Search, Sound, Server Name */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          id="btn-quick-search-dish"
          onClick={() => {
            playPosClick();
            onOpenSearch();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 border-2 border-[#2D2D2A] bg-white hover:bg-[#2D2D2A] hover:text-white transition-colors font-mono-code text-xs font-bold uppercase tracking-wider cursor-pointer"
          title="Search dish (Cmd/Ctrl+K)"
        >
          <Search className="w-3.5 h-3.5 text-[#D9480F]" />
          <span>FIND</span>
        </button>

        <div className="hidden md:flex items-center gap-1.5 font-mono-code text-xs text-[#2D2D2A]/70 px-2 py-1">
          <span>{waiterName}</span>
          <span className="text-[#D9480F] font-bold">{waiterId}</span>
        </div>

        <button
          id="btn-toggle-sound"
          onClick={handleMuteToggle}
          className="p-1.5 border-2 border-[#2D2D2A] bg-white hover:bg-[#2D2D2A] hover:text-white transition-colors cursor-pointer"
          title={muted ? 'Unmute tactile POS click' : 'Mute tactile POS click'}
        >
          {muted ? (
            <VolumeX className="w-3.5 h-3.5 text-[#2D2D2A]/60" />
          ) : (
            <Volume2 className="w-3.5 h-3.5 text-[#D9480F]" />
          )}
        </button>
      </div>
    </header>
  );
};
