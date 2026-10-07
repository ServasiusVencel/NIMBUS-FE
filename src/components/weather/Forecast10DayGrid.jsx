import React from 'react';
import { CalendarDays } from 'lucide-react';

/**
 * Forecast10DayGrid: Renders 10-day forward atmospheric forecast model cards.
 * Migrated to pure Tailwind CSS v4.
 */
export const Forecast10DayGrid = ({ forecastList = [], loading = false }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs mt-5 animate-fade-in">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <CalendarDays className="text-blue" size={18} />
          <h3 className="text-base font-bold text-slate-800">10-Day Forward Forecast Model</h3>
        </div>
        {loading && <span className="text-xs text-blue font-medium animate-pulse">Sinkronisasi AI Forecaster...</span>}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2 mt-4">
        {forecastList.map((item, idx) => {
          const dayName = item.dayName || item.day || `Day ${idx + 1}`;
          const dateStr = item.date || item.tanggal || '';
          const temp = item.temperatureMax ? `${Math.round(item.temperatureMax)}°` : (item.detail_cuaca ? `${Math.round(item.detail_cuaca.suhu_c)}°` : '32°');
          const pop = item.rainProbability !== undefined ? `${item.rainProbability}%` : (item.detail_cuaca ? `${Math.round(item.detail_cuaca.probabilitas_hujan * 100)}%` : '10%');
          const icon = (item.rainProbability > 60 || item.hujan === 'Tinggi') ? '🌧️' : (item.rainProbability > 30 || item.hujan === 'Sedang') ? '⛅' : '☀️';

          return (
            <div 
              key={idx}
              className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-100/70 transition-all text-center flex flex-col items-center justify-between min-h-[135px]"
            >
              <div className="text-[11px] font-bold text-slate-700 leading-tight">
                {dayName}
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">{dateStr}</div>
              </div>

              <div className="text-2xl my-1 select-none">{icon}</div>

              <div>
                <b className="font-mono text-slate-800 text-sm">{temp}</b>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                  {Math.round(item.temperatureMin || 24)}° · <span className="text-sky-600 font-semibold">{pop}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

