import React from 'react';
import { History } from 'lucide-react';

/**
 * HistoricalTelemetryTable: Renders the historical sensor telemetries table.
 * Migrated to pure Tailwind CSS v4.
 */
export const HistoricalTelemetryTable = ({ records = [], isTmatEquipped = false }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs mt-5 animate-fade-in">
      <div className="flex items-center gap-2 pb-3 border-b border-slate-100 mb-3.5">
        <History className="text-blue" size={18} />
        <h3 className="text-base font-bold text-slate-800">Live Telemetry Log (Last 5 Synchronizations)</h3>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-200/80">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
              <th className="py-3 px-3.5">Timestamp</th>
              <th className="py-3 px-3.5">Suhu</th>
              <th className="py-3 px-3.5">Kelembaban</th>
              <th className="py-3 px-3.5">Radiasi Surya</th>
              <th className="py-3 px-3.5">Curah Hujan</th>
              <th className="py-3 px-3.5">Angin</th>
              <th className="py-3 px-3.5">TMAT Gambut</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {records.map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                <td className="py-3 px-3.5 font-mono text-[11px] text-slate-600 font-medium">{row.time}</td>
                <td className="py-3 px-3.5 font-bold text-slate-800">{row.temp}</td>
                <td className="py-3 px-3.5 text-slate-700">{row.rh}</td>
                <td className="py-3 px-3.5 text-slate-700">{row.solar}</td>
                <td className="py-3 px-3.5 text-slate-700">{row.rain}</td>
                <td className="py-3 px-3.5 text-slate-700">{row.wind}</td>
                <td className="py-3 px-3.5">
                  <span className={`font-mono ${isTmatEquipped ? 'font-bold text-teal-700' : 'text-slate-400'}`}>
                    {isTmatEquipped ? row.tmat : 'N/A'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

