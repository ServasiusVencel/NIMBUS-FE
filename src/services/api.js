/**
 * Backward-compatible barrel re-export for ApiService and storage utilities.
 * The implementation is decomposed into modular OOP services in src/services/api/ and src/services/storage/.
 */
import { apiService, ApiService } from './api/ApiService';
import { TokenStorageService } from './storage/TokenStorageService';

export const TOKEN_STORAGE_KEY = TokenStorageService.TOKEN_KEY;
export const USER_STORAGE_KEY = TokenStorageService.USER_KEY;

export const getStoredToken = () => TokenStorageService.getToken();
export const setStoredToken = (token) => TokenStorageService.setToken(token);
export const getStoredUser = () => TokenStorageService.getUser();
export const setStoredUser = (user) => TokenStorageService.setUser(user);

export { apiService, ApiService, TokenStorageService };
export default apiService;
