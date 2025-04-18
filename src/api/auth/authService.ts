import type { AxiosError, AxiosResponse } from 'axios';
import apiClient from '@/api/client';
import type { UserProfile, LoginCredentials, RegisterData, TwoFactorVerifyParams } from '@/types/auth';
import { AUTH_ENDPOINTS } from './endpoints';

/**
 * Checks if an error is an Axios error.
 */
function isAxiosError(error: unknown): error is AxiosError {
  return typeof error === 'object' && error !== null && 'isAxiosError' in error && error.isAxiosError === true;
}

/**
 * Authentication service for handling user authentication operations.
 */
class AuthService {
  /**
   * Log in a user with email and password.
   */
  async login(credentials: LoginCredentials): Promise<UserProfile> {
    try {
      const response = await apiClient.post<UserProfile>(AUTH_ENDPOINTS.LOGIN, credentials);
      return response.data;
    } catch (error: unknown) {
      throw new Error(this.formatErrorMessage(error));
    }
  }

  /**
   * Get the current user's profile.
   */
  async getProfile(): Promise<UserProfile> {
    try {
      const response = await apiClient.get<UserProfile>(AUTH_ENDPOINTS.ME);
      return response.data;
    } catch (error: unknown) {
      throw new Error(this.formatErrorMessage(error));
    }
  }

  /**
   * Register a new user.
   */
  async register(userData: RegisterData): Promise<UserProfile> {
    try {
      const response = await apiClient.post<UserProfile>(AUTH_ENDPOINTS.REGISTER, userData);
      return response.data;
    } catch (error: unknown) {
      throw new Error(this.formatErrorMessage(error));
    }
  }

  /**
   * Log out the current user.
   * Makes a request to the backend to invalidate the session and clear HttpOnly cookies.
   * Forces a page reload to ensure browser updates its cookie state.
   */
  async logout(): Promise<void> {
    try {
      console.log('Starting logout process - cookies before:', document.cookie);
      
      // Add withCredentials explicitly to ensure cookies are sent
      const response = await apiClient.post(AUTH_ENDPOINTS.LOGOUT, {}, {
        withCredentials: true
      });
      
      console.log('Logout response received:', response);
      console.log('Cookies after server response:', document.cookie);
      
      // Clear client-side storage
      localStorage.clear();
      sessionStorage.clear();
      
      // Force a complete page reload
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
      // Still redirect
      window.location.href = '/';
    }
  }

  /**
   * Verify a two-factor authentication token.
   */
  async verifyTwoFactor(params: TwoFactorVerifyParams): Promise<{ verified: boolean }> {
    try {
      const response = await apiClient.post<{ verified: boolean }>(
        AUTH_ENDPOINTS.VERIFY_2FA, 
        { token: params.token }
      );
      return response.data;
    } catch (error: unknown) {
      throw new Error(this.formatErrorMessage(error));
    }
  }

  /**
   * Refresh the authentication token.
   */
  async refreshToken(): Promise<void> {
    try {
      await apiClient.post(AUTH_ENDPOINTS.REFRESH_TOKEN);
    } catch (error: unknown) {
      const errorMessage = this.formatErrorMessage(error);
      console.error('Token refresh failed:', errorMessage);
      throw new Error(errorMessage);
    }
  }

  /**
   * Get CSRF token for non-GET requests.
   */
  getToken(): string {
    const metaToken = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content;
    return metaToken || this.getCookie('csrftoken') || '';
  }

  /**
   * Clear browser storage (localStorage and sessionStorage).
   */
  private clearBrowserStorage(): void {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (error) {
      console.error("Error clearing browser storage:", error);
    }
  }

  /**
   * Get a cookie by name.
   */
  private getCookie(name: string): string {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1, c.length);
      }
      if (c.indexOf(nameEQ) === 0) {
        return decodeURIComponent(c.substring(nameEQ.length, c.length));
      }
    }
    return '';
  }

  /**
   * Format error messages from API responses.
   */
  private formatErrorMessage(error: unknown): string {
    if (isAxiosError(error)) {
      const response = error.response as AxiosResponse | undefined;
      
      if (response?.data) {
        const { data } = response;
        
        // Handle string error response
        if (typeof data === 'string' && data.trim()) {
          return data.trim();
        }
        
        // Handle object error response
        if (typeof data === 'object' && data !== null) {
          // Try common error fields
          if (typeof data.detail === 'string' && data.detail.trim()) {
            return data.detail.trim();
          }
          
          if (Array.isArray(data.non_field_errors) && data.non_field_errors.length > 0) {
            return data.non_field_errors.map(String).join(', ');
          }
          
          if (typeof data.error === 'string' && data.error.trim()) {
            return data.error.trim();
          }
          
          if (typeof data.message === 'string' && data.message.trim()) {
            return data.message.trim();
          }
          
          // Try field-specific errors
          const fieldErrors = this.formatFieldErrors(data);
          if (fieldErrors) {
            return fieldErrors;
          }
        }
        
        // If we reach here, use status text or code
        if (response.statusText) {
          return `Request failed: ${response.status} ${response.statusText}`;
        }
        
        return `An error occurred (Status: ${response.status}). Please try again.`;
      }
      
      // Handle network errors
      if (error.request) {
        return 'No response received from server. Check network connection or server status.';
      }
      
      // Handle other axios errors
      return error.message || 'Error sending request.';
    }
    
    // Handle non-axios errors
    if (error instanceof Error) {
      return error.message;
    }
    
    if (typeof error === 'string' && error.trim()) {
      return error.trim();
    }
    
    return 'An unexpected error occurred. Please try again.';
  }

  /**
   * Format field-specific errors into a readable string.
   */
  private formatFieldErrors(data: Record<string, unknown>): string {
    const excludedKeys = new Set(['status', 'code', 'detail', 'non_field_errors', 'error', 'message']);
    
    return Object.entries(data)
      .filter(([key]) => !excludedKeys.has(key))
      .map(([field, errors]) => {
        const errorText = Array.isArray(errors) ? errors.join(', ') : String(errors);
        const formattedField = field.charAt(0).toUpperCase() + field.slice(1).replace(/_/g, ' ');
        return `${formattedField}: ${errorText}`;
      })
      .join('; ');
  }
}

export default new AuthService();