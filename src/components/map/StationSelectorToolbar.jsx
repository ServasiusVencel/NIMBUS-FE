import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Radio, ChevronLeft, ChevronRight } from 'lucide-react';


export const StationSelectorToolbar = ({
  sensors = [],
  selectedSensorId,
  onSelectStation,
  showLabel = true,
  label = 'Pilih Stasiun:',
  showTmat = true,
  className = ''
}) => {
  const chipsScrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Check scroll boundary to enable/disable arrow buttons
  const checkScroll = useCallback(() => {
    const el = chipsScrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 2);
  }, []);

  useEffect(() => {
    checkScroll();
    const el = chipsScrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll);
    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [checkScroll, sensors]);

  const scrollChips = (offset) => {
    if (chipsScrollRef.current) {
      chipsScrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <div className={`flex items-center gap-2 min-w-0 ${className}`}>
      {/* Optional Leading Label */}
      {showLabel && (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 shrink-0 mr-0.5">
          <Radio size={13} className="text-sky-500" /> {label}
        </span>
      )}

      {/* Left Scroll Arrow Button */}
      <button
        type="button"
        onClick={() => scrollChips(-200)}
        disabled={!canScrollLeft}
        aria-label="Geser daftar stasiun ke kiri"
        title="Geser ke kiri"
        className={`p-1.5 rounded-lg border transition shrink-0 cursor-pointer ${canScrollLeft
            ? 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200/90 shadow-2xs hover:border-slate-300'
            : 'bg-slate-100/60 text-slate-300 border-slate-100 cursor-not-allowed opacity-40'
          }`}
      >
        <ChevronLeft size={14} />
      </button>

      {/* Scrollable Chips List with Mouse Wheel Support */}
      <div
        ref={chipsScrollRef}
        onWheel={(e) => {
          if (e.deltaY !== 0) {
            e.currentTarget.scrollLeft += e.deltaY;
          }
        }}
        className="flex items-center gap-1.5 overflow-x-auto scrollbar-none scroll-smooth py-0.5 min-w-0 flex-1"
      >
        {sensors.map((s) => {
          const isSelected = s.id === selectedSensorId;
          const isOnline = s.status === 'online';
          const isWarning = s.status === 'warning';
          const hasTmat = s.capabilities?.groundwater_tmat || (s.isTmatEquipped && s.isTmatEquipped());

          return (
            <button
              key={s.id}
              type="button"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition cursor-pointer shrink-0 border ${isSelected
                  ? 'bg-sky-500 text-white border-sky-500 shadow-xs shadow-sky-500/25'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200/80 hover:border-slate-300'
                }`}
              onClick={() => onSelectStation && onSelectStation(s)}
            >
              <span
                className={`w-2 h-2 rounded-full ${isSelected
                    ? 'bg-white'
                    : isOnline
                      ? 'bg-emerald-500'
                      : isWarning
                        ? 'bg-amber-500'
                        : 'bg-red-500'
                  }`}
              />
              <span>{s.id}</span>
              {showTmat && hasTmat && (
                <span
                  className={`text-[9px] px-1 py-0.5 rounded font-bold ${isSelected
                      ? 'bg-sky-600 text-white'
                      : 'bg-teal-50 text-teal-700 border border-teal-200'
                    }`}
                >
                  TMAT
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Right Scroll Arrow Button */}
      <button
        type="button"
        onClick={() => scrollChips(200)}
        disabled={!canScrollRight}
        aria-label="Geser daftar stasiun ke kanan"
        title="Geser ke kanan"
        className={`p-1.5 rounded-lg border transition shrink-0 cursor-pointer ${canScrollRight
            ? 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200/90 shadow-2xs hover:border-slate-300'
            : 'bg-slate-100/60 text-slate-300 border-slate-100 cursor-not-allowed opacity-40'
          }`}
      >
        <ChevronRight size={14} />
      </button>
    </div>
  );
};

export default StationSelectorToolbar;
