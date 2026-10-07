import React from 'react';
import { FileSpreadsheet, Download } from 'lucide-react';

/**
 * ExportHistoryLog: Displays an audit trail of recently generated and downloaded
 * telemetry archive files with one-click re-download capability.
 */
export const ExportHistoryLog = ({ history = [], onReDownload }) => {
  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-3">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <h3 className="text-sm font-bold text-slate-800">
          Riwayat Unduhan
        </h3>
        <span className="text-xs text-slate-500 font-medium">
          {history.length} Berkas
        </span>
      </div>

      <div className="divide-y divide-slate-100">
        {history.map(item => (
          <div
            key={item.id}
            className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50/50 px-2 -mx-2 rounded-xl transition"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shrink-0">
                <FileSpreadsheet size={15} />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold font-mono text-slate-800 truncate">
                  {item.filename}
                </h4>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5 flex-wrap">
                  <span>{item.station}</span>
                  <span>•</span>
                  <span>{item.range}</span>
                  <span>•</span>
                  <span className="font-semibold text-slate-700">{item.size}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
                {item.timestamp}
              </span>
              <button
                type="button"
                onClick={() => onReDownload && onReDownload(item)}
                className="py-1.5 px-3 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition cursor-pointer flex items-center gap-1"
                title="Unduh Ulang"
              >
                <Download size={12} />
                <span>Unduh</span>
              </button>
            </div>
          </div>
        ))}

        {history.length === 0 && (
          <div className="py-6 text-center text-xs text-slate-400">
            Belum ada riwayat unduhan berkas.
          </div>
        )}
      </div>
    </div>
  );
};

export default ExportHistoryLog;
