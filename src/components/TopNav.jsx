import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const TopNav = ({ onToggleSidebar }) => {
  const { currentUser, userRole, backendHealth, logout } = useApp();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
        <button className="mobile-menu" onClick={onToggleSidebar} aria-label="Open navigation">
          ☰
        </button>
        <input className="search" placeholder="Search project, location or sensor..." />
      </div>

      <div className="topright" style={{ position: 'relative' }}>
        <span style={{ fontSize: 13, color: 'var(--muted)' }} title="Local Time">
          ◔ WIB
        </span>
        &nbsp;
        {/* Backend live indicator */}
        <span
          title={backendHealth.isLive ? 'Backend AI Live (localhost:8000)' : 'Simulator Offline Mode'}
          style={{
            color: backendHealth.isLive ? 'var(--green)' : 'var(--amber)',
            fontSize: 14,
            cursor: 'help'
          }}
        >
          ●
        </span>
        &nbsp;
        <div
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <span>{currentUser?.full_name || currentUser?.email?.split('@')[0]}</span>
          <span style={{ fontSize: 10 }}>▾</span>
        </div>

        {dropdownOpen && (
          <div
            className="user-dropdown-menu"
            style={{
              position: 'absolute',
              right: 0,
              top: 40,
              background: '#fff',
              border: '1px solid var(--line)',
              borderRadius: 8,
              boxShadow: '0 8px 24px rgba(16,35,63,0.12)',
              width: 220,
              padding: '12px',
              zIndex: 50,
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 700 }}>
              {currentUser?.full_name || 'Nimbus User'}
            </div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 8 }}>
              {currentUser?.email}
            </div>
            <div style={{ marginBottom: 10 }}>
              <span className="pill" style={{
                background: userRole === 'superadmin' ? '#fef3c7' : '#e9f8ef',
                color: userRole === 'superadmin' ? '#b45309' : '#168449'
              }}>
                Role: {userRole}
              </span>
            </div>
            <div style={{ borderTop: '1px solid var(--line)', paddingTop: 8 }}>
              <button
                className="secondary"
                style={{ width: '100%', height: 32, fontSize: 12, color: 'var(--red)', borderColor: '#fca5a5' }}
                onClick={() => { setDropdownOpen(false); logout(); }}
              >
                Log Out
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
