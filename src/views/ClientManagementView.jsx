import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, X, Building2, Radio, Sliders } from 'lucide-react';

/**
 * ClientManagementView: Enterprise Client Directory and management.
 * Migrated to pure Tailwind CSS v4.
 */
export const ClientManagementView = () => {
  const { clients, addClient, handleClientChange, setActiveTab } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newClient, setNewClient] = useState({
    name: '',
    industry: '',
    pic: '',
    email: '',
    phone: '',
  });

  const handleCreate = (e) => {
    e.preventDefault();
    if (!newClient.name) return;
    const id = `CLI-00${clients.length + 1}`;
    addClient({
      id,
      ...newClient,
      status: 'active',
      projects: [`PRJ-${newClient.name.substring(0, 4).toUpperCase()}`],
      assignedSensors: [],
      enabledModules: {
        general_weather: true,
        fire_warning: true,
        climate_agriculture: true,
        pest_warning: true,
        emission_intelligence: false,
        carbon_mrv: false,
      }
    });
    setNewClient({ name: '', industry: '', pic: '', email: '', phone: '' });
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/70">
        <div>
          <span className="inline-block text-[10px] font-bold tracking-wider uppercase text-blue bg-blue/10 px-2 py-0.5 rounded">
            CMS Platform Administration
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            Enterprise Client Directory
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage enterprise clients, organizational PIC assignments, subscription tiers, and project linkages.
          </p>
        </div>
        <button 
          type="button"
          className="h-9 px-4 text-xs font-semibold text-white bg-blue hover:bg-blue2 rounded-lg flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer self-start sm:self-auto" 
          onClick={() => setShowAddModal(true)}
        >
          <Plus size={15} />
          <span>Add New Client</span>
        </button>
      </div>

      {/* Client Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {clients.map(client => {
          const isActive = client.status === 'active';

          return (
            <div 
              key={client.id} 
              className="bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-5 shadow-xs transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
                  <div>
                    <span className="font-mono text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                      {client.id}
                    </span>
                    <h3 className="text-base font-bold text-slate-800 mt-1">{client.name}</h3>
                    <span className="text-xs text-slate-500">{client.industry}</span>
                  </div>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                    isActive 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                      : 'bg-red-50 text-red-700 border-red-200'
                  }`}>
                    {client.status.toUpperCase()}
                  </span>
                </div>

                <div className="bg-slate-50/70 border border-slate-100 rounded-lg p-3 my-4 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Person-in-Charge:</span>
                    <span className="font-semibold text-slate-700">{client.pic}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Contact:</span>
                    <span className="font-mono text-[11px] text-slate-600">{client.email}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Phone:</span>
                    <span className="font-mono text-[11px] text-slate-600">{client.phone}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-200/50">
                    <span className="text-slate-500">Assigned Stations:</span>
                    <span className="font-mono font-bold text-blue">{client.assignedSensors.length} Stations</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                <button 
                  type="button"
                  className="flex-1 py-1.5 px-3 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  onClick={() => {
                    handleClientChange(client.id);
                    setActiveTab('map');
                  }}
                >
                  <Radio size={13} className="text-blue" />
                  <span>Inspect Sensors</span>
                </button>
                <button 
                  type="button"
                  className="flex-1 py-1.5 px-3 text-xs font-semibold text-blue bg-blue/5 hover:bg-blue/10 border border-blue/20 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  onClick={() => {
                    handleClientChange(client.id);
                    setActiveTab('modules');
                  }}
                >
                  <Sliders size={13} />
                  <span>Manage Modules</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Add Client */}
      {showAddModal && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4"
          onClick={() => setShowAddModal(false)}
        >
          <div 
            className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-2xl border border-slate-200 animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue/10 text-blue flex items-center justify-center">
                  <Building2 size={18} />
                </div>
                <h3 className="text-base font-bold text-slate-800">Register New Enterprise Client</h3>
              </div>
              <button 
                type="button"
                className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                onClick={() => setShowAddModal(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3.5 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Company / Organization Name
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. PT Hutan Tropis Makmur"
                  value={newClient.name}
                  onChange={e => setNewClient({ ...newClient, name: e.target.value })}
                  required
                  autoFocus
                  className="w-full h-10 px-3.5 text-sm bg-slate-50/60 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-blue focus:ring-2 focus:ring-blue/15 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Industry Vertical
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. Agroforestry, Peatland Restoration, Palm Oil"
                  value={newClient.industry}
                  onChange={e => setNewClient({ ...newClient, industry: e.target.value })}
                  required
                  className="w-full h-10 px-3.5 text-sm bg-slate-50/60 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-blue focus:ring-2 focus:ring-blue/15 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Person-in-Charge (PIC)
                </label>
                <input 
                  type="text" 
                  placeholder="Full name & title"
                  value={newClient.pic}
                  onChange={e => setNewClient({ ...newClient, pic: e.target.value })}
                  required
                  className="w-full h-10 px-3.5 text-sm bg-slate-50/60 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-blue focus:ring-2 focus:ring-blue/15 transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Official Email
                  </label>
                  <input 
                    type="email" 
                    placeholder="contact@company.com"
                    value={newClient.email}
                    onChange={e => setNewClient({ ...newClient, email: e.target.value })}
                    required
                    className="w-full h-10 px-3.5 text-sm bg-slate-50/60 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-blue focus:ring-2 focus:ring-blue/15 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Emergency Phone
                  </label>
                  <input 
                    type="tel" 
                    placeholder="+62 8..."
                    value={newClient.phone}
                    onChange={e => setNewClient({ ...newClient, phone: e.target.value })}
                    required
                    className="w-full h-10 px-3.5 text-sm bg-slate-50/60 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-blue focus:ring-2 focus:ring-blue/15 transition-colors"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 mt-5">
                <button 
                  type="button" 
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer" 
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 text-sm font-semibold text-white bg-blue hover:bg-blue2 rounded-lg shadow-sm transition-colors cursor-pointer"
                >
                  Create Client Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

