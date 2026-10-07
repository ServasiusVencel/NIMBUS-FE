import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Radio, Plus, Check, X, Waves, MapPin, Activity, Calendar, ShieldCheck } from 'lucide-react';

export const SensorManagementView = () => {
  const { sensors, addSensor, updateSensor, toggleSensorCapability, clients } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSensor, setNewSensor] = useState({
    name: '',
    clientId: 'CLI-001',
    latitude: -0.5,
    longitude: 101.5,
    hasTmat: true,
  });

  const handleCreate = (e) => {
    e.preventDefault();
    const id = `AWS-${newSensor.name.substring(0, 4).toUpperCase()}-0${sensors.length + 1}`;
    addSensor({
      id,
      name: `${id} (${newSensor.name})`,
      clientId: newSensor.clientId,
      projectId: `PRJ-${id}`,
      latitude: parseFloat(newSensor.latitude),
      longitude: parseFloat(newSensor.longitude),
      status: 'online',
      condition: 'Normal Ops',
      weatherIcon: 'sun',
      installedDate: new Date().toISOString().split('T')[0],
      lastSync: 'Just now',
      capabilities: {
        air_temperature: true,
        relative_humidity: true,
        solar_radiation: true,
        rainfall: true,
        wind: true,
        groundwater_tmat: newSensor.hasTmat,
        soil_moisture: true,
        co2: false,
      },
      currentReadings: {
        air_temperature_c: 31.0,
        relative_humidity_pct: 60.0,
        solar_radiation_wm2: 680.0,
        rainfall_intensity_mmh: 0.0,
        wind_speed_ms: 2.0,
        wind_direction_deg: 90,
        air_pressure_hpa: 990.0,
        water_table_depth_cm: newSensor.hasTmat ? -35.0 : null,
        soil_moisture_pct: 80.0,
      },
      fireRisk: {
        level: 'Moderate',
        score: 0.40,
        fwi_components: { ffmc: 80, dmc: 25, dc: 200, isi: 4.5, bui: 38, fwi: 12 },
        peatlandHazard: newSensor.hasTmat ? {
          tmatStatus: 'SAFE',
          criticalDepth: -40.0,
          message: 'Water table level within normal hydrological parameters.',
        } : null,
      }
    });
    setNewSensor({ name: '', clientId: 'CLI-001', latitude: -0.5, longitude: 101.5, hasTmat: true });
    setShowAddModal(false);
  };

  return (
    <div className="view-content animate-fade-in">
      <div className="view-header">
        <div>
          <span className="view-tag">CMS HARDWARE FLEET</span>
          <h2 className="view-title">IoT Telemetry & AWS Station Fleet</h2>
          <p className="view-subtitle">
            Configure telemetry parameters, calibrate sensors, and toggle hardware telemetry capabilities (e.g. Groundwater Level / TMAT probe).
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          <Plus size={16} /> Deploy New AWS Station
        </button>
      </div>

      {/* Stations Table */}
      <div className="nimbus-card table-card">
        <table className="table-custom">
          <thead>
            <tr>
              <th>Station ID & Name</th>
              <th>Assigned Client</th>
              <th>Coordinates</th>
              <th>Status</th>
              <th>Hardware Capabilities</th>
              <th>Groundwater (TMAT)</th>
            </tr>
          </thead>
          <tbody>
            {sensors.map(s => {
              const client = clients.find(c => c.id === s.clientId);
              return (
                <tr key={s.id}>
                  <td>
                    <div className="table-station-cell">
                      <Radio size={16} className="text-blue" />
                      <div>
                        <div className="font-semibold">{s.name}</div>
                        <div className="font-mono text-xs text-muted">ID: {s.id}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="text-sm font-medium">{client ? client.name : s.clientId}</span>
                  </td>
                  <td>
                    <span className="font-mono text-xs text-muted">
                      {s.latitude.toFixed(4)}, {s.longitude.toFixed(4)}
                    </span>
                  </td>
                  <td>
                    <span className={`badge badge-${s.status}`}>
                      <span className={`dot dot-${s.status}`} />
                      {s.status.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <div className="capability-chips">
                      <span className="cap-chip">Temp</span>
                      <span className="cap-chip">RH</span>
                      <span className="cap-chip">Solar</span>
                      <span className="cap-chip">Rain</span>
                      <span className="cap-chip">Wind</span>
                      {s.capabilities.soil_moisture && <span className="cap-chip">Soil</span>}
                    </div>
                  </td>
                  <td>
                    <button 
                      className={`btn btn-sm ${s.capabilities.groundwater_tmat ? 'btn-primary' : 'btn-secondary'}`}
                      onClick={() => toggleSensorCapability(s.id, 'groundwater_tmat')}
                      title="Click to toggle TMAT capability on this station"
                    >
                      <Waves size={13} />
                      {s.capabilities.groundwater_tmat ? 'TMAT Enabled' : 'Disabled'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Deploy Modal */}
      {showAddModal && (
        <div className="modal-backdrop">
          <div className="modal-card nimbus-card">
            <div className="modal-header">
              <h3 className="modal-title">Deploy New Telemetry Station</h3>
              <button className="modal-close" onClick={() => setShowAddModal(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleCreate} className="modal-form">
              <div className="form-group">
                <label>Station Name & Location Reference</label>
                <input 
                  type="text" 
                  className="input-custom" 
                  placeholder="e.g. Siak Peatland Zone B"
                  value={newSensor.name}
                  onChange={e => setNewSensor({ ...newSensor, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Assigned Enterprise Client</label>
                <select 
                  className="select-custom"
                  value={newSensor.clientId}
                  onChange={e => setNewSensor({ ...newSensor, clientId: e.target.value })}
                >
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Latitude</label>
                  <input 
                    type="number" 
                    step="any"
                    className="input-custom" 
                    value={newSensor.latitude}
                    onChange={e => setNewSensor({ ...newSensor, latitude: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Longitude</label>
                  <input 
                    type="number" 
                    step="any"
                    className="input-custom" 
                    value={newSensor.longitude}
                    onChange={e => setNewSensor({ ...newSensor, longitude: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="form-checkbox-row">
                <label className="checkbox-label">
                  <input 
                    type="checkbox" 
                    checked={newSensor.hasTmat}
                    onChange={e => setNewSensor({ ...newSensor, hasTmat: e.target.checked })}
                  />
                  <span>Equip with Peatland Groundwater Table (TMAT) Piezometer</span>
                </label>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Deploy Station</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
