import React from 'react';
import { useApp } from '../context/AppContext';
import { Sliders, ShieldCheck, Check, X, CloudRain, Flame, Sprout, Bug, Factory, Trees } from 'lucide-react';

export const ModuleConfigView = () => {
  const { clients, toggleClientModule } = useApp();

  const MODULE_DEFS = [
    { key: 'general_weather', name: 'General Weather & Telemetry', desc: 'Real-time observation, 10-day localized forecasts, and CSV historical exporter.', icon: <CloudRain size={18} className="text-blue" /> },
    { key: 'fire_warning', name: 'Fire Warning Index (FWI) & TMAT', desc: 'Canadian FWI engine combined with Peatland Groundwater Table depth.', icon: <Flame size={18} className="text-amber" /> },
    { key: 'climate_agriculture', name: 'Climate Agriculture Planning', desc: 'Daily operational windows for fertilizer, spraying, and harvest logistics.', icon: <Sprout size={18} className="text-emerald" /> },
    { key: 'pest_warning', name: 'Crop Pest & Pathogen Warning', desc: '7–10 day predictive incubation alerts for agricultural estates.', icon: <Bug size={18} className="text-purple" /> },
    { key: 'emission_intelligence', name: 'GHG & Emission Intelligence (Pillar 2)', desc: 'Corporate Scope 1 & 2 carbon accounting with ISO 14064 alignment.', icon: <Factory size={18} className="text-muted" /> },
    { key: 'carbon_mrv', name: 'Carbon Project Intelligence & MRV (Pillar 3)', desc: 'Satellite biomass baseline verification, permanence & credit issuance.', icon: <Trees size={18} className="text-emerald" /> },
  ];

  return (
    <div className="view-content animate-fade-in">
      <div className="view-header">
        <div>
          <span className="view-tag">CMS DYNAMIC FEATURE TOGGLES</span>
          <h2 className="view-title">Enterprise Module Configuration</h2>
          <p className="view-subtitle">
            Activate or deactivate modular platform engines per enterprise client. Navigation bars and dashboards dynamically adapt.
          </p>
        </div>
      </div>

      <div className="module-config-grid">
        {clients.map(client => (
          <div key={client.id} className="nimbus-card client-module-card">
            <div className="client-module-header">
              <div>
                <span className="client-id-badge font-mono">{client.id}</span>
                <h3 className="client-name">{client.name}</h3>
                <span className="text-xs text-muted">{client.industry}</span>
              </div>
            </div>

            <div className="modules-list">
              {MODULE_DEFS.map(mod => {
                const isEnabled = client.enabledModules?.[mod.key] ?? false;
                return (
                  <div key={mod.key} className="module-toggle-item">
                    <div className="module-toggle-info">
                      <div className="module-icon-wrap">{mod.icon}</div>
                      <div>
                        <div className="module-name">{mod.name}</div>
                        <div className="module-desc text-xs text-muted">{mod.desc}</div>
                      </div>
                    </div>
                    <button 
                      className={`toggle-switch ${isEnabled ? 'toggle-on' : 'toggle-off'}`}
                      onClick={() => toggleClientModule(client.id, mod.key)}
                      title={`Toggle ${mod.name}`}
                    >
                      <span className="toggle-handle" />
                    </button>
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
