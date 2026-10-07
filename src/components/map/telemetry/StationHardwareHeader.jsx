import React from 'react';
import { MapPin, Clock, Battery, Signal, Cpu } from 'lucide-react';

/**
 * StationHardwareHeader: Renders station identity, geospatial coordinates,
 * and IoT hardware diagnostics (battery voltage, GSM signal, microcontroller).
 */
export const StationHardwareHeader = ({ sensor }) => {
  if (!sensor) return null;

  const coords = sensor.formatCoordinates 
    ? sensor.formatCoordinates() 
    : `${sensor.latitude?.toFixed(4)}, ${sensor.longitude?.toFixed(4)}`;
  const hasTmat = sensor.isTmatEquipped ? sensor.isTmatEquipped() : !!sensor.capabilities?.groundwater_tmat;
  const isOnline = sensor.status === 'online';
  const isWarning = sensor.status === 'warning';

  return (
    <div className="pb-3.5 border-b border-slate-100 space-y-2.5">
      {/* 1. Baris Atas: Badges Status & Waktu Sync */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 flex-wrap min-w-0">
          <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/80 whitespace-nowrap">
            {sensor.id}
          </span>
          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-bold border font-mono whitespace-nowrap ${
            isOnline 
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
              : isWarning 
              ? 'bg-amber-50 text-amber-700 border-amber-200' 
              : 'bg-red-50 text-red-700 border-red-200'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${
              isOnline ? 'bg-emerald-500' : isWarning ? 'bg-amber-500' : 'bg-red-500'
            }`} />
            {sensor.status?.toUpperCase() || 'ONLINE'}
          </span>
          {hasTmat && (
            <span className="bg-teal-50 text-teal-700 border border-teal-200 text-[10px] font-bold px-1.5 py-0.5 rounded-md font-mono whitespace-nowrap">
              TMAT
            </span>
          )}
        </div>

        {/* Last Sync Badge */}
        <div 
          className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400 bg-slate-50 px-2 py-1 rounded-md border border-slate-100 shrink-0 whitespace-nowrap"
          title={sensor.lastSync}
        >
          <Clock size={12} className="shrink-0" />
          <span className="truncate max-w-[140px] sm:max-w-[180px]">{sensor.lastSync}</span>
        </div>
      </div>

      {/* 2. Nama Stasiun & Koordinat (Lega 100% Lebar Penuh) */}
      <div>
        <h3 className="text-base font-bold text-slate-900 tracking-tight leading-snug">
          {sensor.name}
        </h3>

        <div className="flex items-center gap-3 text-[11px] font-mono text-slate-500 mt-1 flex-wrap">
          <span className="flex items-center gap-1 whitespace-nowrap">
            <MapPin size={12} className="text-sky-500 shrink-0" />
            <span>{coords}</span>
          </span>
          <span className="whitespace-nowrap">• Elevasi: 38 mdpl</span>
        </div>
      </div>

      {/* Hardware Diagnostics Bar */}
      <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-100/80 text-[11px] font-mono">
        <div className="bg-slate-50/80 rounded-lg p-2 border border-slate-100">
          <span className="text-slate-400 flex items-center gap-1 text-[10px]">
            <Battery size={11} className="text-emerald-500" /> DAYA AKI
          </span>
          <span className="font-bold text-slate-800 text-xs">12.6 V</span>
          <span className="block text-[9px] text-emerald-600 font-sans">Solar Charging</span>
        </div>

        <div className="bg-slate-50/80 rounded-lg p-2 border border-slate-100">
          <span className="text-slate-400 flex items-center gap-1 text-[10px]">
            <Signal size={11} className="text-sky-500" /> GSM 4G
          </span>
          <span className="font-bold text-slate-800 text-xs">-74 dBm</span>
          <span className="block text-[9px] text-sky-600 font-sans">Sinyal Kuat</span>
        </div>

        <div className="bg-slate-50/80 rounded-lg p-2 border border-slate-100">
          <span className="text-slate-400 flex items-center gap-1 text-[10px]">
            <Cpu size={11} className="text-indigo-500" /> NODE IOT
          </span>
          <span className="font-bold text-slate-800 text-xs truncate">ESP32-S3</span>
          <span className="block text-[9px] text-slate-400 font-sans">Tx 5 Menit</span>
        </div>
      </div>
    </div>
  );
};

export default StationHardwareHeader;
