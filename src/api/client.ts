import axios from 'axios';

// Create axios instance
const apiClient = axios.create({
  baseURL: '/api/v1',
  timeout: 15000, 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Track authentication state
let isAuthenticated = false;

// Request interceptor for authentication
apiClient.interceptors.request.use((config) => {
  const isAuthEndpoint = config.url?.includes('/auth/');
  
  if (isAuthenticated || isAuthEndpoint) {
    config.withCredentials = true;
    
    if (config.method !== 'get') {
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
      if (csrfToken) {
        config.headers['X-CSRFToken'] = csrfToken;
      }
    }
  }
  
  return config;
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (!originalRequest) {
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      return Promise.reject(error);
    }
    
    if (isAuthenticated && error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        await apiClient.post('/auth/token/refresh/');
        return apiClient(originalRequest);
      } catch (refreshError) {
        window.location.href = '/signin';
        return Promise.reject(refreshError);
      }
    }
    
    if (error.response?.status === 403) {
      console.error('Permission denied:', error.response.data);
    }
    
    if (error.response?.status === 500) {
      console.error('Server error:', error.response.data);
    }
    
    return Promise.reject(error);
  }
);

export const updateAuthStatus = (status: boolean) => {
  isAuthenticated = status;
};

export const getAuthStatus = () => isAuthenticated;

export default apiClient;
