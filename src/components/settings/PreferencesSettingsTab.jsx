import React from 'react';
import { Bell, Sliders, Save } from 'lucide-react';

export const PreferencesSettingsTab = ({
  preferencesModel,
  onNotificationToggle,
  onPreferenceChange,
  onSubmit,
  isSaving = false
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Early Warning Channels */}
        <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
            <Bell size={18} className="text-sky-600" />
            <span>Saluran Peringatan Dini (Alerts)</span>
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
              <div>
                <div className="text-sm font-bold text-slate-800">
                  Notifikasi Karhutla FWI Kritis
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Kirim alert darurat jika indeks bahaya api melebihi batas bahaya (&gt; 15.0).
                </div>
              </div>
              <input
                type="checkbox"
                checked={preferencesModel.notifications.fwiAlert}
                onChange={(e) => onNotificationToggle('fwiAlert', e.target.checked)}
                className="w-4.5 h-4.5 accent-sky-600 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
              <div>
                <div className="text-sm font-bold text-slate-800">
                  Alert Muka Air Gambut TMAT
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Peringatan instan bila kedalaman piezometer melampaui ambang kritis -40 cm.
                </div>
              </div>
              <input
                type="checkbox"
                checked={preferencesModel.notifications.tmatAlert}
                onChange={(e) => onNotificationToggle('tmatAlert', e.target.checked)}
                className="w-4.5 h-4.5 accent-sky-600 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
              <div>
                <div className="text-sm font-bold text-slate-800">
                  Laporan Intelijen Harian
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Kirimkan ringkasan telemetri dan prediksi AI setiap hari pukul 07:00 WIB via Email.
                </div>
              </div>
              <input
                type="checkbox"
                checked={preferencesModel.notifications.dailyDigest}
                onChange={(e) => onNotificationToggle('dailyDigest', e.target.checked)}
                className="w-4.5 h-4.5 accent-sky-600 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
              <div>
                <div className="text-sm font-bold text-slate-800">
                  Telegram Bot Direct Alert
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Teruskan notifikasi kejadian darurat ke saluran bot Telegram tim operasional.
                </div>
              </div>
              <input
                type="checkbox"
                checked={preferencesModel.notifications.telegramAlert}
                onChange={(e) => onNotificationToggle('telegramAlert', e.target.checked)}
                className="w-4.5 h-4.5 accent-sky-600 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* System & Telemetry Preferences */}
        <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
            <Sliders size={18} className="text-sky-600" />
            <span>Preferensi Tampilan &amp; Satuan</span>
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Satuan Suhu Sensor
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => onPreferenceChange('temperatureUnit', 'C')}
                  className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${preferencesModel.preferences.temperatureUnit === 'C'
                      ? 'bg-sky-50 border-sky-300 text-sky-700'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                >
                  Celsius (°C) - Standar
                </button>
                <button
                  type="button"
                  onClick={() => onPreferenceChange('temperatureUnit', 'F')}
                  className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${preferencesModel.preferences.temperatureUnit === 'F'
                      ? 'bg-sky-50 border-sky-300 text-sky-700'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                >
                  Fahrenheit (°F)
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Interval Auto-Refresh Data Telemetri
              </label>
              <select
                value={preferencesModel.preferences.refreshInterval}
                onChange={(e) => onPreferenceChange('refreshInterval', Number(e.target.value))}
                className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm text-slate-800 bg-white outline-none focus:border-sky-600 transition-all cursor-pointer"
              >
                <option value={10}>Setiap 10 Detik (Sensitif / Live)</option>
                <option value={15}>Setiap 15 Detik (Direkomendasikan)</option>
                <option value={30}>Setiap 30 Detik</option>
                <option value={60}>Setiap 60 Detik (Hemat Bandwidth)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Zona Waktu Operasional
              </label>
              <select
                value={preferencesModel.preferences.timezone}
                onChange={(e) => onPreferenceChange('timezone', e.target.value)}
                className="w-full h-10 px-3 border border-slate-200 rounded-lg text-sm text-slate-800 bg-white outline-none focus:border-sky-600 transition-all cursor-pointer"
              >
                <option value="WIB">WIB (Waktu Indonesia Barat - UTC+7)</option>
                <option value="WITA">WITA (Waktu Indonesia Tengah - UTC+8)</option>
                <option value="WIT">WIT (Waktu Indonesia Timur - UTC+9)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={isSaving}
          className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm rounded-lg cursor-pointer transition-all disabled:opacity-50 flex items-center gap-2 shadow-xs"
        >
          <Save size={16} />
          <span>{isSaving ? 'Menyimpan...' : 'Simpan Preferensi Sistem'}</span>
        </button>
      </div>
    </form>
  );
};

export default PreferencesSettingsTab;
