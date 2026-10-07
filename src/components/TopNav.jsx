import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Menu, Search, Clock, ChevronDown, LogOut, Radio, Settings } from 'lucide-react';
import { ComboBox } from './ui/combo-box';

export const TopNav = ({ onToggleSidebar }) => {
  const {
    currentUser,
    userRole,
    backendHealth,
    logout,
    activeSensor,
    clients,
    activeClientId,
    handleClientChange,
    setActiveTab
  } = useApp();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB');
    };
    updateTime();
    const timer = setInterval(updateTime, 30000);
    return () => clearInterval(timer);
  }, []);

  const isSuperadmin = userRole === 'superadmin';

  return (
    <header className="h-[70px] shrink-0 bg-white border-b border-slate-200 flex items-center justify-between px-6 sm:px-8 z-20">
      {/* Left controls: Mobile toggle, Search, Client switch */}
      <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation menu"
          className="md:hidden flex items-center justify-center p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors border-0 bg-transparent cursor-pointer"
        >
          <Menu size={20} />
        </button>

        {/* Global Search Bar */}
        <div className="relative flex-1 max-w-sm flex items-center">
          <Search size={15} className="absolute left-3 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search stasiun, klien, parameter..."
            className="w-full h-9 pl-9 pr-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-100 transition-all text-slate-800"
          />
        </div>

        {/* Quick Context Switcher for Superadmin with SeraUI ComboBox */}
        {isSuperadmin && (
          <div className="hidden lg:flex items-center gap-1.5 w-60">
            <ComboBox
              options={clients.map(c => ({ value: c.id, label: c.name }))}
              value={activeClientId}
              onChange={(newClientId) => newClientId && handleClientChange(newClientId)}
              placeholder="Pilih Klien..."
              className="w-full"
            />
          </div>
        )}
      </div>

      {/* Right controls: Clock, AI Status, Active Sensor, Profile */}
      <div className="relative flex items-center gap-3 sm:gap-4 text-xs font-semibold">
        {/* Real-time WIB Clock */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 font-mono">
          <Clock size={13} />
          <span>{timeStr || 'WIB'}</span>
        </div>

        {/* Backend AI live indicator pill */}
        <div
          title={backendHealth.isLive ? 'Terhubung ke FastAPI (localhost:8000)' : 'Mode Simulasi Offline (Standalone Telemetry)'}
          className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium cursor-help border ${backendHealth.isLive
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
            : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}
        >
          <span className={`w-2 h-2 rounded-full ${backendHealth.isLive ? 'bg-emerald-500 ring-2 ring-emerald-200' : 'bg-amber-500'}`} />
          <span>{backendHealth.isLive ? 'AI Engine Live' : 'Simulation Mode'}</span>
        </div>

        {/* Active station pill */}
        {activeSensor && (
          <div className="hidden xl:flex items-center gap-1.5 text-xs text-slate-700 font-mono font-semibold bg-slate-50 px-2 py-1 rounded border border-slate-200">
            <Radio size={12} className="text-sky-600" />
            <span>{activeSensor.id}</span>
          </div>
        )}

        {/* Profile Dropdown Trigger */}
        <div
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors select-none"
        >
          <span className="text-xs sm:text-sm font-semibold text-slate-800">
            {currentUser?.full_name || currentUser?.email?.split('@')[0]}
          </span>
          <ChevronDown size={14} className="text-slate-400" />
        </div>

        {/* Profile Dropdown Menu */}
        {dropdownOpen && (
          <div className="absolute right-0 top-12 bg-white border border-slate-200 rounded-xl shadow-xl w-64 p-3.5 z-50 animate-fade-in">
            <div className="text-sm font-bold text-slate-900">
              {currentUser?.full_name || 'Nimbus User'}
            </div>
            <div className="text-xs text-slate-500 mb-2 truncate">
              {currentUser?.email}
            </div>
            <div className="mb-3">
              <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded ${isSuperadmin ? 'bg-amber-50 text-amber-800 border border-amber-200' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                }`}>
                {isSuperadmin ? 'Superadmin' : 'Operator'}
              </span>
            </div>
            <div className="border-t border-slate-100 pt-2.5 space-y-1.5">
              <Link
                to="/settings"
                onClick={() => setDropdownOpen(false)}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-sky-600 rounded-lg transition-colors cursor-pointer no-underline"
              >
                <Settings size={14} className="text-slate-400" />
                <span>Pengaturan Akun</span>
              </Link>
              <button
                type="button"
                onClick={() => { setDropdownOpen(false); logout(); }}
                className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 border border-red-200 rounded-lg transition-colors cursor-pointer"
              >
                <LogOut size={13} />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default TopNav;
