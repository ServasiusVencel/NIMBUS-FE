import React from 'react';
import { Briefcase, Building2, Smartphone, Save } from 'lucide-react';

export const ProfileSettingsTab = ({
  profileModel,
  onFieldChange,
  onSubmit,
  isSaving = false
}) => {
  const isSuperadmin = profileModel.isSuperadmin;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Summary Card */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col items-center text-center">
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-md mb-4"
          style={{
            background: isSuperadmin
              ? 'linear-gradient(135deg, #0284c7, #0f172a)'
              : 'linear-gradient(135deg, #10b981, #065f46)'
          }}
        >
          {profileModel.initials}
        </div>

        <h3 className="text-lg font-bold text-slate-900">
          {profileModel.fullName || 'Nama Pengguna'}
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          {profileModel.email}
        </p>

        <div className="mt-3">
          <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold border ${isSuperadmin
              ? 'bg-amber-50 text-amber-700 border-amber-200'
              : 'bg-sky-50 text-sky-700 border-sky-200'
            }`}>
            {isSuperadmin ? 'Superadmin Platform' : 'Field Operator'}
          </span>
        </div>

        <div className="w-full mt-6 pt-6 border-t border-slate-100 text-left space-y-3 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <Briefcase size={14} className="text-slate-400 shrink-0" />
            <span className="truncate">{profileModel.title || 'Belum diatur'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Building2 size={14} className="text-slate-400 shrink-0" />
            <span className="truncate">{profileModel.department || 'Belum diatur'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Smartphone size={14} className="text-slate-400 shrink-0" />
            <span>{profileModel.phone || 'Belum diatur'}</span>
          </div>
        </div>
      </div>

      {/* Right Edit Form */}
      <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
          Informasi Pribadi &amp; Kontak Operasional
        </h3>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Nama Lengkap
              </label>
              <input
                type="text"
                value={profileModel.fullName}
                onChange={(e) => onFieldChange('fullName', e.target.value)}
                required
                placeholder="Contoh: Budi Santoso"
                className="w-full h-10 px-3.5 border border-slate-200 rounded-lg text-sm text-slate-800 bg-white outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-100 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Alamat Email Perusahaan
              </label>
              <input
                type="email"
                value={profileModel.email}
                onChange={(e) => onFieldChange('email', e.target.value)}
                required
                placeholder="nama@perusahaan.com"
                className="w-full h-10 px-3.5 border border-slate-200 rounded-lg text-sm text-slate-800 bg-white outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-100 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Nomor Telepon / WhatsApp Alert
              </label>
              <input
                type="tel"
                value={profileModel.phone}
                onChange={(e) => onFieldChange('phone', e.target.value)}
                placeholder="+62 812-xxxx-xxxx"
                className="w-full h-10 px-3.5 border border-slate-200 rounded-lg text-sm text-slate-800 bg-white outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-100 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Jabatan Operasional
              </label>
              <input
                type="text"
                value={profileModel.title}
                onChange={(e) => onFieldChange('title', e.target.value)}
                placeholder="Contoh: Senior Field Hydrologist"
                className="w-full h-10 px-3.5 border border-slate-200 rounded-lg text-sm text-slate-800 bg-white outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-100 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Divisi / Unit Kerja
            </label>
            <input
              type="text"
              value={profileModel.department}
              onChange={(e) => onFieldChange('department', e.target.value)}
              placeholder="Contoh: Peatland Hydrology & IoT Operations"
              className="w-full h-10 px-3.5 border border-slate-200 rounded-lg text-sm text-slate-800 bg-white outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-100 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Bio / Catatan Operasional
            </label>
            <textarea
              rows={3}
              value={profileModel.bio}
              onChange={(e) => onFieldChange('bio', e.target.value)}
              placeholder="Deskripsi singkat tanggung jawab dan cakupan operasional telemetri Anda..."
              className="w-full p-3 border border-slate-200 rounded-lg text-sm text-slate-800 bg-white outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-100 transition-all resize-none"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm rounded-lg cursor-pointer transition-all disabled:opacity-50 flex items-center gap-2 shadow-xs"
            >
              <Save size={16} />
              <span>{isSaving ? 'Menyimpan...' : 'Simpan Perubahan Profil'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileSettingsTab;
