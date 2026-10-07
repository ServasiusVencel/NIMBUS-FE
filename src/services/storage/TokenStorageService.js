/**
 * OOP Service: TokenStorageService
 * Encapsulates client-side token and session persistence in browser storage.
 */
export class TokenStorageService {
  static TOKEN_KEY = 'nimbus_access_token';
  static USER_KEY = 'nimbus_current_user';

  /**
   * Retrieves the current stored Bearer access token
   * @returns {string}
   */
  static getToken() {
    try {
      return localStorage.getItem(TokenStorageService.TOKEN_KEY) || '';
    } catch {
      return '';
    }
  }

  /**
   * Stores or removes Bearer access token
   * @param {string|null} token 
   */
  static setToken(token) {
    try {
      if (token) {
        localStorage.setItem(TokenStorageService.TOKEN_KEY, token);
      } else {
        localStorage.removeItem(TokenStorageService.TOKEN_KEY);
      }
    } catch (err) {
      console.error('[TokenStorageService] Error saving token:', err);
    }
  }

  /**
   * Retrieves the serialized session user
   * @returns {Object|null}
   */
  static getUser() {
    try {
      const raw = localStorage.getItem(TokenStorageService.USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  /**
   * Persists or removes session user
   * @param {Object|null} user 
   */
  static setUser(user) {
    try {
      if (user) {
        localStorage.setItem(TokenStorageService.USER_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(TokenStorageService.USER_KEY);
      }
    } catch (err) {
      console.error('[TokenStorageService] Error saving user:', err);
    }
  }

  /**
   * Clears all session credentials
   */
  static clearSession() {
    TokenStorageService.setToken(null);
    TokenStorageService.setUser(null);
  }
}

export default TokenStorageService;
