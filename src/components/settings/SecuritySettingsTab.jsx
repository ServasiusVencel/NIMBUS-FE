import React from 'react';
import { KeyRound, ShieldCheck, Laptop, Eye, EyeOff, Lock } from 'lucide-react';

export const SecuritySettingsTab = ({
  securityModel,
  onFieldChange,
  onToggleVisibility,
  onSubmit,
  sessionInfo,
  isSaving = false
}) => {
  const strength = securityModel.passwordStrength;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Security Info Panel */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
          <ShieldCheck size={18} className="text-sky-600" />
          <span>Standar Keamanan</span>
        </h3>

        <p className="text-xs text-slate-500 leading-relaxed">
          Nimbus mengamankan data telemetri iklim tingkat industri dengan enkripsi end-to-end 256-bit dan proteksi token berbasis HMAC-SHA256.
        </p>

        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2 text-xs">
          <div className="font-semibold text-slate-800">Syarat Kata Sandi:</div>
          <ul className="list-disc list-inside text-slate-500 space-y-1">
            <li>Minimal 6 karakter</li>
            <li>Disarankan kombinasi huruf besar, kecil &amp; angka</li>
            <li>Hindari kata sandi umum atau berulang</li>
          </ul>
        </div>

        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <Laptop size={15} className="text-emerald-600" />
            <span>Sesi: {sessionInfo?.clientPlatform || 'Windows Chrome (Aktif)'}</span>
          </div>
        </div>
      </div>

      {/* Password Rotation Form */}
      <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
          <KeyRound size={18} className="text-sky-600" />
          <span>Perbarui Kata Sandi Akun</span>
        </h3>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Kata Sandi Saat Ini
            </label>
            <div className="relative">
              <input
                type={securityModel.showCurrent ? 'text' : 'password'}
                value={securityModel.currentPassword}
                onChange={(e) => onFieldChange('currentPassword', e.target.value)}
                placeholder="Masukkan kata sandi lama Anda..."
                className="w-full h-10 pl-3.5 pr-10 border border-slate-200 rounded-lg text-sm text-slate-800 bg-white outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-100 transition-all font-mono"
              />
              <button
                type="button"
                onClick={() => onToggleVisibility('current')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                {securityModel.showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Kata Sandi Baru
              </label>
              <div className="relative">
                <input
                  type={securityModel.showNew ? 'text' : 'password'}
                  value={securityModel.newPassword}
                  onChange={(e) => onFieldChange('newPassword', e.target.value)}
                  required
                  placeholder="Minimal 6 karakter..."
                  className="w-full h-10 pl-3.5 pr-10 border border-slate-200 rounded-lg text-sm text-slate-800 bg-white outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-100 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => onToggleVisibility('new')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                >
                  {securityModel.showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Strength Indicator */}
              {securityModel.newPassword && (
                <div className="mt-2 space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Kekuatan:</span>
                    <span className={`font-semibold ${strength.textClass}`}>{strength.label}</span>
                  </div>
                  <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full ${strength.color} transition-all`} style={{ width: strength.width }} />
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Konfirmasi Kata Sandi Baru
              </label>
              <div className="relative">
                <input
                  type={securityModel.showConfirm ? 'text' : 'password'}
                  value={securityModel.confirmPassword}
                  onChange={(e) => onFieldChange('confirmPassword', e.target.value)}
                  required
                  placeholder="Ulangi kata sandi baru..."
                  className="w-full h-10 pl-3.5 pr-10 border border-slate-200 rounded-lg text-sm text-slate-800 bg-white outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-100 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => onToggleVisibility('confirm')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                >
                  {securityModel.showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>

          <div className="pt-3 flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm rounded-lg cursor-pointer transition-all disabled:opacity-50 flex items-center gap-2 shadow-xs"
            >
              <Lock size={16} />
              <span>{isSaving ? 'Memperbarui...' : 'Perbarui Kata Sandi'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SecuritySettingsTab;
