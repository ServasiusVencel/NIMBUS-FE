import React from 'react';
import { useApp } from '../context/AppContext';
import { CloudRain, Flame, Sprout, Bug, Factory, Trees } from 'lucide-react';
import { Toggle } from '../components/ui/Toggle';


export const ModuleConfigView = () => {
  const { clients, toggleClientModule } = useApp();

  const MODULE_DEFS = [
    { key: 'general_weather', name: 'General Weather & Telemetry', desc: 'Real-time observation, 10-day localized forecasts, and CSV historical exporter.', icon: <CloudRain size={18} className="text-sky-500" /> },
    { key: 'fire_warning', name: 'Fire Warning Index (FWI) & TMAT', desc: 'Canadian FWI engine combined with Peatland Groundwater Table depth.', icon: <Flame size={18} className="text-amber-500" /> },
    { key: 'climate_agriculture', name: 'Climate Agriculture Planning', desc: 'Daily operational windows for fertilizer, spraying, and harvest logistics.', icon: <Sprout size={18} className="text-emerald-500" /> },
    { key: 'pest_warning', name: 'Crop Pest & Pathogen Warning', desc: '7–10 day predictive incubation alerts for agricultural estates.', icon: <Bug size={18} className="text-purple-500" /> },
    { key: 'emission_intelligence', name: 'GHG & Emission Intelligence (Pillar 2)', desc: 'Corporate Scope 1 & 2 carbon accounting with ISO 14064 alignment.', icon: <Factory size={18} className="text-slate-500" /> },
    { key: 'carbon_mrv', name: 'Carbon Project Intelligence & MRV (Pillar 3)', desc: 'Satellite biomass baseline verification, permanence & credit issuance.', icon: <Trees size={18} className="text-emerald-500" /> },
  ];

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs">
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold font-mono tracking-wider bg-purple-50 text-purple-700 border border-purple-100 uppercase">
          CMS DYNAMIC FEATURE TOGGLES
        </span>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-2">
          Enterprise Module Configuration
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl leading-relaxed">
          Aktifkan atau nonaktifkan modul analisis per klien korporasi. Bilah navigasi dan dasbor aplikasi beradaptasi secara dinamis secara instan.
        </p>
      </div>

      {/* Module Configuration Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {clients.map(client => (
          <div key={client.id} className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
            {/* Client Header */}
            <div className="pb-4 border-b border-slate-100">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-xs font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                  {client.id}
                </span>
                <span className="text-xs text-slate-400 font-medium">{client.industry}</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mt-2">{client.name}</h3>
            </div>

            {/* Modules List */}
            <div className="space-y-2.5 mt-4">
              {MODULE_DEFS.map(mod => {
                const isEnabled = client.enabledModules?.[mod.key] ?? false;
                return (
                  <div key={mod.key} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-50/70 border border-slate-100 hover:bg-slate-50 transition">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white border border-slate-200/80 flex items-center justify-center shrink-0 mt-0.5">
                        {mod.icon}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-800">{mod.name}</div>
                        <div className="text-[11px] text-slate-500 leading-snug mt-0.5">{mod.desc}</div>
                      </div>
                    </div>

                    <Toggle
                      checked={isEnabled}
                      onChange={() => toggleClientModule(client.id, mod.key)}
                      size="sm"
                      color="primary"
                      title={`Toggle ${mod.name}`}
                      aria-label={`Toggle ${mod.name}`}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
