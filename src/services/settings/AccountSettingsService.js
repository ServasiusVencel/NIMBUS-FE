/**
 * OOP Domain Service: AccountSettingsService
 * Orchestrates user profile updates, password rotations, and telemetry preference persistence.
 */
export class AccountSettingsService {
  /**
   * Persist Profile mutations with domain validation
   */
  static async saveProfile(profileModel, updateProfileFn) {
    const validation = profileModel.validate();
    if (!validation.isValid) {
      throw new Error(validation.error);
    }
    return await updateProfileFn(profileModel.toPayload());
  }

  /**
   * Execute password change with domain validation
   */
  static async changePassword(securityModel, changePasswordFn) {
    const validation = securityModel.validate();
    if (!validation.isValid) {
      throw new Error(validation.error);
    }
    return await changePasswordFn(securityModel.toPayload());
  }

  /**
   * Persist Telemetry & Notification preferences
   */
  static async savePreferences(preferencesModel, updateProfileFn) {
    return await updateProfileFn(preferencesModel.toPayload());
  }

  /**
   * Diagnostic session metadata helper
   */
  static getSessionMetadata() {
    return {
      clientPlatform: 'Web Browser · Windows 64-bit',
      authProtocol: 'Bearer Token (HMAC-SHA256) · SAML 2.0 Ready',
      ipAddress: '127.0.0.1 (Local Intranet)',
      sessionStatus: 'Active & Verified',
      connectedNode: 'Nimbus Telemetry Gateway (JKT-DC01)'
    };
  }
}

export default AccountSettingsService;
