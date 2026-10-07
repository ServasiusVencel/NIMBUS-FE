import React from 'react';
import { Popup } from 'react-leaflet';
import { ArrowRight } from 'lucide-react';

/**
 * StationMarkerPopup: Renders informative tooltip popup inside Leaflet map markers.
 * Migrated to pure Tailwind CSS v4.
 */
export const StationMarkerPopup = ({ sensor, onViewDetail }) => {
  const currentReadings = sensor.currentReadings || {};
  const coords = sensor.formatCoordinates 
    ? sensor.formatCoordinates() 
    : `${sensor.latitude?.toFixed(4)}, ${sensor.longitude?.toFixed(4)}`;
  const hasTmat = sensor.isTmatEquipped ? sensor.isTmatEquipped() : sensor.capabilities?.groundwater_tmat;
  const isTmatCrit = sensor.isTmatCritical ? sensor.isTmatCritical() : false;
  const isOnline = sensor.status === 'online';
  const isWarning = sensor.status === 'warning';

  return (
    <Popup>
      <div className="p-3 w-56 font-sans">
        {/* Header Row */}
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
          <span className="font-mono font-bold text-xs text-sky-600 bg-sky-50 px-1.5 py-0.5 rounded border border-sky-100">
            {sensor.id}
          </span>
          <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold font-mono border ${
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
        </div>

        {/* Station Name & Coordinates */}
        <div className="text-xs font-bold text-slate-800 leading-snug">{sensor.name}</div>
        <div className="text-[10px] font-mono text-slate-400 mt-0.5 mb-2.5">
          GPS: {coords}
        </div>

        {/* Readings Preview */}
        <div className="space-y-1 text-xs text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100 mb-3">
          <div className="flex justify-between">
            <span className="text-slate-400">Suhu:</span>
            <span className="font-mono font-semibold text-slate-800">{currentReadings.air_temperature_c}°C</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Kelembaban:</span>
            <span className="font-mono font-semibold text-slate-800">{currentReadings.relative_humidity_pct}%</span>
          </div>
          {hasTmat && (
            <div className="flex justify-between">
              <span className="text-slate-400">TMAT:</span>
              <span className={`font-mono font-bold ${isTmatCrit ? 'text-red-600' : 'text-teal-700'}`}>
                {currentReadings.water_table_depth_cm} cm
              </span>
            </div>
          )}
        </div>

        {/* View Detail Action Button */}
        <button 
          className="w-full py-2 px-3 bg-sky-500 hover:bg-sky-600 text-white rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs shadow-sky-500/20 group"
          onClick={onViewDetail}
        >
          <span>Buka Detail Cuaca</span>
          <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </Popup>
  );
};
