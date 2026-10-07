import { TokenStorageService } from '../storage/TokenStorageService';

/**
 * OOP HTTP Client: HttpClient
 * Encapsulates fetch requests with timeout aborts, authorization header injection,
 * JSON serialization, and structured error handling.
 */
export class HttpClient {
  constructor({ baseUrl = 'http://localhost:8000', timeoutMs = 6000 } = {}) {
    this.baseUrl = baseUrl;
    this.timeoutMs = timeoutMs;
  }

  async request(endpoint, options = {}) {
    const url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

    const token = TokenStorageService.getToken();
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...(options.headers || {})
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      return response;
    } catch (err) {
      clearTimeout(timeoutId);
      throw err;
    }
  }

  /**
   * Performs GET request and parses JSON
   */
  async get(endpoint, options = {}) {
    const res = await this.request(endpoint, { method: 'GET', ...options });
    return this._handleResponse(res);
  }

  /**
   * Performs POST request with body
   */
  async post(endpoint, body = {}, options = {}) {
    const res = await this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
      ...options
    });
    return this._handleResponse(res);
  }

  /**
   * Performs PUT request with body
   */
  async put(endpoint, body = {}, options = {}) {
    const res = await this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
      ...options
    });
    return this._handleResponse(res);
  }

  /**
   * Helper to parse JSON and surface API errors
   */
  async _handleResponse(res) {
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const message = data.detail || data.message || `HTTP Error ${res.status}`;
      const error = new Error(message);
      error.status = res.status;
      error.data = data;
      throw error;
    }
    return data;
  }
}

export const defaultHttpClient = new HttpClient();
export default HttpClient;
