import React from 'react';
import { useApp } from '../context/AppContext';

export const Sidebar = ({ isOpen, onClose }) => {
  const { activeTab, setActiveTab, currentUser, userRole, logout } = useApp();

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  const handleNav = (tab) => {
    setActiveTab(tab);
    if (onClose) onClose();
  };

  return (
    <>
      <div
        id="sidebarOverlay"
        className={`sidebar-overlay ${isOpen ? 'open' : ''}`}
        onClick={onClose}
      />
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="brand-image">
          <img src="/nimbus-logo.png" alt="Nimbus logo" />
        </div>

        <div className="nav">
          <div className="section">Client Workspace</div>
          <button
            id="nav-map"
            className={activeTab === 'map' ? 'active' : ''}
            onClick={() => handleNav('map')}
          >
            ⌖ &nbsp; Map & Sensors
          </button>
          <button
            id="nav-weather"
            className={activeTab === 'weather' ? 'active' : ''}
            onClick={() => handleNav('weather')}
          >
            ◌ &nbsp; General Weather
          </button>
          <button
            id="nav-fire"
            className={activeTab === 'fire' ? 'active' : ''}
            onClick={() => handleNav('fire')}
          >
            ♨ &nbsp; Fire Warning Index
          </button>
          <button
            id="nav-agri"
            className={activeTab === 'agri' ? 'active' : ''}
            onClick={() => handleNav('agri')}
          >
            ⌁ &nbsp; Climate-Resilient Agriculture
          </button>
          <button
            id="nav-download"
            className={activeTab === 'download' ? 'active' : ''}
            onClick={() => handleNav('weather')}
          >
            ⇩ &nbsp; Data Download
          </button>

          <div className="section">Administration</div>
          <button
            id="nav-owner"
            className={activeTab === 'owner' ? 'active' : ''}
            onClick={() => handleNav('owner')}
          >
            ▦ &nbsp; Owner Dashboard
          </button>
          <button
            id="nav-settings"
            className={activeTab === 'settings' ? 'active' : ''}
            onClick={() => handleNav('owner')}
          >
            ⚙ &nbsp; Settings & AI Engine
          </button>
        </div>

        {/* User Box at bottom with avatar and logout */}
        <div className="userbox">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', minWidth: 0 }}>
              <span className="avatar">{getInitials(currentUser?.full_name || currentUser?.email)}</span>
              <div style={{ minWidth: 0 }}>
                <b style={{ fontSize: 12, display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {currentUser?.full_name || currentUser?.email?.split('@')[0]}
                </b>
                <div className="muted" style={{ fontSize: 10 }}>
                  {userRole === 'superadmin' ? 'Superadmin · Nimbus' : 'PT Lestari Hijau'}
                </div>
              </div>
            </div>
            <button
              onClick={logout}
              title="Logout"
              style={{
                border: 0,
                background: 'transparent',
                cursor: 'pointer',
                color: 'var(--muted)',
                fontSize: 16,
                padding: 4
              }}
            >
              🚪
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
