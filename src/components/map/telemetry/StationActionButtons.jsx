import React from 'react';
import { CloudRain, Flame, Download, ArrowRight } from 'lucide-react';
import { exportTelemetryCsv } from '../../../utils/exportTelemetryCsv';

/**
 * StationActionButtons: Quick action triggers for deep station exploration:
 * Weather detail navigation, Fire danger modeling, and CSV telemetry export.
 */
export const StationActionButtons = ({ sensor, onViewWeather, onViewFire }) => {
  if (!sensor) return null;

  const handleExport = () => {
    exportTelemetryCsv({ sensor });
  };

  return (
    <div className="pt-3 border-t border-slate-100 space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <button 
          type="button"
          className="py-2.5 px-3 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs shadow-sky-500/20 group"
          onClick={onViewWeather}
        >
          <CloudRain size={13} />
          <span>Analisis Cuaca</span>
          <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
        </button>
        
        <button 
          type="button"
          className="py-2.5 px-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer group"
          onClick={onViewFire}
        >
          <Flame size={13} className="text-red-500" />
          <span>Model FWI Api</span>
          <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>

      <button
        type="button"
        onClick={handleExport}
        className="w-full py-2 px-3 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 rounded-xl text-xs font-medium transition flex items-center justify-center gap-1.5 cursor-pointer"
      >
        <Download size={13} />
        <span>Unduh Raw Telemetri CSV Stasiun Ini</span>
      </button>
    </div>
  );
};

export default StationActionButtons;
