import React from 'react';
import { Calendar } from 'lucide-react';
import { ComboBox } from '../ui/combo-box';

/**
 * ExportScopeCard: Configures station scope, aggregation resolution,
 * and time intervals (date presets + custom date inputs).
 */
export const ExportScopeCard = ({
  sensors = [],
  targetStation,
  onTargetStationChange,
  resolution,
  onResolutionChange,
  datePreset,
  onDatePresetChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange
}) => {
  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
          <Calendar size={16} className="text-sky-600" />
          <span>Stasiun & Periode Data</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Target Station Dropdown */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Stasiun Sensor
          </label>
          <ComboBox
            options={[
              { value: 'all', label: `Semua Stasiun (${sensors.length})` },
              ...sensors.map(s => ({
                value: s.id,
                label: `${s.id} · ${s.name || s.id}`
              }))
            ]}
            value={targetStation}
            onChange={(val) => onTargetStationChange(val)}
            placeholder="Pilih Stasiun..."
          />
        </div>

        {/* Resolution Dropdown */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Resolusi Data
          </label>
          <ComboBox
            options={[
              { value: 'raw5m', label: 'Per 5 Menit (Raw)' },
              { value: 'hourly', label: 'Per Jam (Rata-rata)' },
              { value: 'daily', label: 'Harian (Ringkasan)' }
            ]}
            value={resolution}
            onChange={(val) => onResolutionChange(val)}
            placeholder="Pilih Resolusi..."
          />
        </div>
      </div>

      {/* Date Preset Buttons */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
          Rentang Waktu
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { id: '7days', label: '7 Hari Terakhir' },
            { id: '30days', label: '30 Hari Terakhir' },
            { id: '90days', label: '90 Hari (3 Bulan)' },
            { id: 'custom', label: 'Kustom' }
          ].map(p => (
            <button
              key={p.id}
              type="button"
              onClick={() => onDatePresetChange(p.id)}
              className={`py-2 px-3 text-xs font-medium rounded-xl border transition cursor-pointer text-center ${
                datePreset === p.id
                  ? 'bg-sky-50 text-sky-700 border-sky-300 font-semibold shadow-2xs'
                  : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Start & End Date Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Tanggal Mulai
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="w-full h-10 px-3.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/15 cursor-pointer font-mono"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Tanggal Akhir
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            className="w-full h-10 px-3.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/15 cursor-pointer font-mono"
          />
        </div>
      </div>
    </div>
  );
};

export default ExportScopeCard;
