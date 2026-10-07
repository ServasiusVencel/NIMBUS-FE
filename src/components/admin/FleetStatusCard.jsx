import React from 'react';
import { ArrowRight, Radio } from 'lucide-react';

/**
 * FleetStatusCard: Displays mini fleet telemetry status badges
 * and quick-jump navigation to Leaflet GIS Map.
 * Migrated to pure Tailwind CSS v4.
 */
export const FleetStatusCard = ({ sensors = [], onOpenMap }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
          <div className="flex items-center gap-2">
            <Radio className="text-blue" size={18} />
            <h3 className="text-base font-bold text-slate-800">Live IoT Telemetry Fleet Status</h3>
          </div>
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-sky-50 text-sky-700 border border-sky-200">
            {sensors.length} Active Stations
          </span>
        </div>
        <p className="text-xs text-slate-500 mb-3.5 leading-relaxed">
          Status konektivitas stasiun cuaca otomatis (AWS) dan piezometer kedalaman gambut (TMAT):
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {sensors.map(s => {
            const hasTmat = s.isTmatEquipped ? s.isTmatEquipped() : !!s.capabilities?.groundwater_tmat;
            const waterDepth = s.currentReadings?.water_table_depth_cm;
            const isOnline = s.status === 'online';
            const isWarning = s.status === 'warning';

            return (
              <div 
                key={s.id}
                className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/70 hover:bg-slate-100/70 transition-colors text-xs"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono font-bold text-slate-800 text-[11px]">{s.id}</span>
                  <span 
                    className={`w-2 h-2 rounded-full ${
                      isOnline ? 'bg-emerald-500 ring-2 ring-emerald-200' : 
                      isWarning ? 'bg-amber-500 ring-2 ring-amber-200' : 
                      'bg-red-500 ring-2 ring-red-200'
                    }`} 
                  />
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  {hasTmat ? `TMAT: ${waterDepth}cm` : 'Standar AWS'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs flex-wrap gap-2">
        <span className="text-slate-400 text-[11px]">Wilayah: Riau, Jambi, Palembang, Kalimantan</span>
        <button 
          type="button"
          className="px-3 py-1.5 text-xs font-semibold text-blue bg-blue/5 hover:bg-blue/10 border border-blue/20 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
          onClick={onOpenMap}
        >
          <span>Buka Peta Leaflet</span>
          <ArrowRight size={13} />
        </button>
      </div>
    </div>
  );
};

