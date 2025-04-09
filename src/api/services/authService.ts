import apiClient from '@/api/client';
import { UserProfile, LoginCredentials, RegisterData } from '@/types';


const AUTH_ENDPOINTS = {
  LOGIN: '/api/v1/auth/login/',
  REGISTER: '/api/v1/auth/registration/',
  LOGOUT: '/api/v1/auth/logout/',
  ME: '/api/v1/auth/me/',
  UPDATE_PROFILE: '/api/v1/users/update_profile/',
  VERIFY_EMAIL: '/api/v1/auth/registration/verify-email/',
  REFRESH_TOKEN: '/api/v1/auth/token/refresh/',
  VERIFY_TOKEN: '/api/v1/auth/token/verify/',
  PASSWORD_RESET: '/api/v1/auth/password/reset/',
  PASSWORD_RESET_CONFIRM: '/api/v1/auth/password/reset/confirm/',
  PASSWORD_CHANGE: '/api/v1/auth/password/change/',
  TWO_FACTOR_VERIFY: '/api/v1/auth/2fa/verify/',
  TWO_FACTOR_SETUP: '/api/v1/auth/2fa/setup/',
  TWO_FACTOR_DISABLE: '/api/v1/auth/2fa/disable/',
  SOCIAL_LOGIN: '/api/v1/auth/social-login/',
};

const TOKEN_STORAGE_KEY = 'auth_tokens';
const USER_STORAGE_KEY = 'auth.user';

export interface SocialLoginParams {
  provider: 'google' | 'facebook' | 'github';
  token?: string;
  code?: string;
}

export interface Tokens {
  access: string;
  refresh: string;
}

class AuthService {
  public getTokensFromStorage(): Tokens | null {
    try {
      const tokensStr = localStorage.getItem(TOKEN_STORAGE_KEY);
      return tokensStr ? JSON.parse(tokensStr) : null;
    } catch (error) {
      console.error('Error retrieving tokens from storage:', error);
      return null;
    }
  }

  public saveTokensToStorage(tokens: Tokens): void {
    localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(tokens));
  }

  public saveUserToStorage(user: UserProfile): void {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  }

  public getUserFromStorage(): UserProfile | null {
    const userJson = localStorage.getItem(USER_STORAGE_KEY);
    return userJson ? JSON.parse(userJson) : null;
  }

  public clearAuthData(): void {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
  }

  public isAuthenticated(): boolean {
    const tokens = this.getTokensFromStorage();
    return !!tokens?.access;
  }

  public async login(credentials: LoginCredentials): Promise<unknown> {
    console.log('Login credentials being sent to API:', credentials);
    const response = await apiClient.post(AUTH_ENDPOINTS.LOGIN, credentials);
    if (response.data.access && response.data.refresh) {
      this.saveTokensToStorage({
        access: response.data.access,
        refresh: response.data.refresh,
      });
    }
    return response.data;
  }

  public async socialLogin(params: SocialLoginParams): Promise<unknown> {
    console.log('Social login params being sent to API:', params);
    const response = await apiClient.post(AUTH_ENDPOINTS.SOCIAL_LOGIN, params);
    if (response.data.access && response.data.refresh) {
      this.saveTokensToStorage({
        access: response.data.access,
        refresh: response.data.refresh,
      });
    }
    return response.data;
  }

  public async register(userData: RegisterData): Promise<unknown> {
    console.log('Register data being sent to API:', userData);
    const response = await apiClient.post(AUTH_ENDPOINTS.REGISTER, userData);
    if (response.data.access && response.data.refresh) {
      this.saveTokensToStorage({
        access: response.data.access,
        refresh: response.data.refresh,
      });
    }
    return response.data;
  }

  public async logout(): Promise<void> {
    const tokens = this.getTokensFromStorage();
    try {
      await apiClient.post(
        AUTH_ENDPOINTS.LOGOUT,
        {},
        {
          withCredentials: true,
          headers: tokens?.access
            ? { Authorization: `Bearer ${tokens.access}` }
            : undefined,
        }
      );
    } catch (error: unknown) {
      console.error('Server logout failed:', error);
    } finally {
      this.clearAuthData();
    }
  }

  public async verifyTwoFactor(userId: string, token: string): Promise<unknown> {
    const response = await apiClient.post(AUTH_ENDPOINTS.TWO_FACTOR_VERIFY, {
      user_id: userId,
      token,
    });
    if (response.data.access && response.data.refresh) {
      this.saveTokensToStorage({
        access: response.data.access,
        refresh: response.data.refresh,
      });
    }
    return response.data;
  }

  public async refreshToken(): Promise<unknown> {
    const tokens = this.getTokensFromStorage();
    if (!tokens?.refresh) {
      throw new Error('No refresh token available');
    }
    const response = await apiClient.post(AUTH_ENDPOINTS.REFRESH_TOKEN, {
      refresh: tokens.refresh,
    });
    if (response.data.access) {
      this.saveTokensToStorage({
        access: response.data.access,
        refresh: tokens.refresh,
      });
    }
    return response.data;
  }

  public async getProfile(): Promise<UserProfile> {
    const response = await apiClient.get(AUTH_ENDPOINTS.ME);
    if (response.data) {
      this.saveUserToStorage(response.data);
    }
    return response.data;
  }

  public async updateProfile(profileData: Partial<UserProfile>): Promise<UserProfile> {
    const response = await apiClient.patch(AUTH_ENDPOINTS.UPDATE_PROFILE, profileData);
    if (response.data) {
      const currentUser = this.getUserFromStorage();
      this.saveUserToStorage({ ...currentUser, ...response.data });
    }
    return response.data;
  }

  public async verifyEmail(key: string): Promise<unknown> {
    const response = await apiClient.post(AUTH_ENDPOINTS.VERIFY_EMAIL, { key });
    return response.data;
  }

  public async verifyToken(token: string): Promise<boolean> {
    try {
      const response = await apiClient.post(AUTH_ENDPOINTS.VERIFY_TOKEN, { token });
      return !!response.data;
    } catch {
      return false;
    }
  }

  public async requestPasswordReset(email: string): Promise<void> {
    await apiClient.post(AUTH_ENDPOINTS.PASSWORD_RESET, { email });
  }

  public async resetPassword(
    token: string,
    password: string,
    password_confirm: string
  ): Promise<void> {
    await apiClient.post(AUTH_ENDPOINTS.PASSWORD_RESET_CONFIRM, {
      token,
      new_password1: password,
      new_password2: password_confirm,
    });
  }

  public async changePassword(
    currentPassword: string,
    newPassword: string,
    newPasswordConfirm: string
  ): Promise<void> {
    await apiClient.post(AUTH_ENDPOINTS.PASSWORD_CHANGE, {
      current_password: currentPassword,
      new_password1: newPassword,
      new_password2: newPasswordConfirm,
    });
  }

  public async setupTwoFactor(): Promise<unknown> {
    const response = await apiClient.get(AUTH_ENDPOINTS.TWO_FACTOR_SETUP);
    return response.data;
  }

  public async confirmTwoFactorSetup(token: string): Promise<unknown> {
    const response = await apiClient.post(AUTH_ENDPOINTS.TWO_FACTOR_SETUP, { token });
    return response.data;
  }

  public async disableTwoFactor(password: string): Promise<unknown> {
    const response = await apiClient.post(AUTH_ENDPOINTS.TWO_FACTOR_DISABLE, { password });
    return response.data;
  }
}

const authService = new AuthService();
export { authService };
export default authService;
