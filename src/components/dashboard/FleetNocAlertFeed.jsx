import React from 'react';
import { 
  Bell, 
  AlertTriangle, 
  Flame, 
  Waves, 
  CloudRain, 
  WifiOff, 
  CheckCircle2, 
  ArrowRight,
  Activity,
  Battery,
  Signal
} from 'lucide-react';

/**
 * FleetNocAlertFeed: Network Operations Center (NOC) activity feed & fleet health distribution.
 * Presents executive macro insight into recent incidents, status breakdown, and fleet anomalies.
 */
export const FleetNocAlertFeed = ({ summary, onSelectStation }) => {
  const alerts = summary?.recentAlerts || [];
  const total = summary?.totalCount || 1;
  const online = summary?.onlineCount || 0;
  const warning = summary?.warningCount || 0;
  const offline = summary?.offlineCount || 0;

  const onlinePct = Math.round((online / total) * 100);
  const warningPct = Math.round((warning / total) * 100);
  const offlinePct = Math.round((offline / total) * 100);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 min-w-0">
      
      {/* Left Column: Fleet Health & Distribution Matrix (5 Cols on lg) */}
      <div className="lg:col-span-5 bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600">
                <Activity size={17} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800">Distribusi Kesiapan Armada</h3>
                <p className="text-[11px] text-slate-400">Status kesehatan operasional seluruh AWS</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono font-bold text-slate-700">{online}/{total} Stasiun</span>
              <span className="block text-[10px] text-emerald-600 font-semibold">{onlinePct}% Siap</span>
            </div>
          </div>

          {/* Segmented Progress Bar */}
          <div className="my-4">
            <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden flex">
              <div style={{ width: `${onlinePct}%` }} className="bg-emerald-500 transition-all duration-500" title={`Online: ${online}`} />
              <div style={{ width: `${warningPct}%` }} className="bg-amber-500 transition-all duration-500" title={`Perhatian: ${warning}`} />
              <div style={{ width: `${offlinePct}%` }} className="bg-rose-500 transition-all duration-500" title={`Offline: ${offline}`} />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 font-mono">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> Online ({online})
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500" /> Perhatian ({warning})
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500" /> Offline ({offline})
              </span>
            </div>
          </div>

          {/* Hardware & Telemetry Diagnostic Stats */}
          <div className="grid grid-cols-2 gap-2.5 pt-2">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[10px] font-bold tracking-wider uppercase font-mono">DAYA BATERAI AVG</span>
                <Battery size={13} className="text-emerald-500" />
              </div>
              <div className="text-base font-extrabold text-slate-900 font-mono">
                {summary.averageBatteryVoltage} V
              </div>
              <span className="text-[10px] text-slate-400">Solar cell nominal</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[10px] font-bold tracking-wider uppercase font-mono">SINYAL TELEMETRI</span>
                <Signal size={13} className="text-sky-500" />
              </div>
              <div className="text-base font-extrabold text-slate-900 font-mono">
                {summary.averageGsmSignalDbm} dBm
              </div>
              <span className="text-[10px] text-slate-400">Konektivitas 4G Kuat</span>
            </div>
          </div>

          {/* Compliance & Safety Summary */}
          <div className="mt-3 p-3 rounded-xl bg-teal-50/70 border border-teal-100 text-xs text-teal-800 space-y-1">
            <div className="flex items-center justify-between font-semibold">
              <span>Sensor Gambut Terpasang:</span>
              <span className="font-mono font-bold">{summary.tmatEquippedSensors.length} Stasiun</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-teal-700">
              <span>Status Kritis PP 71/2014 (&lt; -40cm):</span>
              <span className={`font-mono font-bold ${summary.tmatCriticalSensors.length > 0 ? 'text-red-600' : 'text-emerald-700'}`}>
                {summary.tmatCriticalSensors.length} Stasiun
              </span>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span>Sinkronisasi Otomatis: Tiap 5 menit</span>
          <span className="font-mono text-emerald-600 font-semibold">Active Polling</span>
        </div>
      </div>

      {/* Right Column: Concession Event & Alert Log Feed (7 Cols on lg) */}
      <div className="lg:col-span-7 bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
                <Bell size={17} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800">Aktivitas & Log Peringatan Armada</h3>
                <p className="text-[11px] text-slate-400">Pemberitahuan anomali mikroklimat konsesi secara real-time</p>
              </div>
            </div>
            <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
              {alerts.length} Log Terkini
            </span>
          </div>

          {/* List of Alerts */}
          <div className="divide-y divide-slate-100 max-h-[300px] overflow-y-auto pr-1 mt-1">
            {alerts.map((al) => {
              const isDanger = al.type === 'danger';
              const isWarning = al.type === 'warning';
              const isInfo = al.type === 'info';
              const isOffline = al.type === 'offline';

              return (
                <div key={al.id} className="py-3 flex items-start justify-between gap-3 group hover:bg-slate-50/60 rounded-xl px-2 -mx-2 transition">
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center border mt-0.5 ${
                      isDanger
                        ? 'bg-rose-50 border-rose-200 text-rose-600'
                        : isWarning
                        ? 'bg-amber-50 border-amber-200 text-amber-600'
                        : isOffline
                        ? 'bg-slate-100 border-slate-200 text-slate-600'
                        : isInfo
                        ? 'bg-sky-50 border-sky-200 text-sky-600'
                        : 'bg-emerald-50 border-emerald-200 text-emerald-600'
                    }`}>
                      {isDanger && <Flame size={15} />}
                      {isWarning && <AlertTriangle size={15} />}
                      {isOffline && <WifiOff size={15} />}
                      {isInfo && <CloudRain size={15} />}
                      {al.type === 'success' && <CheckCircle2 size={15} />}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded">
                          {al.sensorId}
                        </span>
                        <h4 className="text-xs font-bold text-slate-800">{al.title}</h4>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                        {al.desc}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end shrink-0 gap-1.5">
                    <span className="text-[10px] font-mono text-slate-400 whitespace-nowrap">
                      {al.time}
                    </span>
                    {onSelectStation && (
                      <button
                        type="button"
                        onClick={() => onSelectStation(al.sensorId, 'map')}
                        className="opacity-0 group-hover:opacity-100 transition inline-flex items-center gap-1 text-[11px] font-semibold text-sky-600 hover:text-sky-700 cursor-pointer"
                        title="Investigasi stasiun ini di Peta"
                      >
                        <span>Investigasi</span>
                        <ArrowRight size={11} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">Pusat Komando & Peringatan Dini Bencana</span>
          <span className="text-[11px] font-mono text-slate-500">Standar BMKG & KLHK</span>
        </div>
      </div>

    </div>
  );
};
