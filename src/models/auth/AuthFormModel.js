import { EnterpriseAuthManager } from '../../services/EnterpriseAuthManager';

export class AuthFormModel {
  constructor({
    mode = 'login', // 'login' | 'register'
    email = 'operator@nimbus.earth',
    password = 'Password123!',
    fullName = '',
    role = 'user', // 'user' | 'superadmin'
    rememberMe = true,
    showPassword = false,
  } = {}) {
    this.mode = mode;
    this.email = email;
    this.password = password;
    this.fullName = fullName;
    this.role = role;
    this.rememberMe = rememberMe;
    this.showPassword = showPassword;
  }

  // Domain Queries
  get isLogin() {
    return this.mode === 'login';
  }

  get isRegister() {
    return this.mode === 'register';
  }

  get title() {
    return this.isLogin ? 'Selamat Datang' : 'Buat Akun Nimbus';
  }

  get subtitle() {
    return this.isLogin
      ? 'Masuk ke platform inteligensi telemetri Anda.'
      : 'Aktivasi akun pengguna atau administrator seketika.';
  }

  get submitText() {
    return this.isLogin ? 'Masuk ke Platform' : 'Buat Akun & Aktivasi';
  }

  get passwordStrength() {
    return EnterpriseAuthManager.evaluatePasswordStrength(this.password);
  }

  get parsedDomain() {
    return EnterpriseAuthManager.parseEmailDomain(this.email);
  }

  // Validation
  validate() {
    if (!this.email || !this.email.trim()) {
      return { isValid: false, error: 'Alamat email wajib diisi.' };
    }
    if (!this.email.includes('@') || !this.email.includes('.')) {
      return { isValid: false, error: 'Format alamat email tidak valid.' };
    }
    if (!this.password || !this.password.trim()) {
      return { isValid: false, error: 'Kata sandi wajib diisi.' };
    }
    if (this.isRegister) {
      if (this.password.length < 6) {
        return { isValid: false, error: 'Kata sandi minimal harus 6 karakter.' };
      }
      if (!this.fullName || !this.fullName.trim()) {
        return { isValid: false, error: 'Nama lengkap wajib diisi untuk pendaftaran.' };
      }
    }
    return { isValid: true };
  }

  // Payloads for API & Context
  toLoginPayload() {
    return {
      email: this.email.trim().toLowerCase(),
      password: this.password,
      rememberMe: this.rememberMe,
    };
  }

  toRegisterPayload() {
    return {
      email: this.email.trim().toLowerCase(),
      password: this.password,
      role: this.role,
      full_name: this.fullName.trim() || this.email.split('@')[0],
    };
  }

  // Immutable Factory Mutations
  withField(fieldName, value) {
    return new AuthFormModel({
      ...this,
      [fieldName]: value,
    });
  }

  withMode(newMode) {
    return new AuthFormModel({
      ...this,
      mode: newMode,
    });
  }

  withDemoProfile(profile) {
    return new AuthFormModel({
      ...this,
      email: profile.email,
      password: profile.password,
      mode: 'login',
    });
  }

  toggleShowPassword() {
    return new AuthFormModel({
      ...this,
      showPassword: !this.showPassword,
    });
  }

  static createDefault() {
    return new AuthFormModel();
  }
}

export default AuthFormModel;
