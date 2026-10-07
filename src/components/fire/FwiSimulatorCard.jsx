import React from 'react';
import { RefreshCw, Cpu } from 'lucide-react';

/**
 * FwiSimulatorCard: Interactive deterministic pseudo-FWI engine simulator form.
 * Migrated to pure Tailwind CSS v4.
 */
export const FwiSimulatorCard = ({
  temp,
  rh,
  solar,
  rain,
  onTempChange,
  onRhChange,
  onSolarChange,
  onRainChange,
  onCalculate,
  calculating = false
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs mt-5 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="text-blue" size={18} />
            <h3 className="text-base font-bold text-slate-800">Interactive Pseudo-FWI Engine & Simulator</h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Kalkulasi instan formula Van Wagner: <code className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-mono text-[11px]">Pseudo-FWI = (0.35 × Suhu) + (0.35 × RH) + (0.20 × Radiasi) + (0.10 × Hujan)</code>
          </p>
        </div>
        <button 
          type="button"
          className="h-9 px-4 text-xs font-semibold text-white bg-blue hover:bg-blue2 rounded-lg flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer" 
          onClick={onCalculate}
          disabled={calculating}
        >
          <RefreshCw size={13} className={calculating ? 'animate-spin' : ''} />
          <span>{calculating ? 'Menghitung...' : 'Kalkulasi Ulang'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mt-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">Suhu Udara (°C)</label>
          <input
            type="number"
            step="0.5"
            className="w-full h-10 px-3.5 text-xs bg-slate-50/60 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-blue focus:ring-2 focus:ring-blue/15 transition-colors font-mono"
            value={temp}
            onChange={(e) => onTempChange(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">Kelembaban RH (%)</label>
          <input
            type="number"
            step="1"
            className="w-full h-10 px-3.5 text-xs bg-slate-50/60 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-blue focus:ring-2 focus:ring-blue/15 transition-colors font-mono"
            value={rh}
            onChange={(e) => onRhChange(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">Radiasi Surya (W/m²)</label>
          <input
            type="number"
            step="10"
            className="w-full h-10 px-3.5 text-xs bg-slate-50/60 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-blue focus:ring-2 focus:ring-blue/15 transition-colors font-mono"
            value={solar}
            onChange={(e) => onSolarChange(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">Curah Hujan (mm/jam)</label>
          <input
            type="number"
            step="0.5"
            className="w-full h-10 px-3.5 text-xs bg-slate-50/60 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-blue focus:ring-2 focus:ring-blue/15 transition-colors font-mono"
            value={rain}
            onChange={(e) => onRainChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

