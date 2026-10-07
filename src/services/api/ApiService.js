import { defaultAuthApiService } from './AuthApiService';
import { defaultSuperadminApiService } from './SuperadminApiService';
import { defaultAiEngineApiService } from './AiEngineApiService';
import { defaultSystemApiService } from './SystemApiService';

export class ApiService {
  constructor({
    auth = defaultAuthApiService,
    superadmin = defaultSuperadminApiService,
    ai = defaultAiEngineApiService,
    system = defaultSystemApiService
  } = {}) {
    this.auth = auth;
    this.superadmin = superadmin;
    this.ai = ai;
    this.system = system;
  }

  // System
  checkHealth() {
    return this.system.checkHealth();
  }

  // Auth
  login(email, password) {
    return this.auth.login(email, password);
  }

  register(userData) {
    return this.auth.register(userData);
  }

  logout() {
    return this.auth.logout();
  }

  getMe() {
    return this.auth.getMe();
  }

  // Superadmin
  getSuperadminUsers() {
    return this.superadmin.getSuperadminUsers();
  }

  updateSuperadminUser(userId, data) {
    return this.superadmin.updateSuperadminUser(userId, data);
  }

  deleteSuperadminUser(userId) {
    return this.superadmin.deleteSuperadminUser(userId);
  }

  // AI & Analytics
  predictRealtime(payload) {
    return this.ai.predictRealtime(payload);
  }

  get10DayForecast(payload) {
    return this.ai.get10DayForecast(payload);
  }

  calculatePseudoFWI(payload) {
    return this.ai.calculatePseudoFWI(payload);
  }

  getHistoricalAnalysis(days) {
    return this.ai.getHistoricalAnalysis(days);
  }

  getModelMetrics() {
    return this.ai.getModelMetrics();
  }

  triggerRetrain() {
    return this.ai.triggerRetrain();
  }

  getSchedulerStatus() {
    return this.ai.getSchedulerStatus();
  }
}

export const apiService = new ApiService();
export default apiService;
