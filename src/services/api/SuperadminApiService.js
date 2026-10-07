import { defaultHttpClient } from '../http/HttpClient';

export class SuperadminApiService {
  constructor(httpClient = defaultHttpClient) {
    this.http = httpClient;
  }

  async getSuperadminUsers() {
    const res = await this.http.request('/api/v1/superadmin/users');
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.detail || 'Access denied or error fetching users');
    }
    return data;
  }

  async updateSuperadminUser(userId, updateData) {
    const res = await this.http.request(`/api/v1/superadmin/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.detail || 'Failed to update user');
    }
    return data;
  }

  async deleteSuperadminUser(userId) {
    const res = await this.http.request(`/api/v1/superadmin/users/${userId}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.detail || 'Failed to delete user');
    }
    return data;
  }
}

export const defaultSuperadminApiService = new SuperadminApiService();
export default SuperadminApiService;
