import React from 'react';
import { Activity } from 'lucide-react';

/**
 * PortfolioKpiCard: Renders portfolio-wide health KPIs
 * (Total projects, clients, stations online/warning/offline).
 * Migrated to pure Tailwind CSS v4.
 */
export const PortfolioKpiCard = ({ clients = [], sensors = [] }) => {
  const totalProjects = clients.reduce((acc, c) => acc + (c.projects?.length || 1), 0);
  const totalClients = clients.length;
  const totalSensors = sensors.length;
  const onlineCount = sensors.filter(s => s.status === 'online').length;
  const offlineCount = sensors.filter(s => s.status === 'offline').length;
  const warningCount = sensors.filter(s => s.status === 'warning').length;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
          <Activity className="text-blue" size={18} />
          <h3 className="text-base font-bold text-slate-800">Portfolio Health Metrics</h3>
        </div>

        <div className="space-y-2.5 text-xs">
          <div className="flex items-center justify-between py-1 border-b border-slate-100">
            <span className="text-slate-500">Total Projects Monitored</span>
            <b className="text-slate-800 font-mono text-sm">{totalProjects}</b>
          </div>
          <div className="flex items-center justify-between py-1 border-b border-slate-100">
            <span className="text-slate-500">Active Enterprise Clients</span>
            <b className="text-slate-800 font-mono text-sm">{totalClients}</b>
          </div>
          <div className="flex items-center justify-between py-1 border-b border-slate-100">
            <span className="text-slate-500">Total IoT Weather Stations (AWS)</span>
            <b className="text-slate-800 font-mono text-sm">{totalSensors}</b>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-100">
        <div className="bg-emerald-50/70 border border-emerald-200/60 rounded-lg p-2.5 text-center">
          <div className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider">Online</div>
          <div className="text-lg font-bold text-emerald-600 font-mono">{onlineCount}</div>
        </div>
        <div className="bg-amber-50/70 border border-amber-200/60 rounded-lg p-2.5 text-center">
          <div className="text-[10px] uppercase font-bold text-amber-700 tracking-wider">Warning</div>
          <div className="text-lg font-bold text-amber-600 font-mono">{warningCount}</div>
        </div>
        <div className="bg-red-50/70 border border-red-200/60 rounded-lg p-2.5 text-center">
          <div className="text-[10px] uppercase font-bold text-red-700 tracking-wider">Offline</div>
          <div className="text-lg font-bold text-red-600 font-mono">{offlineCount}</div>
        </div>
      </div>
    </div>
  );
};

