import React from 'react';
import { BarChart3 } from 'lucide-react';

/**
 * FwiHistoryBarChart: Renders 10-day FWI multi-horizon outlook bar chart with color-coded risk levels.
 * Migrated to pure Tailwind CSS v4.
 */
export const FwiHistoryBarChart = ({ fwiTrend = [] }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <BarChart3 className="text-blue" size={18} />
          <h3 className="text-base font-bold text-slate-800">10-Day FWI Multi-Horizon Outlook</h3>
        </div>
        <span className="text-[11px] font-mono text-slate-400">Layer 4 Forecast</span>
      </div>

      <div className="mt-4 p-4 rounded-xl border border-slate-100 bg-gradient-to-b from-white to-slate-50/60">
        <div className="h-[120px] flex items-end gap-2">
          {fwiTrend.map((d, idx) => {
            const s = parseFloat(d.score);
            return (
              <div 
                key={idx}
                className="flex-1 rounded-t-md hover:opacity-85 transition-all cursor-pointer relative group" 
                style={{ 
                  height: `${Math.min(100, Math.max(15, s * 100))}%`, 
                  backgroundColor: d.color,
                }} 
                title={`${d.day}: ${d.score} (${d.level})`}
              />
            );
          })}
        </div>

        <div className="flex justify-between items-center mt-2.5 pt-2 border-t border-slate-200/50 text-[10px] text-slate-400 font-mono">
          {fwiTrend.map((d, idx) => {
            // Show select labels
            if (idx === 0 || idx === 2 || idx === 4 || idx === 6 || idx === 9) {
              return <span key={idx}>{d.dayLabel}</span>;
            }
            return null;
          })}
        </div>
      </div>
    </div>
  );
};

