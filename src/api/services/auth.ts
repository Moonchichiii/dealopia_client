import apiClient from '../client';
import { LoginCredentials, RegisterData, UserProfile, AuthTokens } from '@/types/auth';

/**
 * Service for authentication-related API calls
 */
export const authApi = {
  /**
   * Login with email and password
   */
  async login(credentials: LoginCredentials): Promise<void> {
    const response = await apiClient.post('/auth/login/', credentials);
    return response.data;
  },

  /**
   * Register a new user
   */
  async register(userData: RegisterData): Promise<void> {
    const response = await apiClient.post('/auth/registration/', userData);
    return response.data;
  },

  /**
   * Log out the current user
   */
  async logout(): Promise<void> {
    await apiClient.post('/auth/logout/');
  },

  /**
   * Get the current user's profile
   */
  async getProfile(): Promise<UserProfile> {
    const response = await apiClient.get('/auth/me/');
    return response.data;
  },

  /**
   * Update the current user's profile
   */
  async updateProfile(profileData: Partial<UserProfile>): Promise<UserProfile> {
    const response = await apiClient.patch('/auth/me/', profileData);
    return response.data;
  },

  /**
   * Verify email with confirmation key
   */
  async verifyEmail(key: string): Promise<void> {
    await apiClient.post('/auth/registration/verify-email/', { key });
  },

  /**
   * Request password reset
   */
  async requestPasswordReset(email: string): Promise<void> {
    await apiClient.post('/auth/password/reset/', { email });
  },

  /**
   * Confirm password reset with token
   */
  async confirmPasswordReset(uid: string, token: string, new_password1: string, new_password2: string): Promise<void> {
    await apiClient.post('/auth/password/reset/confirm/', {
      uid,
      token,
      new_password1,
      new_password2
    });
  },

  /**
   * Refresh the authentication token
   */
  async refreshToken(refresh: string): Promise<AuthTokens> {
    const response = await apiClient.post('/auth/token/refresh/', { refresh });
    return response.data;
  }
};