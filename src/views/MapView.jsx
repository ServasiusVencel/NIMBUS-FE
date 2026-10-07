import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';

export const MapView = () => {
  const { setActiveTab, setActiveSensorId, activeSensor } = useApp();
  const [selectedSensorPopup, setSelectedSensorPopup] = useState(null);
  const mapWrapRef = useRef(null);

  const sensorsList = [
    { id: 'AWS-PLG-01', cls: 's1', status: 'Online', gps: '-0.9476, 101.4321', temp: '32.5°C', rh: '68%', tmat: '-48.5 cm', risk: 'Tinggi' },
    { id: 'AWS-PLG-02', cls: 's2', status: 'Online', gps: '-1.0248, 102.1184', temp: '31.8°C', rh: '72%', tmat: '-32.0 cm', risk: 'Sedang' },
    { id: 'AWS-PT-03', cls: 's3', status: 'Warning', gps: '-1.7062, 103.6145', temp: '33.2°C', rh: '48%', tmat: '-62.0 cm', risk: 'Tinggi' },
    { id: 'AWS-AGR-04', cls: 's4', status: 'Online', gps: '-6.2187, 106.8456', temp: '29.5°C', rh: '78%', tmat: '-18.5 cm', risk: 'Rendah' },
    { id: 'AWS-PLG-05', cls: 's5', status: 'Offline', gps: '-2.2147, 113.9213', temp: '--', rh: '--', tmat: '--', risk: 'Unknown' },
    { id: 'AWS-PT-06', cls: 's6', status: 'Offline', gps: '-4.1834, 139.7821', temp: '--', rh: '--', tmat: '--', risk: 'Unknown' },
    { id: 'AWS-PT-07', cls: 's7', status: 'Warning', gps: '-1.8215, 103.5342', temp: '33.0°C', rh: '51%', tmat: '-55.0 cm', risk: 'Tinggi' },
    { id: 'AWS-AGR-08', cls: 's8', status: 'Online', gps: '-2.4567, 115.2842', temp: '30.8°C', rh: '65%', tmat: '-24.0 cm', risk: 'Sedang' },
  ];

  const handleSensorClick = (e, sensor) => {
    e.stopPropagation();
    setActiveSensorId(sensor.id);

    if (!mapWrapRef.current) return;
    const mr = mapWrapRef.current.getBoundingClientRect();
    const btn = e.currentTarget.getBoundingClientRect();

    const left = Math.min(Math.max(10, btn.left - mr.left + 22), mr.width - 240);
    const top = Math.min(Math.max(10, btn.top - mr.top - 20), mr.height - 180);

    setSelectedSensorPopup({
      ...sensor,
      x: left,
      y: top,
    });
  };

  const handleClosePopup = (e) => {
    if (e) e.stopPropagation();
    setSelectedSensorPopup(null);
  };

  return (
    <section id="screen-map" className="screen active">
      <div className="page-title">
        <div>
          <h2>Environmental Monitoring</h2>
          <p>Monitor your deployed IoT sensors and access Nimbus intelligence modules.</p>
        </div>
        <div className="toolbar">
          <select className="select" defaultValue="Palm Oil Estate">
            <option>Project: Palm Oil Estate</option>
            <option>Project: Peatland Core Reserve</option>
            <option>All Projects</option>
          </select>
          <button className="download">⌄ Layers</button>
        </div>
      </div>

      {/* Map Wrap: preserved exactly as requested */}
      <div className="map-wrap" id="clientMap" ref={mapWrapRef} onClick={handleClosePopup}>
        <div className="map">
          <div className="map-grid"></div>
          <div className="flatland">
            <span className="land-a"></span>
            <span className="land-b"></span>
            <span className="land-c"></span>
            <span className="land-d"></span>
            <span className="land-e"></span>
          </div>

          {/* Interactive sensors */}
          {sensorsList.map((s) => {
            const statusClass = s.status === 'Online' ? 'online' : s.status === 'Warning' ? 'warning' : 'offline';
            return (
              <button
                key={s.id}
                className={`sensor ${statusClass} ${s.cls} ${activeSensor?.id === s.id ? 'active-pulse' : ''}`}
                aria-label={`Sensor ${s.id}`}
                title={`${s.id} (${s.status})`}
                onClick={(e) => handleSensorClick(e, s)}
              />
            );
          })}

          {/* Popup */}
          {selectedSensorPopup && (
            <div
              id="sensorPopup"
              className="sensor-popup"
              style={{ left: `${selectedSensorPopup.x}px`, top: `${selectedSensorPopup.y}px` }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="close-popup" onClick={handleClosePopup}>×</button>
              <b>{selectedSensorPopup.id}</b>
              <div className="gps">
                GPS: {selectedSensorPopup.gps}
              </div>
              <div className={`status ${selectedSensorPopup.status === 'Online' ? 'good' : selectedSensorPopup.status === 'Warning' ? 'caution' : 'notrec'}`}>
                ● {selectedSensorPopup.status}
              </div>
              <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid var(--line)', fontSize: 11, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
                <div>Temp: <b>{selectedSensorPopup.temp}</b></div>
                <div>RH: <b>{selectedSensorPopup.rh}</b></div>
                <div>TMAT: <b>{selectedSensorPopup.tmat}</b></div>
                <div>Risk: <b style={{ color: selectedSensorPopup.risk === 'Tinggi' ? 'var(--red)' : 'var(--green)' }}>{selectedSensorPopup.risk}</b></div>
              </div>
              <div style={{ marginTop: 10, display: 'flex', gap: 6 }}>
                <button
                  className="primary"
                  style={{ height: 28, fontSize: 11, padding: '0 8px', width: '100%' }}
                  onClick={() => setActiveTab('weather')}
                >
                  View Weather →
                </button>
              </div>
            </div>
          )}

          {/* Map Panels: Legend & Stats */}
          <div className="map-panel legend">
            <h4>Sensor Status</h4>
            <div><i className="dot online"></i>Online (24)</div>
            <div><i className="dot danger"></i>Offline (3)</div>
            <div><i className="dot warning"></i>Warning (2)</div>
          </div>

          <div className="map-panel stats">
            <div className="stat"><b>29</b><span>Total Sensors</span></div>
            <div className="stat"><b style={{ color: 'var(--green)' }}>24</b><span>Online</span></div>
            <div className="stat"><b style={{ color: 'var(--red)' }}>3</b><span>Offline</span></div>
            <div className="stat"><b style={{ color: 'var(--amber)' }}>2</b><span>Warning</span></div>
          </div>
        </div>
      </div>

      {/* Intelligence Modules Section */}
      <div style={{ marginTop: 24, marginBottom: 12 }}>
        <h3 style={{ margin: 0, fontSize: 17 }}>Nimbus Intelligence Modules</h3>
        <p className="muted" style={{ margin: '5px 0 0', fontSize: 12 }}>
          Select a module to explore climate and environmental intelligence for your sensors.
        </p>
      </div>

      <div className="module-grid">
        <div className="card">
          <h3>1. General Weather</h3>
          <p>10-day weather forecast, real-time observations and downloadable sensor variables.</p>
          <button className="module-btn" onClick={() => setActiveTab('weather')}>
            Open General Weather →
          </button>
        </div>
        <div className="card">
          <h3>2. Fire Warning Index</h3>
          <p>Predictive fire-risk intelligence based on local weather and environmental conditions.</p>
          <button className="module-btn" onClick={() => setActiveTab('fire')}>
            Open Fire Warning →
          </button>
        </div>
        <div className="card">
          <h3>3. Climate-Resilient Agriculture</h3>
          <p>Recommended operation windows and future pest & disease early warning.</p>
          <button className="module-btn" onClick={() => setActiveTab('agri')}>
            Open Climate Agriculture →
          </button>
        </div>
      </div>
    </section>
  );
};
