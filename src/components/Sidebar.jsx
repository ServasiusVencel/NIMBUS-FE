import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  MapPin, 
  CloudRain, 
  Flame, 
  Sprout, 
  Download, 
  LayoutDashboard, 
  Users, 
  Radio, 
  Sliders, 
  Cpu, 
  LogOut,
  ShieldCheck,
  UserCheck,
  Building2,
  Settings
} from 'lucide-react';

/**
 * Config-Driven Navigation Structure with Independent URL Routes
 */
const NAV_SECTIONS = [
  {
    title: 'Client Workspace',
    items: [
      { id: 'dashboard', path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'map', path: '/map', label: 'Map & Stations', icon: MapPin },
      { id: 'weather', path: '/weather', label: 'General Weather', icon: CloudRain },
      { id: 'fire', path: '/fire', label: 'Fire Warning Index', icon: Flame },
      { id: 'agri', path: '/agri', label: 'Climate Agriculture', icon: Sprout },
      { id: 'download', path: '/export', label: 'Data Exporter', icon: Download },
    ]
  },
  {
    title: 'Platform CMS',
    superadminOnly: true,
    badge: 'Admin',
    items: [
      { id: 'owner', path: '/owner', label: 'Owner Overview', icon: Building2 },
      { id: 'clients', path: '/clients', label: 'Manajemen Klien', icon: Users },
      { id: 'sensors', path: '/sensors', label: 'Armada Sensor AWS', icon: Radio },
      { id: 'modules', path: '/modules', label: 'Konfigurasi Modul', icon: Sliders },
      { id: 'ai_health', path: '/ai-engine', label: 'AI Engine & MLOps', icon: Cpu },
    ]
  },
  {
    title: 'Akun & Sistem',
    items: [
      { id: 'settings', path: '/settings', label: 'Pengaturan Akun', icon: Settings },
    ]
  }
];

/**
 * Pure helper for avatar initials
 */
const getInitials = (name) => {
  if (!name) return 'U';
  const parts = name.trim().split(/\s+/);
  return parts.length >= 2 
    ? `${parts[0][0]}${parts[1][0]}`.toUpperCase() 
    : name.substring(0, 2).toUpperCase();
};

/**
 * Sidebar: Enterprise-grade multi-page navigation sidebar.
 * Built with react-router-dom NavLinks (supports opening multiple tabs / real URLs).
 */
export const Sidebar = ({ isOpen, onClose }) => {
  const { currentUser, userRole, logout, activeClient } = useApp();

  const isSuperadmin = userRole === 'superadmin';
  const displayName = currentUser?.full_name || currentUser?.email?.split('@')[0] || 'Nimbus Operator';

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      <div
        id="sidebarOverlay"
        className={`fixed inset-0 bg-slate-900/40 z-40 transition-opacity md:hidden ${isOpen ? 'block' : 'hidden'}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar: Fixed full height in-flow on desktop, drawer on mobile */}
      <aside className={`bg-white border-r border-slate-200 flex flex-col z-40 transition-transform duration-200 ease-out fixed inset-y-0 left-0 w-64 h-full md:static md:translate-x-0 md:w-64 md:shrink-0 md:z-30 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Brand Logo Link to Dashboard */}
        <Link 
          to="/dashboard" 
          onClick={onClose}
          className="p-5 pb-4 shrink-0 flex items-center justify-between no-underline"
          title="Ke Dashboard"
        >
          <img src="/nimbus-logo.png" alt="Nimbus Environmental Intelligence Platform" className="block w-32 h-auto" />
        </Link>

        {/* Semantic Accessible Navigation */}
        <nav className="flex flex-col gap-1 flex-1 overflow-y-auto px-3.5 py-1 min-h-0" aria-label="Main Navigation">
          {NAV_SECTIONS
            .filter((section) => !section.superadminOnly || isSuperadmin)
            .map((section) => (
            <div key={section.title} className="mb-2">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 px-3 pt-3 pb-1.5 flex items-center justify-between">
                <span>{section.title}</span>
                {section.badge && (
                  <span className="text-[10px] font-semibold bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded border border-amber-200">
                    {section.badge}
                  </span>
                )}
              </div>

              {section.items.map((item) => {
                const IconComponent = item.icon;

                return (
                  <NavLink
                    key={item.id}
                    id={`nav-${item.id}`}
                    to={item.path}
                    onClick={() => { if (onClose) onClose(); }}
                    className={({ isActive }) =>
                      `w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] transition-colors cursor-pointer text-left no-underline ${
                        isActive 
                          ? 'bg-sky-50 text-sky-700 font-semibold' 
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <IconComponent size={17} className={isActive ? 'text-sky-600' : 'text-slate-400'} />
                        <span>{item.label}</span>
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </nav>

        {/* User Profile & Session Box */}
        <div className="p-4 border-t border-slate-200 shrink-0 mt-auto bg-white">
          <div className="flex items-center justify-between">
            <Link 
              to="/settings"
              onClick={onClose}
              className="flex items-center min-w-0 gap-2.5 cursor-pointer group flex-1 mr-2 no-underline"
              title="Buka Pengaturan Akun"
            >
              <span 
                className="w-9 h-9 rounded-full shrink-0 flex items-center justify-center text-xs font-bold text-white shadow-sm transition-transform group-hover:scale-105"
                style={{
                  background: isSuperadmin 
                    ? 'linear-gradient(135deg, #0284c7, #0f172a)' 
                    : 'linear-gradient(135deg, #10b981, #065f46)'
                }}
              >
                {getInitials(displayName)}
              </span>
              <div className="min-w-0">
                <b className="text-[13px] block truncate text-slate-800 group-hover:text-sky-600 transition-colors">
                  {displayName}
                </b>
                <div className="text-xs text-slate-500 flex items-center gap-1">
                  {isSuperadmin ? (
                    <>
                      <ShieldCheck size={12} className="text-sky-600" />
                      <span>Superadmin · Platform</span>
                    </>
                  ) : (
                    <>
                      <UserCheck size={12} className="text-emerald-600" />
                      <span className="truncate">{activeClient?.name || 'Client Operator'}</span>
                    </>
                  )}
                </div>
              </div>
            </Link>

            <div className="flex items-center gap-1 shrink-0">
              <NavLink
                to="/settings"
                onClick={onClose}
                className={({ isActive }) =>
                  `p-1.5 rounded-lg transition-colors cursor-pointer flex items-center justify-center no-underline ${
                    isActive 
                      ? 'text-sky-600 bg-sky-50' 
                      : 'text-slate-400 hover:text-sky-600 hover:bg-slate-50'
                  }`
                }
                title="Pengaturan Akun"
                aria-label="Pengaturan Akun"
              >
                <Settings size={16} />
              </NavLink>
              <button
                type="button"
                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer border-0 bg-transparent flex items-center justify-center"
                onClick={logout}
                title="Logout"
                aria-label="Logout"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
