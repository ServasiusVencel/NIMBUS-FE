import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const ClimateAgricultureView = () => {
  const { activeSensor, activeSensorId, setActiveSensorId, sensors } = useApp();
  const [activeActivity, setActiveActivity] = useState('fertilization'); // fertilization, pesticide, others
  const [activeTab, setActiveTab] = useState('windows');

  const activities = [
    { id: 'fertilization', label: '◉ Fertilization' },
    { id: 'pesticide', label: '◯ Pesticide Spraying' },
    { id: 'others', label: '⌁ Other Activities' },
  ];

  const opsWindows = [
    { day: 'Mon', date: '29 Sep', status: 'good', text: '● Good Day' },
    { day: 'Tue', date: '30 Sep', status: 'good', text: '● Good Day' },
    { day: 'Wed', date: '1 Oct', status: 'notrec', text: '● Not Recommended' },
    { day: 'Thu', date: '2 Oct', status: 'notrec', text: '● Not Recommended' },
    { day: 'Fri', date: '3 Oct', status: 'good', text: '● Good Day' },
    { day: 'Sat', date: '4 Oct', status: 'good', text: '● Good Day' },
    { day: 'Sun', date: '5 Oct', status: 'caution', text: '● Caution' },
    { day: 'Mon', date: '6 Oct', status: 'good', text: '● Good Day' },
    { day: 'Tue', date: '7 Oct', status: 'good', text: '● Good Day' },
  ];

  return (
    <section id="screen-agri" className="screen active">
      <div className="page-title">
        <div>
          <h2>Climate-Resilient Agriculture</h2>
          <p>Turn weather and environmental intelligence into actionable field operations.</p>
        </div>
        <select
          className="select"
          value={activeSensor?.id}
          onChange={(e) => setActiveSensorId(e.target.value)}
        >
          {sensors.map(s => (
            <option key={s.id} value={s.id}>{s.id} · {s.name || s.id}</option>
          ))}
        </select>
      </div>

      <div className="tabs">
        <button className={activeTab === 'windows' ? 'active' : ''} onClick={() => setActiveTab('windows')}>Operation Windows</button>
        <button className={activeTab === 'pest' ? 'active' : ''} onClick={() => setActiveTab('pest')}>Pest & Disease Warning</button>
        <button className={activeTab === 'recom' ? 'active' : ''} onClick={() => setActiveTab('recom')}>Recommendations</button>
      </div>

      {/* Operation Windows Card */}
      <div className="card">
        <h3>Recommended Operation Windows</h3>
        <p>Recommendations are based on the 10-day forecast and monitored field conditions.</p>
        
        {/* Activity Buttons */}
        <div style={{ display: 'flex', gap: 8, margin: '15px 0' }}>
          {activities.map(act => (
            <button
              key={act.id}
              className={activeActivity === act.id ? 'primary' : 'select'}
              style={{ height: 38 }}
              onClick={() => setActiveActivity(act.id)}
            >
              {act.label}
            </button>
          ))}
        </div>

        {/* 9-Day Operation Grid */}
        <div className="ops">
          {opsWindows.map((op, idx) => (
            <div className="op" key={idx}>
              <b>{op.day}</b><br />
              <span className="muted">{op.date}</span>
              <p className={op.status}>{op.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Operational Recommendation Card */}
      <div className="card" style={{ marginTop: 18 }}>
        <h3>Operational Recommendation · 29 Sep 2026</h3>
        <p>
          <span className="pill">RECOMMENDED</span> Clear weather and low rainfall probability provide a suitable window for fertilization activities without risk of runoff leaching.
        </p>
        <div className="module-grid">
          <div>
            <b>Temperature</b>
            <p>33°C / 24°C</p>
          </div>
          <div>
            <b>Rainfall Probability</b>
            <p>0%</p>
          </div>
          <div>
            <b>Humidity</b>
            <p>58%</p>
          </div>
        </div>
      </div>

      {/* Pest & Disease Warning Card */}
      <div className="card" style={{ marginTop: 18 }}>
        <h3>Pest & Disease Warning</h3>
        <p>
          Algorithm status: <b>Active Engine v2.1</b>. This module provides early warning based on crop stage, ambient temperature, relative humidity anomalies, and historical outbreak indicators.
        </p>
        <div style={{ marginTop: 12, padding: 12, background: '#f8fafc', borderRadius: 8, display: 'flex', gap: 12, alignItems: 'center' }}>
          <span style={{ fontSize: 22 }}>🌾</span>
          <div>
            <b style={{ fontSize: 13 }}>Ganoderma & Basal Stem Rot Humidity Index: <span style={{ color: 'var(--green)' }}>Low Hazard</span></b>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
              Current soil moisture at 76.5% and low rainfall keep fungal spore germination rates suppressed.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
