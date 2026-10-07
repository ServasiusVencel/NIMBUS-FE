import React from 'react';
import { 
  Radio, 
  Thermometer, 
  Droplets, 
  Sun, 
  Wind, 
  Flame, 
  BatteryCharging, 
  Wifi, 
  CloudRain, 
  ArrowRight, 
  Download 
} from 'lucide-react';

/**
 * FleetSensorCard: Dedicated presentational component for an individual IoT Sensor Station.
 * Directly leverages OOP domain methods from the SensorStation instance.
 */
export const FleetSensorCard = ({
  sensor,
  onFocusMap,
  onViewWeather,
  onExportCsv
}) => {
  const r = sensor.currentReadings || {};
  const fire = sensor.getFireRiskSummary ? sensor.getFireRiskSummary() : { level: 'Moderate', score: 0.45, isHigh: false };
  const isTmat = sensor.isTmatEquipped ? sensor.isTmatEquipped() : false;
  const isTmatCrit = sensor.isTmatCritical ? sensor.isTmatCritical() : false;
  const tmatVal = r.water_table_depth_cm;
  const rainInfo = sensor.getPrecipitationAssessment ? sensor.getPrecipitationAssessment() : { isRaining: false, rainMm: 0 };
  const isRain = rainInfo.isRaining;

  return (
    <div className="bg-white border border-slate-200/90 hover:border-sky-300 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
      {/* Station Card Header */}
      <div>
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 font-bold">
              <Radio size={16} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-mono font-bold text-xs text-sky-700">
                  {sensor.id}
                </span>
                {isTmat && (
                  <span className="text-[9px] font-bold font-mono px-1 py-0.2 rounded bg-teal-50 text-teal-700 border border-teal-200">
                    TMAT
                  </span>
                )}
              </div>
              <h4 className="text-xs font-bold text-slate-800 line-clamp-1">
                {sensor.name}
              </h4>
            </div>
          </div>

          <div className="flex flex-col items-end">
            <span className="inline-flex items-center gap-1 text-[10px] font-bold font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              ONLINE
            </span>
            <span className="text-[10px] text-slate-400 font-mono mt-0.5">
              {sensor.lastSync || 'Just now'}
            </span>
          </div>
        </div>

        {/* 4-Parameter Telemetry Grid */}
        <div className="grid grid-cols-4 gap-2 mb-3.5 bg-slate-50/70 p-2.5 rounded-xl border border-slate-100">
          <div className="text-center">
            <span className="text-[10px] text-slate-400 flex items-center justify-center gap-0.5">
              <Thermometer size={10} className="text-amber-500" /> Suhu
            </span>
            <span className="text-xs font-bold font-mono text-slate-800 block mt-0.5">
              {r.air_temperature_c}°C
            </span>
          </div>
          <div className="text-center">
            <span className="text-[10px] text-slate-400 flex items-center justify-center gap-0.5">
              <Droplets size={10} className="text-sky-500" /> RH
            </span>
            <span className="text-xs font-bold font-mono text-slate-800 block mt-0.5">
              {r.relative_humidity_pct}%
            </span>
          </div>
          <div className="text-center">
            <span className="text-[10px] text-slate-400 flex items-center justify-center gap-0.5">
              <Sun size={10} className="text-orange-500" /> Radiasi
            </span>
            <span className="text-xs font-bold font-mono text-slate-800 block mt-0.5">
              {r.solar_radiation_wm2}
            </span>
          </div>
          <div className="text-center">
            <span className="text-[10px] text-slate-400 flex items-center justify-center gap-0.5">
              <Wind size={10} className="text-teal-500" /> Angin
            </span>
            <span className="text-xs font-bold font-mono text-slate-800 block mt-0.5">
              {r.wind_speed_ms}m/s
            </span>
          </div>
        </div>

        {/* Dual Hazard Gauges */}
        <div className="space-y-2.5 mb-4 text-xs">
          {/* Fire Risk Gauge */}
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-semibold text-slate-600 flex items-center gap-1">
                <Flame size={12} className={fire.isHigh ? 'text-red-500' : 'text-amber-500'} />
                Potensi Karhutla (FWI)
              </span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                fire.isHigh 
                  ? 'bg-red-50 text-red-700 border border-red-200' 
                  : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}>
                {fire.level.toUpperCase()} ({fire.score})
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
              <div 
                className={`h-full rounded-full ${
                  fire.isHigh ? 'bg-red-500' : 'bg-amber-500'
                }`}
                style={{ width: `${Math.min(fire.score * 100, 100)}%` }}
              />
            </div>
          </div>

          {/* Groundwater TMAT Gauge */}
          <div className={`p-2.5 rounded-xl border ${
            isTmatCrit 
              ? 'bg-red-50/60 border-red-200' 
              : 'bg-slate-50 border-slate-100'
          }`}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-semibold text-slate-600 flex items-center gap-1">
                <Droplets size={12} className={isTmatCrit ? 'text-red-500' : 'text-teal-500'} />
                Kedalaman Gambut (TMAT)
              </span>
              {isTmat ? (
                <span className={`text-[10px] font-bold font-mono px-1.5 py-0.5 rounded ${
                  isTmatCrit 
                    ? 'bg-red-100 text-red-700' 
                    : 'bg-teal-50 text-teal-700 border border-teal-200'
                }`}>
                  {tmatVal} cm {isTmatCrit && '⚠️ Melewati Batas'}
                </span>
              ) : (
                <span className="text-[10px] text-slate-400">
                  AWS Standar (Non-Gambut)
                </span>
              )}
            </div>
            {isTmat && (
              <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                <div 
                  className={`h-full rounded-full ${
                    isTmatCrit ? 'bg-red-500' : 'bg-teal-500'
                  }`}
                  style={{ 
                    // Scale: -10cm = 100%, -70cm = 10%
                    width: `${Math.max(10, Math.min(100, (1 - Math.abs(tmatVal || -40) / 70) * 100))}%` 
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Hardware & Rain Status */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 px-1 mb-4">
          <span className="inline-flex items-center gap-1">
            <BatteryCharging size={13} className="text-emerald-500" /> 98% Baterai
          </span>
          <span className="inline-flex items-center gap-1">
            <Wifi size={13} className="text-sky-500" /> 4G LTE
          </span>
          <span className="inline-flex items-center gap-1">
            <CloudRain size={13} className={isRain ? 'text-sky-500' : 'text-slate-400'} />
            {isRain ? `${rainInfo.rainMm} mm/jam` : 'Kering'}
          </span>
        </div>
      </div>

      {/* Card Action Buttons */}
      <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
        <button
          type="button"
          onClick={() => onFocusMap(sensor.id)}
          className="flex-1 py-2 px-3 bg-slate-50 hover:bg-sky-50 text-slate-700 hover:text-sky-700 text-xs font-semibold rounded-xl border border-slate-200 hover:border-sky-200 transition text-center cursor-pointer flex items-center justify-center gap-1"
        >
          <span>Fokus Peta</span>
          <ArrowRight size={12} />
        </button>
        <button
          type="button"
          onClick={() => onViewWeather(sensor.id)}
          className="py-2 px-3 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-semibold rounded-xl border border-slate-200 transition text-center cursor-pointer"
        >
          Cuaca
        </button>
        <button
          type="button"
          onClick={() => onExportCsv(sensor)}
          className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition cursor-pointer"
          title="Unduh Telemetri CSV"
        >
          <Download size={13} />
        </button>
      </div>
    </div>
  );
};
