import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  CloudRain, 
  Flame, 
  Sprout, 
  MapPin, 
  ShieldCheck, 
  Users, 
  Cpu, 
  Sliders, 
  Activity, 
  LogOut, 
  Radio, 
  ChevronDown,
  Layers,
  Database
} from 'lucide-react';

export const Navbar = () => {
  const { 
    userRole, 
    activeClient, 
    clients, 
    activeClientId, 
    handleClientChange, 
    sensors, 
    visibleSensors, 
    activeSensorId, 
    setActiveSensorId, 
    activeSensor, 
    activeTab, 
    setActiveTab, 
    backendHealth, 
    logout,
    login 
  } = useApp();

  return (
    <header className="navbar-container">
      {/* Top Brand Bar */}
      <div className="navbar-top">
        <div className="navbar-brand">
          <div className="brand-logo">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
            </svg>
          </div>
          <div className="brand-text">
            <div className="brand-title">
              NIMBUS <span className="brand-tag">INTELLIGENCE</span>
            </div>
            <div className="brand-tagline">Climate & Environmental Intelligence for a Resilient Tomorrow</div>
          </div>
        </div>

        {/* Global Controls & Status */}
        <div className="navbar-controls">
          {/* Backend Status indicator */}
          <div className={`status-pill ${backendHealth.isLive ? 'status-pill-live' : 'status-pill-demo'}`} title={backendHealth.isLive ? 'Connected to local FastAPI on http://localhost:8000' : 'Offline simulation active'}>
            <span className={`status-dot ${backendHealth.isLive ? 'status-dot-pulse' : ''}`} />
            <span>{backendHealth.isLive ? 'AI Engine Online' : 'Simulation Mode'}</span>
          </div>

          {/* Role Switcher (Simulator) */}
          <div className="role-switcher">
            <button 
              className={`role-btn ${userRole === 'client' ? 'active' : ''}`}
              onClick={() => login('client', activeClientId)}
            >
              Client View
            </button>
            <button 
              className={`role-btn ${userRole === 'owner' ? 'active' : ''}`}
              onClick={() => login('owner')}
            >
              Owner CMS
            </button>
          </div>

          {/* User Profile & Logout */}
          <div className="user-profile">
            <div className="user-avatar">
              {userRole === 'owner' ? 'SA' : activeClient?.name?.substring(3, 5)?.toUpperCase() || 'CL'}
            </div>
            <div className="user-details">
              <div className="user-name">{userRole === 'owner' ? 'Super Administrator' : activeClient?.pic}</div>
              <div className="user-org">{userRole === 'owner' ? 'Nimbus Core Platform' : activeClient?.name}</div>
            </div>
            <button className="logout-btn" onClick={logout} title="Sign Out">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Primary Sub-Bar: Client Context & Module Navigation */}
      <div className={`navbar-ribbon ${userRole === 'owner' ? 'navbar-ribbon-owner' : ''}`}>
        <div className="ribbon-selectors">
          {userRole === 'owner' && (
            <div className="owner-role-indicator">
              <ShieldCheck size={13} className="text-blue" />
              <span>OWNER CMS</span>
            </div>
          )}

          {/* Client Selector (Only visible for Owner CMS) */}
          {userRole === 'owner' && (
            <div className="selector-item">
              <span className="selector-label"><Users size={13} className="text-blue" /> Klien:</span>
              <select 
                className="select-custom select-client" 
                value={activeClientId} 
                onChange={(e) => handleClientChange(e.target.value)}
              >
                {clients.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* Active Sensor Selector */}
          <div className="selector-item">
            <span className="selector-label"><Radio size={13} className="text-blue" /> Stasiun:</span>
            <select 
              className="select-custom select-sensor" 
              value={activeSensorId} 
              onChange={(e) => setActiveSensorId(e.target.value)}
            >
              {visibleSensors.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} [{s.status.toUpperCase()}] {s.capabilities.groundwater_tmat ? '• TMAT' : ''}
                </option>
              ))}
            </select>

            {/* Quick Status Badges for Active Sensor */}
            {activeSensor && (
              <div className="sensor-inline-meta">
                <span className={`badge badge-${activeSensor.status}`}>
                  <span className={`dot dot-${activeSensor.status}`} />
                  {activeSensor.status.toUpperCase()}
                </span>
                {activeSensor.capabilities.groundwater_tmat && (
                  <span className="badge badge-info" title="Equipped with Groundwater Level (TMAT) telemetry sensor">
                    TMAT Gambut
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Tab Navigation Navigation */}
        <nav className="navbar-nav">
          {userRole === 'client' ? (
            <>
              <button 
                className={`nav-tab ${activeTab === 'map' ? 'active' : ''}`}
                onClick={() => setActiveTab('map')}
              >
                <MapPin size={15} /> Map & Stations
              </button>
              
              {activeClient?.enabledModules?.general_weather !== false && (
                <button 
                  className={`nav-tab ${activeTab === 'weather' ? 'active' : ''}`}
                  onClick={() => setActiveTab('weather')}
                >
                  <CloudRain size={15} /> General Weather
                </button>
              )}

              {activeClient?.enabledModules?.fire_warning !== false && (
                <button 
                  className={`nav-tab ${activeTab === 'fire' ? 'active' : ''}`}
                  onClick={() => setActiveTab('fire')}
                >
                  <Flame size={15} /> Fire Warning Index
                </button>
              )}

              {activeClient?.enabledModules?.climate_agriculture !== false && (
                <button 
                  className={`nav-tab ${activeTab === 'agriculture' ? 'active' : ''}`}
                  onClick={() => setActiveTab('agriculture')}
                >
                  <Sprout size={15} /> Climate Agriculture
                </button>
              )}
            </>
          ) : (
            <>
              <button 
                className={`nav-tab ${activeTab === 'map' ? 'active' : ''}`}
                onClick={() => setActiveTab('map')}
              >
                <MapPin size={15} /> Peta Stasiun
              </button>
              <button 
                className={`nav-tab ${activeTab === 'clients' ? 'active' : ''}`}
                onClick={() => setActiveTab('clients')}
              >
                <Users size={15} /> Manajemen Klien
              </button>
              <button 
                className={`nav-tab ${activeTab === 'sensors' ? 'active' : ''}`}
                onClick={() => setActiveTab('sensors')}
              >
                <Radio size={15} /> Manajemen Sensor
              </button>
              <button 
                className={`nav-tab ${activeTab === 'modules' ? 'active' : ''}`}
                onClick={() => setActiveTab('modules')}
              >
                <Sliders size={15} /> Modul
              </button>
              <button 
                className={`nav-tab ${activeTab === 'ai_health' ? 'active' : ''}`}
                onClick={() => setActiveTab('ai_health')}
              >
                <Activity size={15} /> AI Engine
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};
