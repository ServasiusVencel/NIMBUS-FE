import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AuthFormModel } from '../models/AuthFormModel';
import { AuthHeroPanel } from './auth/AuthHeroPanel';
import { AuthHeader } from './auth/AuthHeader';
import { AuthFields } from './auth/AuthFields';
import { AuthDemoProfiles } from './auth/AuthDemoProfiles';
import { SsoModal } from './auth/SsoModal';

/**
 * LoginPage: Executive Environmental Intelligence Authentication Screen.
 * - Architecture: Domain OOP (AuthFormModel & EnterpriseAuthManager)
 * - Layout: Edge-to-edge Full-Screen Split View
 * - Styling: 100% Pure Tailwind CSS matching original GitHub repository
 */
export const LoginPage = () => {
  const { login, register, backendHealth } = useApp();
  const [formModel, setFormModel] = useState(() => AuthFormModel.createDefault());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showSsoModal, setShowSsoModal] = useState(false);

  // Field & state handlers via OOP immutable mutations
  const handleFieldChange = (fieldName, value) => {
    setFormModel(prev => prev.withField(fieldName, value));
  };

  const handleModeChange = (newMode) => {
    setError('');
    setSuccessMsg('');
    setFormModel(prev => prev.withMode(newMode));
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    // OOP Domain Validation
    const validation = formModel.validate();
    if (!validation.isValid) {
      setError(validation.error);
      return;
    }

    setLoading(true);
    try {
      if (formModel.isLogin) {
        const payload = formModel.toLoginPayload();
        await login(payload.email, payload.password);
      } else {
        const payload = formModel.toRegisterPayload();
        const res = await register(payload);
        setSuccessMsg(res.message || 'Akun berhasil dibuat! Silakan login sekarang.');
        setFormModel(prev => prev.withMode('login'));
      }
    } catch (err) {
      setError(err.message || 'Gagal masuk. Silakan periksa kembali email dan kata sandi Anda.');
    } finally {
      setLoading(false);
    }
  };

  // Quick 1-Click Demo Login
  const handleQuickLogin = (profile) => {
    setFormModel(prev => prev.withDemoProfile(profile));
    setError('');
    setLoading(true);
    login(profile.email, profile.password)
      .catch(err => {
        setError(err.message || 'Login failed');
      })
      .finally(() => setLoading(false));
  };

  return (
    <section id="login" className="w-full min-h-screen lg:h-screen grid grid-cols-1 lg:grid-cols-[44%_56%] xl:grid-cols-[42%_58%] bg-white text-slate-800 overflow-x-hidden">
      {/* Modular Hero Panel (Left - Full Height Edge-to-Edge) */}
      <AuthHeroPanel />

      {/* Modular Form Panel (Right - Full Height Scrollable) */}
      <div className="h-full min-h-screen lg:min-h-0 overflow-y-auto flex flex-col justify-between p-6 sm:p-12 xl:p-16 bg-white">
        {/* Mobile Header (Brand visible on small screens) */}
        <div className="lg:hidden flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
          <div className="w-[140px] bg-white border border-slate-200 rounded-lg p-2 inline-flex items-center shadow-xs">
            <img src="/nimbus-logo.png" alt="Nimbus" className="w-full h-auto block" />
          </div>
        </div>

        {/* Inner Form Wrapper (Centered with max-w from original design) */}
        <div className="w-full max-w-[460px] mx-auto my-auto py-4">
          {/* Header & Segmented Mode Switch */}
          <AuthHeader 
            formModel={formModel} 
            onChangeMode={handleModeChange} 
          />

          {/* Feedback Alerts */}
          {error && (
            <div className="p-3 rounded-lg text-xs font-medium mb-4 flex items-center gap-2 bg-[#fef2f2] border border-[#fee2e2] text-red-600">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}
          {successMsg && (
            <div className="p-3 rounded-lg text-xs font-medium mb-4 flex items-center gap-2 bg-[#f0fdf4] border border-[#dcfce7] text-emerald-600">
              <span>✓</span>
              <span>{successMsg}</span>
            </div>
          )}

          {/* Input Fields & Submit Form */}
          <AuthFields
            formModel={formModel}
            onFieldChange={handleFieldChange}
            onSubmit={handleSubmit}
            loading={loading}
          />

          {/* 1-Click Demo Profiles & SSO */}
          <AuthDemoProfiles 
            onSelectProfile={handleQuickLogin} 
            onOpenSso={() => setShowSsoModal(true)}
            disabled={loading} 
          />
        </div>

        {/* Server Connection Status Footnote */}
        <div className="mt-6 pt-4 text-center text-[11px] text-slate-400 flex items-center justify-center gap-2">
          <span className={`inline-block w-2 h-2 rounded-full ${backendHealth.isLive ? 'bg-emerald-500' : 'bg-amber-500'}`} />
          <span>
            {backendHealth.isLive 
              ? 'Backend Live: Nimbus AI & Supabase Connected (localhost:8000)'
              : 'Offline Mode: Local Telemetry Simulator Ready'}
          </span>
        </div>
      </div>

      {/* Enterprise Single Sign-On Modal */}
      <SsoModal 
        isOpen={showSsoModal} 
        onClose={() => setShowSsoModal(false)} 
      />
    </section>
  );
};

export default LoginPage;
