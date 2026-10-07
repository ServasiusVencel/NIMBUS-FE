import React from 'react';
import { User, Lock, Bell } from 'lucide-react';

/**
 * SettingsHeader: Clean header with title, role badge, and navigation tabs.
 * 100% pure Tailwind CSS.
 */
export const SettingsHeader = ({ activeTab, onChangeTab, isSuperadmin, activeClientName }) => {
  return (
    <div className="space-y-4">
      {/* Title & Role Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Pengaturan Akun &amp; Profil
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Kelola informasi data diri, kredensial login, dan parameter telemetri operasional platform Nimbus.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold bg-white shadow-xs">
          <span className={`w-2 h-2 rounded-full ${isSuperadmin ? 'bg-amber-500' : 'bg-emerald-500'}`} />
          <span className="text-slate-700">
            {isSuperadmin ? '🛡️ Superadmin Platform' : `👤 Operator Lapangan (${activeClientName || 'Client Unit'})`}
          </span>
        </div>
      </div>

      {/* Tabs Row */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-px">
        <button
          type="button"
          onClick={() => onChangeTab('profile')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === 'profile'
              ? 'border-sky-600 text-sky-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <User size={16} />
          <span>Profil Pengguna</span>
        </button>

        <button
          type="button"
          onClick={() => onChangeTab('security')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === 'security'
              ? 'border-sky-600 text-sky-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Lock size={16} />
          <span>Keamanan &amp; Kata Sandi</span>
        </button>

        <button
          type="button"
          onClick={() => onChangeTab('preferences')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === 'preferences'
              ? 'border-sky-600 text-sky-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Bell size={16} />
          <span>Preferensi &amp; Notifikasi</span>
        </button>
      </div>
    </div>
  );
};

export default SettingsHeader;
