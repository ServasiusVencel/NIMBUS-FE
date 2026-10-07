
export class SystemPreferencesModel {
  constructor({
    notifications = {
      fwiAlert: true,
      tmatAlert: true,
      dailyDigest: true,
      telegramAlert: false
    },
    preferences = {
      temperatureUnit: 'C',
      refreshInterval: 15,
      timezone: 'WIB'
    }
  } = {}) {
    this.notifications = { ...notifications };
    this.preferences = { ...preferences };
  }

  static fromUser(user) {
    if (!user) return new SystemPreferencesModel();
    return new SystemPreferencesModel({
      notifications: user.notifications || {
        fwiAlert: true,
        tmatAlert: true,
        dailyDigest: true,
        telegramAlert: false
      },
      preferences: user.preferences || {
        temperatureUnit: 'C',
        refreshInterval: 15,
        timezone: 'WIB'
      }
    });
  }

  withNotification(key, value) {
    return new SystemPreferencesModel({
      notifications: {
        ...this.notifications,
        [key]: Boolean(value)
      },
      preferences: { ...this.preferences }
    });
  }

  withPreference(key, value) {
    return new SystemPreferencesModel({
      notifications: { ...this.notifications },
      preferences: {
        ...this.preferences,
        [key]: value
      }
    });
  }

  toPayload() {
    return {
      notifications: this.notifications,
      preferences: this.preferences
    };
  }
}

export default SystemPreferencesModel;
