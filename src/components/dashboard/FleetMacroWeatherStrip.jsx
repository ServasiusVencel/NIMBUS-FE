import React from 'react';
import { 
  Thermometer, 
  Droplets, 
  CloudRain, 
  Wind, 
  Waves, 
  Sun,
  Flame,
  ArrowUpRight
} from 'lucide-react';

/**
 * FleetMacroWeatherStrip: Executive Macro Climate Overview across the entire concession.
 * Aggregates all IoT stations into high-level meteorological insights.
 */
export const FleetMacroWeatherStrip = ({ summary, onFocusStation }) => {
  if (!summary) return null;

  const tempRange = summary.tempRange || { min: 28, max: 34 };
  const hottest = summary.hottestStation;
  const wettest = summary.wettestStation;
  const windiest = summary.windiestStation;
  const driestPeat = summary.driestPeatStation;
  const avgTmat = summary.averageWaterTableDepth;

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 mb-4">
        <div>
          <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400 font-mono">
            CONCESSION-WIDE METEOROLOGY
          </span>
          <h3 className="text-sm font-bold text-slate-800">
            Kondisi Iklim Mikro Rata-Rata Seluruh Area Konsesi
          </h3>
        </div>
        <span className="text-xs text-slate-400 font-mono">
          Rerata Terhitung dari {summary.totalCount} Titik AWS
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
        
        {/* Metric 1: Suhu Rata-rata & Rentang */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-xs font-semibold text-slate-600">Suhu Rata-rata</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Thermometer size={15} />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-extrabold text-slate-900 font-mono">
                {summary.averageTemperature}
              </span>
              <span className="text-xs text-slate-400 font-mono">°C</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-between font-mono">
              <span>Min {tempRange.min}°C</span>
              <span>Max {tempRange.max}°C</span>
            </div>
            {hottest && (
              <div className="mt-1 text-[10px] text-amber-700 font-medium truncate">
                Terpanas: {hottest.id} ({hottest.currentReadings?.air_temperature_c}°C)
              </div>
            )}
          </div>
        </div>

        {/* Metric 2: Kelembaban Rata-rata */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-xs font-semibold text-slate-600">Kelembaban (RH)</span>
            <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
              <Droplets size={15} />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-extrabold text-slate-900 font-mono">
                {summary.averageHumidity}
              </span>
              <span className="text-xs text-slate-400 font-mono">%</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1 font-mono">
              {summary.averageHumidity < 60 ? 'Kering / Rawan' : 'Cukup Lembab'}
            </p>
            <div className="mt-1 text-[10px] text-sky-700 font-medium">
              Radiasi: {summary.averageSolarRadiation} W/m²
            </div>
          </div>
        </div>

        {/* Metric 3: Presipitasi & Hujan Terbanyak */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-xs font-semibold text-slate-600">Hujan Konsesi</span>
            <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
              <CloudRain size={15} />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-extrabold text-slate-900 font-mono">
                {summary.rainingSensors.length}
              </span>
              <span className="text-xs text-slate-400 font-mono">/{summary.totalCount} Titik Basah</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1 font-mono">
              {summary.rainingSensors.length > 0 ? 'Sedang Presipitasi' : 'Kering Terkendali'}
            </p>
            {wettest && wettest.currentReadings?.rainfall_intensity_mmh > 0 ? (
              <div className="mt-1 text-[10px] text-teal-700 font-medium truncate">
                Puncak: {wettest.id} ({wettest.currentReadings.rainfall_intensity_mmh} mm/j)
              </div>
            ) : (
              <div className="mt-1 text-[10px] text-slate-400">0.0 mm/jam rata-rata</div>
            )}
          </div>
        </div>

        {/* Metric 4: Kecepatan Angin & Bahaya Sebaran Api */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-xs font-semibold text-slate-600">Angin Rata-rata</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Wind size={15} />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-extrabold text-slate-900 font-mono">
                {summary.averageWindSpeed}
              </span>
              <span className="text-xs text-slate-400 font-mono">m/s</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1 font-mono">
              ~{(summary.averageWindSpeed * 3.6).toFixed(1)} km/jam
            </p>
            {windiest && (
              <div className="mt-1 text-[10px] text-indigo-700 font-medium truncate">
                Maks: {windiest.id} ({windiest.currentReadings?.wind_speed_ms} m/s)
              </div>
            )}
          </div>
        </div>

        {/* Metric 5: Rerata Muka Air Gambut (TMAT) */}
        <div className="col-span-2 md:col-span-4 lg:col-span-1 p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-xs font-semibold text-slate-600">Rerata TMAT</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Waves size={15} />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className={`text-2xl font-extrabold font-mono ${
                avgTmat !== null && avgTmat < -40.0 ? 'text-red-600' : 'text-slate-900'
              }`}>
                {avgTmat !== null ? `${avgTmat}` : 'N/A'}
              </span>
              <span className="text-xs text-slate-400 font-mono">cm</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1 font-mono">
              Batas PP 71/2014: -40.0 cm
            </p>
            {driestPeat && (
              <div className="mt-1 text-[10px] text-red-600 font-medium truncate">
                Terkering: {driestPeat.id} ({driestPeat.currentReadings?.water_table_depth_cm} cm)
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
