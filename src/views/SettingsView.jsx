import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserProfileModel } from '../models/UserProfileModel';
import { SecuritySettingsModel } from '../models/SecuritySettingsModel';
import { SystemPreferencesModel } from '../models/SystemPreferencesModel';
import { AccountSettingsService } from '../services/AccountSettingsService';
import { SettingsHeader } from '../components/settings/SettingsHeader';
import { ProfileSettingsTab } from '../components/settings/ProfileSettingsTab';
import { SecuritySettingsTab } from '../components/settings/SecuritySettingsTab';
import { PreferencesSettingsTab } from '../components/settings/PreferencesSettingsTab';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export const SettingsView = () => {
  const { currentUser, userRole, updateProfile, changePassword, activeClient } = useApp();

  // Tab State: 'profile' | 'security' | 'preferences'
  const [activeTab, setActiveTab] = useState('profile');

  // Domain Model States
  const [profileModel, setProfileModel] = useState(() => UserProfileModel.fromUser(currentUser));
  const [securityModel, setSecurityModel] = useState(() => SecuritySettingsModel.createDefault());
  const [preferencesModel, setPreferencesModel] = useState(() => SystemPreferencesModel.fromUser(currentUser));

  // Async & Notification State
  const [statusMessage, setStatusMessage] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const isSuperadmin = userRole === 'superadmin';
  const sessionInfo = AccountSettingsService.getSessionMetadata();

  // --- Handlers using OOP Service ---
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setStatusMessage(null);
    setIsSaving(true);

    try {
      await AccountSettingsService.saveProfile(profileModel, updateProfile);
      setStatusMessage({ type: 'success', text: 'Profil dan identitas pengguna berhasil diperbarui.' });
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.message || 'Gagal menyimpan profil.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSavePassword = async (e) => {
    e.preventDefault();
    setStatusMessage(null);
    setIsSaving(true);

    try {
      await AccountSettingsService.changePassword(securityModel, changePassword);
      setSecurityModel(prev => prev.reset());
      setStatusMessage({ type: 'success', text: 'Kata sandi akun Anda berhasil diperbarui.' });
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.message || 'Gagal memperbarui kata sandi.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSavePreferences = async (e) => {
    e.preventDefault();
    setStatusMessage(null);
    setIsSaving(true);

    try {
      await AccountSettingsService.savePreferences(preferencesModel, updateProfile);
      setStatusMessage({ type: 'success', text: 'Preferensi telemetri dan notifikasi berhasil disimpan.' });
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.message || 'Gagal menyimpan preferensi.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Settings Navigation & Header Component */}
      <SettingsHeader
        activeTab={activeTab}
        onChangeTab={(tab) => { setActiveTab(tab); setStatusMessage(null); }}
        isSuperadmin={isSuperadmin}
        activeClientName={activeClient?.name}
      />

      {/* Global Status Banner */}
      {statusMessage && (
        <div
          className={`p-4 rounded-xl text-sm font-medium flex items-center gap-3 shadow-xs animate-fade-in ${statusMessage.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border border-rose-200 text-rose-800'
            }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle size={18} className="text-rose-600 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Tab Panels with Dedicated Components */}
      {activeTab === 'profile' && (
        <ProfileSettingsTab
          profileModel={profileModel}
          onFieldChange={(field, val) => setProfileModel(prev => prev.withField(field, val))}
          onSubmit={handleSaveProfile}
          isSaving={isSaving}
        />
      )}

      {activeTab === 'security' && (
        <SecuritySettingsTab
          securityModel={securityModel}
          onFieldChange={(field, val) => setSecurityModel(prev => prev.withField(field, val))}
          onToggleVisibility={(target) => setSecurityModel(prev => prev.toggleVisibility(target))}
          onSubmit={handleSavePassword}
          sessionInfo={sessionInfo}
          isSaving={isSaving}
        />
      )}

      {activeTab === 'preferences' && (
        <PreferencesSettingsTab
          preferencesModel={preferencesModel}
          onNotificationToggle={(key, val) => setPreferencesModel(prev => prev.withNotification(key, val))}
          onPreferenceChange={(key, val) => setPreferencesModel(prev => prev.withPreference(key, val))}
          onSubmit={handleSavePreferences}
          isSaving={isSaving}
        />
      )}
    </div>
  );
};

export default SettingsView;
