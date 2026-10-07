import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { SensorTableRow } from './SensorTableRow';

/**
 * SensorTable: Reusable table container for managing fleet of IoT sensors.
 * Features inline search filtering, status counts, and modular row delegation.
 * Migrated to pure Tailwind CSS v4.
 */
export const SensorTable = ({ sensors = [], clients = [], onToggleTmat }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSensors = sensors.filter(s => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    const client = clients.find(c => c.id === s.clientId);
    return (
      s.id.toLowerCase().includes(term) ||
      s.name.toLowerCase().includes(term) ||
      (client && client.name.toLowerCase().includes(term))
    );
  });

  const totalCount = sensors.length;
  const onlineCount = sensors.filter(s => s.status === 'online').length;
  const tmatCount = sensors.filter(s => s.isTmatEquipped && s.isTmatEquipped()).length;

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden animate-fade-in">
      {/* Table Toolbar: Search & Fleet Summary */}
      <div className="p-4 sm:px-6 sm:py-4.5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2.5">
          <div className="relative min-w-[240px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input 
              type="text"
              placeholder="Cari ID stasiun atau nama..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full h-9 pl-9 pr-3 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100 transition-all"
            />
          </div>
          {searchTerm && (
            <button 
              className="h-9 px-3 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
              onClick={() => setSearchTerm('')}
            >
              Clear
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-700">
            Total: <strong className="font-mono text-slate-900">{totalCount}</strong>
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
            Online: <strong className="font-mono text-emerald-800">{onlineCount}</strong>
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-sky-50 text-sky-700 border border-sky-100">
            TMAT Piezometer: <strong className="font-mono text-sky-800">{tmatCount}</strong>
          </span>
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              <th className="py-3 px-5">Stasiun & ID</th>
              <th className="py-3 px-4">Klien Terkait</th>
              <th className="py-3 px-4">Koordinat GPS</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Sensor Terpasang</th>
              <th className="py-3 px-5 text-right">Groundwater (TMAT)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {filteredSensors.length > 0 ? (
              filteredSensors.map(s => {
                const client = clients.find(c => c.id === s.clientId);
                return (
                  <SensorTableRow 
                    key={s.id}
                    station={s}
                    client={client}
                    onToggleTmat={onToggleTmat}
                  />
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-12 px-4 text-slate-400 text-xs">
                  Tidak ada stasiun sensor yang cocok dengan kata kunci "<b>{searchTerm}</b>".
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
