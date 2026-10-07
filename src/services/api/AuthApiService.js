import { defaultHttpClient } from '../http/HttpClient';
import { TokenStorageService } from '../storage/TokenStorageService';

/**
 * OOP Service: AuthApiService
 * Manages user authentication, registration, token persistence, and profile verification.
 */
export class AuthApiService {
  constructor(httpClient = defaultHttpClient) {
    this.http = httpClient;
  }

  async login(email, password) {
    const res = await this.http.request('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      const errorMsg = data.detail || data.message || 'Login failed. Please check your credentials.';
      throw new Error(errorMsg);
    }

    if (data.access_token) {
      TokenStorageService.setToken(data.access_token);
      if (data.user) {
        TokenStorageService.setUser(data.user);
      }
    }
    return data;
  }

  async register({ email, password, role = 'user', full_name = '' }) {
    const res = await this.http.request('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, role, full_name }),
    });

    const data = await res.json();
    if (!res.ok) {
      const errorMsg = data.detail || data.message || 'Registration failed.';
      throw new Error(errorMsg);
    }
    return data;
  }

  async logout() {
    try {
      await this.http.request('/api/v1/auth/logout', { method: 'POST' });
    } catch (err) {
      console.warn('[AuthApiService] Logout call warning:', err.message);
    } finally {
      TokenStorageService.clearSession();
    }
    return { success: true };
  }

  async getMe() {
    try {
      const res = await this.http.request('/api/v1/auth/me');
      if (res.ok) {
        const data = await res.json();
        TokenStorageService.setUser(data);
        return { success: true, user: data };
      }
      throw new Error(`Status ${res.status}`);
    } catch (err) {
      return { success: false, error: err.message };
    }
  }
}

export const defaultAuthApiService = new AuthApiService();
export default AuthApiService;
