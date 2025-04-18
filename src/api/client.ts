import axios from 'axios';
import type { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { AUTH_ENDPOINTS } from '@/api/auth/endpoints';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Create a flag to disable token refresh during logout
let shouldRefreshToken = true;

const apiClient = axios.create({
  baseURL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// Public method to disable token refresh (can be called in logout)
apiClient.disableTokenRefresh = () => {
  shouldRefreshToken = false;
};

// Public method to re-enable token refresh
apiClient.enableTokenRefresh = () => {
  shouldRefreshToken = true;
};

// Request interceptor: prepend API prefix and add CSRF token for non-GET requests.
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Ensure headers object exists
    config.headers = config.headers ?? {};
    
    // Add API prefix if needed
    if (config.url && !config.url.startsWith('http') && !config.url.startsWith('/api/v1/')) {
      config.url = `/api/v1/${config.url}`;
    }

    // Add CSRF token for non-GET requests
    if (config.method !== 'get') {
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
      if (csrfToken) {
        config.headers['X-CSRFToken'] = csrfToken;
      }
    }
    
    return config;
  },
  (error: any) => Promise.reject(error)
);

let isRefreshing = false;
let refreshPromise: Promise<void> | null = null;
let refreshSubscribers: Array<() => void> = [];

function onRefreshComplete(): void {
  refreshSubscribers.forEach(callback => callback());
  refreshSubscribers = [];
}

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // If config missing or already retried, reject
    if (!originalRequest || originalRequest._retry) {
      return Promise.reject(error);
    }

    // Only handle 401 errors when token refresh is enabled
    if (error.response?.status === 401 && shouldRefreshToken) {
      const url = originalRequest.url || '';
      
      // Do not attempt a refresh if this is the refresh endpoint itself or login
      if (url.includes(AUTH_ENDPOINTS.REFRESH_TOKEN) || 
          url.includes(AUTH_ENDPOINTS.LOGIN) || 
          url.includes(AUTH_ENDPOINTS.LOGOUT)) {
        console.error('Auth request failed with 401.');
        return Promise.reject(error);
      }

      originalRequest._retry = true; // Mark request as retried

      if (!isRefreshing) {
        isRefreshing = true;
        refreshPromise = new Promise(async (resolve, reject) => {
          try {
            console.log('Attempting token refresh...');
            
            // Only proceed if token refresh is still enabled
            if (!shouldRefreshToken) {
              throw new Error('Token refresh disabled');
            }
            
            await apiClient.post(AUTH_ENDPOINTS.REFRESH_TOKEN);
            console.log('Token refresh successful.');
            onRefreshComplete();
            resolve();
          } catch (refreshError: unknown) {
            console.error('Token refresh failed:', refreshError);
            refreshSubscribers = [];
            
            // Dispatch auth:logout event on refresh failure
            window.dispatchEvent(new CustomEvent('auth:token-refresh-failed'));
            
            reject(refreshError);
          } finally {
            isRefreshing = false;
            refreshPromise = null;
          }
        });

        return refreshPromise
          .then(() => apiClient(originalRequest))
          .catch(() => Promise.reject(error));
      } else {
        // If already refreshing, queue this request
        return new Promise(resolve => {
          refreshSubscribers.push(() => {
            resolve(apiClient(originalRequest));
          });
        });
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;