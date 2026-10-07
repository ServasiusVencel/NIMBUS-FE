
export class UserProfileModel {
  constructor({
    fullName = '',
    email = '',
    phone = '',
    title = '',
    department = '',
    bio = '',
    role = 'user'
  } = {}) {
    this.fullName = fullName;
    this.email = email;
    this.phone = phone;
    this.title = title;
    this.department = department;
    this.bio = bio;
    this.role = role;
  }

  /**
   * Factory method creating domain instance from authenticated user object
   */
  static fromUser(user) {
    if (!user) return new UserProfileModel();
    return new UserProfileModel({
      fullName: user.full_name || '',
      email: user.email || '',
      phone: user.phone || '+62 812-9876-5432',
      title: user.title || (user.role === 'superadmin' ? 'Chief Technology & Environmental Intelligence' : 'Senior Field Hydrologist'),
      department: user.department || (user.role === 'superadmin' ? 'Executive Platform Engineering' : 'Peatland Hydrology Unit'),
      bio: user.bio || 'Bertanggung jawab atas pemantauan telemetri real-time, kalibrasi piezometer gambut, dan mitigasi karhutla.',
      role: user.role || 'user'
    });
  }

  /**
   * Immutable mutation returning new instance with modified field
   */
  withField(field, value) {
    return new UserProfileModel({
      ...this,
      [field]: value
    });
  }

  /**
   * Domain validation
   */
  validate() {
    if (!this.fullName || this.fullName.trim().length < 2) {
      return { isValid: false, error: 'Nama lengkap minimal harus 2 karakter.' };
    }
    if (!this.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email.trim())) {
      return { isValid: false, error: 'Format alamat email tidak valid.' };
    }
    return { isValid: true, error: null };
  }

  /**
   * Serialize to API payload
   */
  toPayload() {
    return {
      fullName: this.fullName.trim(),
      email: this.email.trim(),
      phone: this.phone.trim(),
      title: this.title.trim(),
      department: this.department.trim(),
      bio: this.bio.trim()
    };
  }

  /**
   * Avatar Initials Getter
   */
  get initials() {
    if (!this.fullName) return 'U';
    const parts = this.fullName.trim().split(/\s+/);
    return parts.length >= 2
      ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
      : this.fullName.substring(0, 2).toUpperCase();
  }

  get isSuperadmin() {
    return this.role === 'superadmin';
  }
}

export default UserProfileModel;
