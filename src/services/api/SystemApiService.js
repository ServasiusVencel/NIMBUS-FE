import { defaultHttpClient } from '../http/HttpClient';

export class SystemApiService {
  constructor(httpClient = defaultHttpClient) {
    this.http = httpClient;
  }

  async checkHealth() {
    try {
      const res = await this.http.request('/health');
      if (res.ok) {
        const data = await res.json();
        return { isLive: true, data };
      }
      return { isLive: false, error: 'Non-200 response' };
    } catch (error) {
      return { isLive: false, error: error.message };
    }
  }
}

export const defaultSystemApiService = new SystemApiService();
export default SystemApiService;
