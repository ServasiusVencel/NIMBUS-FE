import React from 'react';
import { Activity, Radio, Download, Maximize2 } from 'lucide-react';

/**
 * FleetOverviewHeader: Executive summary header component for the Fleet Dashboard.
 * Displays real-time uptime badge, client workspace context, and global action buttons.
 */
export const FleetOverviewHeader = ({
  clientName = 'Konsesi Gambut Sumatera',
  onlineCount = 0,
  totalCount = 0,
  onExportCsv,
  onFocusMap
}) => {
  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-5">
      <div>
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-sky-50 text-sky-700 text-[11px] font-bold font-mono border border-sky-100 uppercase tracking-wide">
            <Activity size={13} className="text-sky-600 animate-pulse" />
            Armada IoT Telemetri
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200">
            <Radio size={12} className="text-slate-500" />
            {clientName}
          </span>
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            {onlineCount}/{totalCount} Stasiun Online (100% Uptime)
          </span>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          General IoT Fleet Monitoring Dashboard
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl leading-relaxed">
          Pusat pemantauan simultan seluruh sensor cuaca otomatis (AWS), piezometer muka air gambut (TMAT), dan indeks potensi karhutla di seluruh konsesi operasional.
        </p>
      </div>

      {/* Global Fleet Quick Actions */}
      <div className="flex items-center gap-2.5 shrink-0">
        <button
          type="button"
          id="btn-export-fleet-csv"
          onClick={onExportCsv}
          className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 shadow-xs transition cursor-pointer"
        >
          <Download size={14} className="text-slate-500" />
          <span>Ekspor CSV Armada</span>
        </button>

        <button
          type="button"
          id="btn-view-interactive-map"
          onClick={onFocusMap}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-xl shadow-xs shadow-sky-600/30 transition cursor-pointer"
        >
          <Maximize2 size={14} />
          <span>Fokus Peta & Stasiun</span>
        </button>
      </div>
    </div>
  );
};
