import React, { useState } from 'react';
import { X, ShieldCheck, ArrowRight, Lock, CheckCircle2, Globe, Building2, KeyRound, Loader2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { EnterpriseAuthManager } from '../../services/EnterpriseAuthManager';

/**
 * SsoModal: Enterprise Single Sign-On (SSO) Authentication Dialog.
 * Powered by EnterpriseAuthManager OOP service for clean code reuse.
 */
export const SsoModal = ({ isOpen, onClose }) => {
  const { loginWithSSO } = useApp();
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [corporateDomain, setCorporateDomain] = useState('');
  const [ssoRole, setSsoRole] = useState('user'); // 'user' | 'superadmin'
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authStep, setAuthStep] = useState('');
  const [authSuccess, setAuthSuccess] = useState(false);

  if (!isOpen) return null;

  const handleStartSso = async (providerId, customDomain = '') => {
    const provider = EnterpriseAuthManager.SSO_PROVIDERS.find(p => p.id === providerId) 
      || EnterpriseAuthManager.SSO_PROVIDERS[0];

    setSelectedProvider(provider);
    setIsAuthenticating(true);
    setAuthSuccess(false);

    try {
      const authenticatedUser = await EnterpriseAuthManager.executeSsoHandshake(
        provider.id,
        {
          role: ssoRole,
          domain: customDomain || corporateDomain.trim(),
        },
        (stepText) => setAuthStep(stepText)
      );

      setAuthSuccess(true);
      await new Promise(r => setTimeout(r, 400));

      await loginWithSSO(provider.name, {
        role: authenticatedUser.role,
        email: authenticatedUser.email,
        fullName: authenticatedUser.full_name,
        tenant: authenticatedUser.sso_tenant
      });

      onClose();
    } catch (err) {
      setAuthStep(`Gagal otentikasi: ${err.message}`);
      setIsAuthenticating(false);
    }
  };

  const handleDomainSubmit = (e) => {
    e.preventDefault();
    if (!corporateDomain.trim()) return;
    handleStartSso('okta-saml', corporateDomain.trim());
  };

  const roleBadge = EnterpriseAuthManager.getRoleBadge(ssoRole);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white flex items-start justify-between relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-40 h-40 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-center gap-3.5 z-10">
            <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center shrink-0 text-sky-400 shadow-inner">
              <ShieldCheck size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold font-mono tracking-wider uppercase px-2 py-0.5 rounded bg-sky-500/25 border border-sky-400/30 text-sky-300">
                  ENTERPRISE IDENTITY
                </span>
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Lock size={10} /> SAML 2.0 / OIDC
                </span>
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight mt-1">Single Sign-On (SSO)</h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Masuk aman menggunakan kredensial identitas korporasi Anda.
              </p>
            </div>
          </div>

          <button 
            type="button"
            onClick={onClose}
            disabled={isAuthenticating}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition cursor-pointer shrink-0 z-10 disabled:opacity-30"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Authenticating Screen Overlay */}
          {isAuthenticating ? (
            <div className="py-8 flex flex-col items-center text-center space-y-4">
              <div className="relative">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                  authSuccess 
                    ? 'bg-emerald-50 text-emerald-600 ring-4 ring-emerald-100 scale-110' 
                    : 'bg-sky-50 text-sky-600 ring-4 ring-sky-100'
                }`}>
                  {authSuccess ? (
                    <CheckCircle2 size={32} className="animate-bounce" />
                  ) : (
                    <Loader2 size={30} className="animate-spin text-sky-600" />
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-base font-bold text-slate-900">
                  {authSuccess ? 'Otentikasi Berhasil!' : `Menghubungkan ke ${selectedProvider?.name || 'Identity Provider'}`}
                </h4>
                <p className="text-xs text-slate-500 mt-1 max-w-xs font-mono animate-pulse">
                  {authStep}
                </p>
              </div>

              <div className="w-full max-w-xs bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className={`h-full bg-sky-500 rounded-full transition-all duration-500 ${
                  authSuccess ? 'w-full bg-emerald-500' : 'w-3/4 animate-pulse'
                }`} />
              </div>
            </div>
          ) : (
            <>
              {/* Role Selection for SSO Demo */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <KeyRound size={13} className="text-sky-600" />
                    Target Role Enterprise
                  </span>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${roleBadge.bgClass} ${roleBadge.textClass} ${roleBadge.borderClass}`}>
                    {roleBadge.label}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSsoRole('user')}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold border text-left transition-all cursor-pointer flex flex-col ${
                      ssoRole === 'user'
                        ? 'bg-white border-sky-500 text-sky-700 shadow-xs ring-1 ring-sky-500/20'
                        : 'bg-white/60 border-slate-200 text-slate-600 hover:bg-white'
                    }`}
                  >
                    <span>Operator / Field</span>
                    <span className="text-[10px] text-slate-400 font-normal">Standard User</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSsoRole('superadmin')}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold border text-left transition-all cursor-pointer flex flex-col ${
                      ssoRole === 'superadmin'
                        ? 'bg-white border-amber-500 text-amber-800 shadow-xs ring-1 ring-amber-500/20'
                        : 'bg-white/60 border-slate-200 text-slate-600 hover:bg-white'
                    }`}
                  >
                    <span>Superadmin / Owner</span>
                    <span className="text-[10px] text-slate-400 font-normal">Full CMS Privileges</span>
                  </button>
                </div>
              </div>

              {/* Provider 1: Google Workspace */}
              <button
                type="button"
                onClick={() => handleStartSso('google-workspace')}
                className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:border-sky-300 bg-white hover:bg-slate-50 transition-all cursor-pointer group shadow-2xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold text-slate-800 group-hover:text-sky-700">Google Workspace</div>
                    <div className="text-[11px] text-slate-500">Login via akun Google Cloud / Workspace korporasi</div>
                  </div>
                </div>
                <ArrowRight size={15} className="text-slate-400 group-hover:text-sky-600 group-hover:translate-x-0.5 transition" />
              </button>

              {/* Provider 2: Microsoft Entra ID */}
              <button
                type="button"
                onClick={() => handleStartSso('microsoft-entra')}
                className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:border-sky-300 bg-white hover:bg-slate-50 transition-all cursor-pointer group shadow-2xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5" viewBox="0 0 23 23">
                      <path fill="#f35325" d="M1 1h10v10H1z" />
                      <path fill="#81bc06" d="M12 1h10v10H12z" />
                      <path fill="#05a6f0" d="M1 12h10v10H1z" />
                      <path fill="#ffba08" d="M12 12h10v10H12z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold text-slate-800 group-hover:text-sky-700">Microsoft Entra ID (Azure AD)</div>
                    <div className="text-[11px] text-slate-500">Office 365 & Corporate Tenant Directory</div>
                  </div>
                </div>
                <ArrowRight size={15} className="text-slate-400 group-hover:text-sky-600 group-hover:translate-x-0.5 transition" />
              </button>

              {/* Provider 3: Okta / Corporate Domain Discovery */}
              <div className="border border-slate-200 rounded-xl p-3.5 bg-white">
                <div className="flex items-center gap-2 mb-2">
                  <Building2 size={14} className="text-slate-600" />
                  <span className="text-xs font-bold text-slate-800">Corporate Domain Discovery (SAML / Okta)</span>
                </div>
                <form onSubmit={handleDomainSubmit} className="flex gap-2">
                  <div className="relative flex-1">
                    <Globe size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="e.g. pt-nusantara.co.id"
                      value={corporateDomain}
                      onChange={e => setCorporateDomain(e.target.value)}
                      className="w-full h-9 pl-8 pr-3 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-100 transition-all text-slate-800 placeholder-slate-400"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-3.5 h-9 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1 shrink-0"
                  >
                    <span>Lanjut</span>
                    <ArrowRight size={12} />
                  </button>
                </form>
                <p className="text-[10px] text-slate-400 mt-2">
                  Sistem otomatis mendeteksi konfigurasi SSO identity provider domain perusahaan Anda.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5">
            <ShieldCheck size={13} className="text-emerald-500" />
            256-Bit TLS Encryption
          </span>
          <span>Nimbus Trust & Identity Protocol</span>
        </div>
      </div>
    </div>
  );
};

export default SsoModal;
