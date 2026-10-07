
export class PlatformUser {
  constructor(data = {}) {
    this.id = data.id || '';
    this.email = data.email || '';
    this.full_name = data.full_name || '';
    this.role = data.role || 'user'; // 'superadmin' | 'user'
    this.created_at = data.created_at || new Date().toISOString();
    this.sso_provider = data.sso_provider || null;
    this.sso_protocol = data.sso_protocol || null;
    this.sso_tenant = data.sso_tenant || null;
  }

  get isSuperadmin() {
    return this.role === 'superadmin';
  }

  get isSsoUser() {
    return !!this.sso_provider;
  }

  get initials() {
    if (!this.full_name) return (this.email?.[0] || 'U').toUpperCase();
    return this.full_name
      .split(' ')
      .map(part => part[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }

  getRoleBadge() {
    const isSuper = this.isSuperadmin;
    return {
      label: isSuper ? 'Superadmin' : 'Operator',
      bg: isSuper ? '#fef3c7' : '#e9f8ef',
      color: isSuper ? '#b45309' : '#168449',
      badgeClass: isSuper
        ? 'bg-amber-50 text-amber-800 border-amber-200'
        : 'bg-sky-50 text-sky-700 border-sky-200'
    };
  }

  getFormattedDate() {
    if (!this.created_at) return '—';
    try {
      return new Date(this.created_at).toLocaleDateString('id-ID');
    } catch {
      return '—';
    }
  }

  static fromJSON(json) {
    return new PlatformUser(json);
  }
}

export default PlatformUser;
