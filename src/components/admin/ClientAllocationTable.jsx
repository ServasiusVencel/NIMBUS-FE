import React from 'react';
import { ArrowRight, Building2 } from 'lucide-react';

/**
 * ClientAllocationTable: Displays table of enterprise clients,
 * PIC, active modules count, and assigned AWS weather stations.
 * Migrated to pure Tailwind CSS v4.
 */
export const ClientAllocationTable = ({ clients = [], sensors = [], onSelectClient, onOpenDirectory }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs mt-4.5">
      <div className="flex items-center justify-between flex-wrap gap-2.5">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="text-blue" size={18} />
            <h3 className="text-base font-bold text-slate-800">Enterprise Client Allocations</h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Alokasi klien korporasi, PIC, dan jumlah stasiun AWS yang terpasang di konsesi kebun.
          </p>
        </div>
        <button 
          type="button"
          className="h-8.5 px-3 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
          onClick={onOpenDirectory}
        >
          <span>Buka Direktori Klien</span>
          <ArrowRight size={13} />
        </button>
      </div>

      <div className="overflow-x-auto mt-3.5 rounded-lg border border-slate-200/80">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
              <th className="py-3 px-3.5">Perusahaan / Klien</th>
              <th className="py-3 px-3.5">Sektor Industri</th>
              <th className="py-3 px-3.5">Person-in-Charge (PIC)</th>
              <th className="py-3 px-3.5">Alokasi Stasiun</th>
              <th className="py-3 px-3.5">Modul Aktif</th>
              <th className="py-3 px-3.5">Status</th>
              <th className="py-3 px-3.5 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {clients.map(c => {
              const clientSensors = sensors.filter(s => s.clientId === c.id);
              const modulesCount = c.getActiveModulesCount ? c.getActiveModulesCount() : 3;

              return (
                <tr key={c.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-3.5">
                    <b className="text-slate-800">{c.name}</b>
                    <div className="font-mono text-slate-400 text-[10px] mt-0.5">{c.id}</div>
                  </td>
                  <td className="py-3 px-3.5 text-slate-600">{c.industry}</td>
                  <td className="py-3 px-3.5 text-slate-700 font-medium">{c.pic}</td>
                  <td className="py-3 px-3.5">
                    <span className="font-mono font-bold text-blue">{clientSensors.length} Stasiun</span>
                  </td>
                  <td className="py-3 px-3.5">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                      {modulesCount} Modul
                    </span>
                  </td>
                  <td className="py-3 px-3.5">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {(c.status || 'Active').toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-3.5 text-right">
                    <button 
                      type="button"
                      className="px-2.5 py-1 text-[11px] font-semibold text-blue bg-blue/5 hover:bg-blue/10 border border-blue/20 rounded-md transition-colors cursor-pointer"
                      onClick={() => onSelectClient(c.id)}
                    >
                      Pilih Klien
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

