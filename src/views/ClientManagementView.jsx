import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Users, Plus, ShieldCheck, Mail, Phone, Layers, Edit2, Check, X } from 'lucide-react';

export const ClientManagementView = () => {
  const { clients, addClient, updateClient, handleClientChange, setActiveTab } = useApp();
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
    <div className="view-content animate-fade-in">
      <div className="view-header">
        <div>
          <span className="view-tag">CMS PLATFORM ADMINISTRATION</span>
          <h2 className="view-title">Enterprise Client Directory</h2>
          <p className="view-subtitle">
            Manage enterprise clients, organizational PIC assignments, subscription tiers, and project linkages.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          <Plus size={16} /> Add New Client
        </button>
      </div>

      {/* Client Cards Grid */}
      <div className="clients-grid">
        {clients.map(client => (
          <div key={client.id} className="nimbus-card client-card">
            <div className="client-card-header">
              <div>
                <span className="client-id-badge font-mono">{client.id}</span>
                <h3 className="client-name">{client.name}</h3>
                <span className="client-industry">{client.industry}</span>
              </div>
              <span className={`badge ${client.status === 'active' ? 'badge-online' : 'badge-danger'}`}>
                {client.status.toUpperCase()}
              </span>
            </div>

            <div className="client-meta-box">
              <div className="client-meta-item">
                <span className="meta-lbl">Person-in-Charge:</span>
                <span className="meta-val font-semibold">{client.pic}</span>
              </div>
              <div className="client-meta-item">
                <span className="meta-lbl">Contact:</span>
                <span className="meta-val font-mono text-sm">{client.email}</span>
              </div>
              <div className="client-meta-item">
                <span className="meta-lbl">Phone:</span>
                <span className="meta-val font-mono text-sm">{client.phone}</span>
              </div>
              <div className="client-meta-item">
                <span className="meta-lbl">Assigned Stations:</span>
                <span className="meta-val font-mono text-blue font-semibold">{client.assignedSensors.length} Stations</span>
              </div>
            </div>

            <div className="client-card-actions">
              <button 
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  handleClientChange(client.id);
                  setActiveTab('map');
                }}
              >
                Inspect Sensors
              </button>
              <button 
                className="btn btn-outline-blue btn-sm"
                onClick={() => {
                  handleClientChange(client.id);
                  setActiveTab('modules');
                }}
              >
                Manage Modules
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add Client */}
      {showAddModal && (
        <div className="modal-backdrop">
          <div className="modal-card nimbus-card">
            <div className="modal-header">
              <h3 className="modal-title">Register New Enterprise Client</h3>
              <button className="modal-close" onClick={() => setShowAddModal(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleCreate} className="modal-form">
              <div className="form-group">
                <label>Company / Organization Name</label>
                <input 
                  type="text" 
                  className="input-custom" 
                  placeholder="e.g. PT Hutan Tropis Makmur"
                  value={newClient.name}
                  onChange={e => setNewClient({ ...newClient, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Industry Vertical</label>
                <input 
                  type="text" 
                  className="input-custom" 
                  placeholder="e.g. Agroforestry, Peatland Restoration, Palm Oil"
                  value={newClient.industry}
                  onChange={e => setNewClient({ ...newClient, industry: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Person-in-Charge (PIC)</label>
                <input 
                  type="text" 
                  className="input-custom" 
                  placeholder="Full name & title"
                  value={newClient.pic}
                  onChange={e => setNewClient({ ...newClient, pic: e.target.value })}
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Official Email</label>
                  <input 
                    type="email" 
                    className="input-custom" 
                    placeholder="contact@company.com"
                    value={newClient.email}
                    onChange={e => setNewClient({ ...newClient, email: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Emergency Phone</label>
                  <input 
                    type="tel" 
                    className="input-custom" 
                    placeholder="+62 8..."
                    value={newClient.phone}
                    onChange={e => setNewClient({ ...newClient, phone: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Client Account</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
