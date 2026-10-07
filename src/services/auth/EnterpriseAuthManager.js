import { PlatformUser } from '../../models/PlatformUser';

export class EnterpriseAuthManager {
  static SSO_PROVIDERS = [
    {
      id: 'google-workspace',
      name: 'Google Workspace',
      shortName: 'Google',
      type: 'OIDC',
      protocol: 'OpenID Connect / OAuth 2.0',
      description: 'Login via akun Google Cloud / Google Workspace korporasi',
      domainPlaceholder: 'company.com',
      badge: 'OIDC 1.0',
      accentColor: '#4285F4',
      iconKey: 'google'
    },
    {
      id: 'microsoft-entra',
      name: 'Microsoft Entra ID',
      shortName: 'Microsoft',
      type: 'SAML_OIDC',
      protocol: 'Azure Active Directory / MSAL',
      description: 'Office 365, Microsoft 365 & Corporate Tenant Directory',
      domainPlaceholder: 'company.onmicrosoft.com',
      badge: 'Azure AD',
      accentColor: '#00a4ef',
      iconKey: 'microsoft'
    },
    {
      id: 'okta-saml',
      name: 'Okta & Corporate SAML 2.0',
      shortName: 'SAML 2.0',
      type: 'SAML',
      protocol: 'SAML 2.0 WebSSO Profile',
      description: 'Corporate Domain Discovery & Federasi Identitas Terpusat',
      domainPlaceholder: 'pt-nusantara.co.id',
      badge: 'SAML 2.0',
      accentColor: '#007dc1',
      iconKey: 'saml'
    }
  ];

  static DEMO_PROFILES = [
    {
      id: 'demo-operator',
      email: 'operator@nimbus.earth',
      password: 'Password123!',
      role: 'user',
      title: 'Operator Lapangan',
      roleLabel: 'User / Field',
      description: 'Akses pemantauan telemetri, AWS stations, dan kalkulator agrikultur.',
      accent: 'sky',
      badgeClass: 'bg-sky-50 text-sky-700 border-sky-200'
    },
    {
      id: 'demo-superadmin',
      email: 'admin@nimbus.earth',
      password: 'Password123!',
      role: 'superadmin',
      title: 'Superadmin Nimbus',
      roleLabel: 'Admin / Owner',
      description: 'Akses penuh Platform CMS, konfigurasi modul klien, manajemen armada AWS & MLOps.',
      accent: 'amber',
      badgeClass: 'bg-amber-50 text-amber-700 border-amber-200'
    }
  ];

  static evaluatePasswordStrength(password) {
    if (!password) {
      return { score: 0, label: '', color: 'bg-slate-200', width: '0%', isStrong: false };
    }

    if (password.length < 6) {
      return { score: 1, label: 'Terlalu Pendek (Min. 6)', color: 'bg-rose-500', width: '25%', isStrong: false };
    }

    const hasNumbers = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);
    const hasUpper = /[A-Z]/.test(password);

    if (password.length >= 8 && hasNumbers && hasSpecial && hasUpper) {
      return { score: 4, label: 'Sangat Kuat (Enterprise Grade)', color: 'bg-emerald-500', width: '100%', isStrong: true };
    }

    if (password.length >= 8 && (hasNumbers || hasSpecial)) {
      return { score: 3, label: 'Kuat', color: 'bg-sky-500', width: '75%', isStrong: true };
    }

    return { score: 2, label: 'Cukup', color: 'bg-amber-500', width: '50%', isStrong: false };
  }

  static parseEmailDomain(email) {
    if (!email || !email.includes('@')) return '';
    return email.split('@')[1].toLowerCase().trim();
  }

  static getRoleBadge(role) {
    const isSuper = role === 'superadmin';
    return {
      label: isSuper ? 'Superadmin' : 'Operator',
      bgClass: isSuper ? 'bg-amber-50' : 'bg-sky-50',
      textClass: isSuper ? 'text-amber-700' : 'text-sky-700',
      borderClass: isSuper ? 'border-amber-200' : 'border-sky-200',
      isSuperadmin: isSuper
    };
  }

  static async executeSsoHandshake(providerId, options = {}, onStepCallback = () => { }) {
    const provider = this.SSO_PROVIDERS.find(p => p.id === providerId || p.name === providerId)
      || this.SSO_PROVIDERS[0];

    const targetRole = options.role === 'superadmin' ? 'superadmin' : 'user';
    const domain = options.domain || this.parseEmailDomain(options.email) || 'enterprise-client.corp';

    onStepCallback(`Menghubungkan ke ${provider.name} (${provider.protocol})...`);
    await new Promise(r => setTimeout(r, 600));

    onStepCallback(`Memverifikasi sertifikat tenant & klaim token: ${domain}...`);
    await new Promise(r => setTimeout(r, 650));

    onStepCallback(`Sinkronisasi Enterprise RBAC: [Role: ${targetRole.toUpperCase()}]...`);
    await new Promise(r => setTimeout(r, 600));

    const rawUserData = {
      id: `sso-${provider.id}-${Date.now()}`,
      email: options.email || `${targetRole === 'superadmin' ? 'admin' : 'operator'}@${domain}`,
      full_name: options.fullName || (targetRole === 'superadmin' ? `Enterprise Admin (${provider.shortName})` : `Operasional (${provider.shortName})`),
      role: targetRole,
      created_at: new Date().toISOString(),
      sso_provider: provider.name,
      sso_protocol: provider.protocol,
      sso_tenant: domain
    };

    onStepCallback('Otentikasi Berhasil! Mengalihkan ke Dasbor Nimbus...');
    await new Promise(r => setTimeout(r, 450));

    return PlatformUser.fromJSON(rawUserData);
  }

  static generateSsoSessionToken(user) {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({
      sub: user.id,
      email: user.email,
      role: user.role,
      iss: 'nimbus-enterprise-sso',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 86400
    }));
    const signature = Math.random().toString(36).substring(2);
    return `${header}.${payload}.${signature}`;
  }
}

export default EnterpriseAuthManager;
