import React from 'react';
import { Download, FileSpreadsheet } from 'lucide-react';
import { ComboBox } from '../ui/combo-box';

/**
 * ExportCsvCard: Form controls for exporting sensor historical observations to CSV.
 * Migrated to pure Tailwind CSS v4.
 */
export const ExportCsvCard = ({
  startDate,
  endDate,
  selectedVar,
  onStartDateChange,
  onEndDateChange,
  onSelectedVarChange,
  onDownload,
  downloadSuccess = false
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs mt-5 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="text-blue" size={18} />
            <h3 className="text-base font-bold text-slate-800">Download Historical Telemetry Data</h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Export high-resolution sensor observations and hydrological variables directly into CSV format.
          </p>
        </div>
        <button 
          type="button"
          className="h-9 px-4 text-xs font-semibold text-white bg-blue hover:bg-blue2 rounded-lg flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer" 
          onClick={onDownload}
        >
          <Download size={14} />
          <span>{downloadSuccess ? '✓ Downloaded' : 'Export CSV'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">Dari Tanggal</label>
          <input
            type="date"
            className="w-full h-10 px-3.5 text-xs bg-slate-50/60 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-blue focus:ring-2 focus:ring-blue/15 transition-colors cursor-pointer"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">Sampai Tanggal</label>
          <input
            type="date"
            className="w-full h-10 px-3.5 text-xs bg-slate-50/60 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-blue focus:ring-2 focus:ring-blue/15 transition-colors cursor-pointer"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">Parameter Variabel</label>
          <ComboBox
            options={[
              "All Weather Variables",
              "Air Temperature",
              "Humidity",
              "Solar Radiation",
              "Groundwater Level (TMAT)"
            ]}
            value={selectedVar}
            onChange={(val) => val && onSelectedVarChange(val)}
            placeholder="Pilih Variabel..."
          />
        </div>
      </div>
    </div>
  );
};

