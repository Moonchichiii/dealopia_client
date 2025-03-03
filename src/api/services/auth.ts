import apiClient from '../client';
import { UserProfile, LoginCredentials, RegisterData } from '@types/auth';

/**
 * Auth API service for authentication operations
 */
export const authApi = {
  /**
   * Login with email/username and password
   */
  login: async (credentials: LoginCredentials) => {
    const { data } = await apiClient.post('/auth/login/', credentials);
    return data;
  },

  /**
   * Register a new user
   */
  register: async (userData: RegisterData) => {
    const { data } = await apiClient.post('/auth/registration/', userData);
    return data;
  },

  /**
   * Get current user profile
   */
  getProfile: async (): Promise<UserProfile> => {
    const { data } = await apiClient.get('/auth/me/');
    return data;
  },

  /**
   * Update user profile
   */
  updateProfile: async (profileData: Partial<UserProfile>) => {
    const { data } = await apiClient.patch('/users/update_profile/', profileData);
    return data;
  },

  /**
   * Request password reset
   */
  requestPasswordReset: async (email: string) => {
    const { data } = await apiClient.post('/auth/password/reset/', { email });
    return data;
  },

  /**
   * Confirm password reset
   */
  confirmPasswordReset: async (uid: string, token: string, newPassword: string) => {
    const { data } = await apiClient.post('/auth/password/reset/confirm/', {
      uid,
      token,
      new_password1: newPassword,
      new_password2: newPassword,
    });
    return data;
  },

  /**
   * Verify email address
   */
  verifyEmail: async (key: string) => {
    const { data } = await apiClient.post('/auth/registration/verify-email/', { key });
    return data;
  },

  /**
   * Logout user (invalidate token)
   */
  logout: async () => {
    const { data } = await apiClient.post('/auth/logout/');
    return data;
  },
};