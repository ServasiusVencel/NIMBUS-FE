
export class SecuritySettingsModel {
  constructor({
    currentPassword = '',
    newPassword = '',
    confirmPassword = '',
    showCurrent = false,
    showNew = false,
    showConfirm = false
  } = {}) {
    this.currentPassword = currentPassword;
    this.newPassword = newPassword;
    this.confirmPassword = confirmPassword;
    this.showCurrent = showCurrent;
    this.showNew = showNew;
    this.showConfirm = showConfirm;
  }

  static createDefault() {
    return new SecuritySettingsModel();
  }

  withField(field, value) {
    return new SecuritySettingsModel({
      ...this,
      [field]: value
    });
  }

  toggleVisibility(target) {
    const key = `show${target.charAt(0).toUpperCase() + target.slice(1)}`;
    return new SecuritySettingsModel({
      ...this,
      [key]: !this[key]
    });
  }

  reset() {
    return new SecuritySettingsModel();
  }

  get passwordStrength() {
    const pwd = this.newPassword || '';
    if (!pwd) return { score: 0, label: 'Kosong', color: 'bg-slate-200', textClass: 'text-slate-400' };

    let score = 0;
    if (pwd.length >= 6) score += 1;
    if (pwd.length >= 10) score += 1;
    if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score <= 2) {
      return { score: 1, label: 'Lemah', color: 'bg-rose-500', textClass: 'text-rose-600', width: '30%' };
    }
    if (score <= 3) {
      return { score: 2, label: 'Sedang', color: 'bg-amber-500', textClass: 'text-amber-600', width: '65%' };
    }
    return { score: 3, label: 'Sangat Kuat', color: 'bg-emerald-500', textClass: 'text-emerald-600', width: '100%' };
  }

  validate() {
    if (!this.newPassword || this.newPassword.length < 6) {
      return { isValid: false, error: 'Kata sandi baru minimal harus 6 karakter.' };
    }
    if (this.newPassword !== this.confirmPassword) {
      return { isValid: false, error: 'Konfirmasi kata sandi baru tidak sesuai.' };
    }
    return { isValid: true, error: null };
  }

  toPayload() {
    return {
      currentPassword: this.currentPassword,
      newPassword: this.newPassword,
      confirmPassword: this.confirmPassword
    };
  }
}

export default SecuritySettingsModel;
