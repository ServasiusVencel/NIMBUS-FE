import React from 'react';
import { Radio, Search } from 'lucide-react';
import { FleetSensorCard } from './FleetSensorCard';

/**
 * FleetSensorGrid: Renders the multi-sensor live telemetry grid with
 * real-time search and categorization filter tabs.
 */
export const FleetSensorGrid = ({
  sensors = [],
  totalCount = 0,
  warningCount = 0,
  tmatCount = 0,
  rainCount = 0,
  filterType = 'all',
  searchQuery = '',
  onFilterChange,
  onSearchChange,
  onFocusMap,
  onViewWeather,
  onExportCsv
}) => {
  return (
    <div className="space-y-4">
      {/* Controls Bar: Search & Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Radio size={18} className="text-sky-600" />
            <span>Monitoring Simultan Seluruh Perangkat IoT</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 font-bold font-mono">
              {sensors.length} Stasiun
            </span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Pantau status online, sensor mikroklimat, kedalaman air gambut, dan indeks bahaya secara langsung:
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Search Input */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari ID stasiun / zona..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-8.5 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-slate-800 w-44 sm:w-52"
            />
          </div>

          {/* Filter Pills */}
          <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200/80">
            <button
              type="button"
              onClick={() => onFilterChange('all')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition cursor-pointer ${
                filterType === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua ({totalCount})
            </button>
            <button
              type="button"
              onClick={() => onFilterChange('warning')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition cursor-pointer ${
                filterType === 'warning'
                  ? 'bg-white text-amber-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Waspada ({warningCount})
            </button>
            <button
              type="button"
              onClick={() => onFilterChange('tmat')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition cursor-pointer ${
                filterType === 'tmat'
                  ? 'bg-white text-teal-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              TMAT ({tmatCount})
            </button>
            <button
              type="button"
              onClick={() => onFilterChange('rain')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition cursor-pointer ${
                filterType === 'rain'
                  ? 'bg-white text-sky-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Hujan ({rainCount})
            </button>
          </div>
        </div>
      </div>

      {/* The IoT Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {sensors.map((sensor) => (
          <FleetSensorCard
            key={sensor.id}
            sensor={sensor}
            onFocusMap={onFocusMap}
            onViewWeather={onViewWeather}
            onExportCsv={onExportCsv}
          />
        ))}
      </div>
    </div>
  );
};
