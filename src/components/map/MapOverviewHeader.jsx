import React from 'react';
import { Radio, Clock } from 'lucide-react';

/**
 * MapOverviewHeader: Renders the clean top title banner for the GIS IoT Map,
 * displaying station identification and live connection status.
 * Migrated to pure Tailwind CSS v4.
 */
export const MapOverviewHeader = ({
  selectedSensor,
}) => {
  const isOnline = selectedSensor?.status === 'online';
  const isWarning = selectedSensor?.status === 'warning';

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs mb-5 animate-fade-in">
      {/* Title, Subtitle, & Station Live Badge */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="bg-sky-50 text-sky-700 border border-sky-100 text-[10px] font-bold px-2 py-0.5 rounded-md font-mono tracking-wider">
              ENTERPRISE SENSOR NETWORK
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 border border-slate-200/80 px-2.5 py-0.5 rounded-md font-mono">
              <Radio size={13} className="text-sky-500 animate-pulse shrink-0" />
              Stasiun Aktif: <strong className="text-slate-900">{selectedSensor?.id}</strong>
              <span className="text-slate-400 hidden sm:inline">({selectedSensor?.name})</span>
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-2.5">
            Interactive IoT & Climate Intelligence Map
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl leading-relaxed">
            Pemantauan geospasial real-time stasiun cuaca otomatis (AWS), analisis resiko kebakaran gambut (FWI), hidrologi kedalaman air tanah (TMAT), dan presipitasi curah hujan.
          </p>
        </div>

        {/* Sync Status Badge */}
        <div className="flex items-center gap-3 shrink-0 self-start lg:self-center">
          <div className="inline-flex items-center gap-1.5 text-xs text-slate-500 font-mono bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/80">
            <Clock size={13} className="text-slate-400 shrink-0" />
            <span>Update: <strong className="text-slate-700">{selectedSensor?.lastSync || 'Live'}</strong></span>
          </div>
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold border font-mono ${
            isOnline 
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
              : isWarning
              ? 'bg-amber-50 text-amber-700 border-amber-200'
              : 'bg-red-50 text-red-700 border-red-200'
          }`}>
            <span className={`w-2 h-2 rounded-full ${
              isOnline ? 'bg-emerald-500 ring-2 ring-emerald-200' : isWarning ? 'bg-amber-500 ring-2 ring-amber-200' : 'bg-red-500 ring-2 ring-red-200'
            }`} />
            {selectedSensor?.status?.toUpperCase() || 'ONLINE'}
          </span>
        </div>
      </div>
    </div>
  );
};
