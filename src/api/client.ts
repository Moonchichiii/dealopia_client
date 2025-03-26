// src/api/client.ts - UPDATE THIS FILE, DON'T CREATE A NEW ONE
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';

// Fix 1: Set baseURL to environment variable without adding /api/v1 (already in proxy)
const baseURL = import.meta.env.VITE_API_URL || '';

// Create the API client
const apiClient: AxiosInstance = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for cookie-based auth
});

// Get CSRF token
function getCsrfToken(): string | null {
  return document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || null;
}

// Request interceptor
apiClient.interceptors.request.use((config: AxiosRequestConfig): AxiosRequestConfig => {
  // Add CSRF token for non-GET requests
  if (config.method !== 'get') {
    const csrfToken = getCsrfToken();
    if (csrfToken) {
      config.headers = {
        ...config.headers,
        'X-CSRFToken': csrfToken
      };
    }
  }

  return config;
});

// Response interceptor for handling 401s
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;
    
    if (!originalRequest || originalRequest._retry) {
      return Promise.reject(error);
    }
    
    // Handle 401 by redirecting to login
    if (error.response?.status === 401) {
      // Could trigger a redirect to login page here if needed
      // window.location.href = '/signin';
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;