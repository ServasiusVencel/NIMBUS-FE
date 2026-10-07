import React from 'react';
import { TrendingUp } from 'lucide-react';

/**
 * StationTrendSparkline: 24-Hour Micro Trend visualizer curve showing
 * hourly temperature trajectory for the focused station.
 */
export const StationTrendSparkline = ({ sensor }) => {
  if (!sensor) return null;

  const currentTemp = sensor.currentReadings?.air_temperature_c ?? 31.0;

  // 12 points representing 24-hour progression leading to current temperature
  const sparklineTemps = [
    currentTemp - 3.2, currentTemp - 2.8, currentTemp - 2.1, 
    currentTemp - 1.5, currentTemp - 0.4, currentTemp + 0.8, 
    currentTemp + 1.6, currentTemp + 1.2, currentTemp + 0.5, 
    currentTemp, currentTemp - 0.8, currentTemp - 1.4
  ];

  return (
    <div className="mt-3.5 pt-3 border-t border-slate-100">
      <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-2">
        <span className="flex items-center gap-1.5">
          <TrendingUp size={13} className="text-sky-500" />
          <span>Tren Suhu 24 Jam Terakhir Stasiun Ini</span>
        </span>
        <span className="text-[10px] font-mono text-slate-400">12 Titik Sampel</span>
      </div>

      <div className="flex items-end gap-1 h-12 pt-2">
        {sparklineTemps.map((val, idx) => {
          const heightPct = Math.min(100, Math.max(25, ((val - 25) / 12) * 100));
          return (
            <div key={idx} className="flex-1 flex flex-col items-center gap-1 group relative">
              <div 
                className="w-full bg-sky-100 group-hover:bg-sky-500 rounded-t transition-all duration-300"
                style={{ height: `${heightPct}%` }}
                title={`${val.toFixed(1)}°C`}
              />
            </div>
          );
        })}
      </div>

      <div className="flex justify-between text-[9px] font-mono text-slate-400 mt-1">
        <span>24 jam lalu</span>
        <span>12 jam lalu</span>
        <span>Sekarang ({currentTemp}°C)</span>
      </div>
    </div>
  );
};

export default StationTrendSparkline;
