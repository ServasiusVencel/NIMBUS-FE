import React from 'react';
import { CalendarRange } from 'lucide-react';

/**
 * OperationWindowsGrid: Renders the 10-day agricultural operation schedule grid
 * with activity selection (fertilization, spraying, harvest).
 * Migrated to pure Tailwind CSS v4.
 */
export const OperationWindowsGrid = ({
  activities = [],
  activeActivity = 'fertilization',
  onSelectActivity,
  forecast10Days = [],
  selectedDayIdx = 0,
  onSelectDay,
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-2.5 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <CalendarRange className="text-blue" size={18} />
          <h3 className="text-base font-bold text-slate-800">Recommended Operation Windows (10-Day Horizon)</h3>
        </div>
        <p className="text-xs text-slate-500 w-full sm:w-auto">
          Rekomendasi dihitung otomatis berdasarkan presipitasi, kecepatan angin, dan kelembaban tanah.
        </p>
      </div>
      
      {/* Activity Category Selector */}
      <div className="flex items-center gap-2 my-4 flex-wrap">
        {activities.map(act => {
          const isActive = activeActivity === act.id;
          return (
            <button
              key={act.id}
              type="button"
              className={`h-9 px-3.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                isActive 
                  ? 'bg-blue text-white shadow-xs' 
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
              onClick={() => onSelectActivity(act.id)}
            >
              {act.label}
            </button>
          );
        })}
      </div>

      {/* 10-Day Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2">
        {forecast10Days.map((op, idx) => {
          const status = op.getStatusBadge 
            ? op.getStatusBadge(activeActivity) 
            : { code: 'badge-online', label: 'AMAN', color: '#168449' };
          const isSelected = selectedDayIdx === idx;
          const isGood = status.label === 'AMAN' || status.label.includes('OPTIMAL');
          const isCaution = status.label.includes('WASPADA') || status.label.includes('HATI');

          return (
            <div 
              key={idx}
              className={`p-3 rounded-xl text-center cursor-pointer transition-all flex flex-col items-center justify-between min-h-[140px] border ${
                isSelected 
                  ? 'bg-blue/5 border-blue ring-2 ring-blue/20' 
                  : 'bg-slate-50/50 hover:bg-slate-100/70 border-slate-200'
              }`}
              onClick={() => onSelectDay(idx)}
            >
              <div>
                <b className="text-xs font-bold text-slate-800 block">{op.dayName}</b>
                <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">
                  {op.date ? op.date.substring(5) : `D+${idx+1}`}
                </span>
              </div>

              <div className="text-2xl my-1 select-none">
                {op.rainProbability > 60 ? '🌧️' : op.rainProbability > 25 ? '⛅' : '☀️'}
              </div>

              <span 
                className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider w-full truncate border ${
                  isGood 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                    : isCaution 
                    ? 'bg-amber-50 text-amber-700 border-amber-200' 
                    : 'bg-red-50 text-red-700 border-red-200'
                }`}
                title={status.label}
              >
                {status.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

