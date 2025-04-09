import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import { LRUCache } from 'lru-cache';

const requestCache = new LRUCache<string, any>({
  max: 100,
  ttl: 1000 * 60 * 5,
});

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const pendingRequests = new Map<string, Promise<any>>();

const apiClient: AxiosInstance = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

function generateRequestKey(config: AxiosRequestConfig): string {
  const { method = 'get', url = '', params, data } = config;
  return `${method.toLowerCase()}:${url}:${JSON.stringify(params || {})}:${JSON.stringify(data || {})}`;
}

function getTokensFromStorage() {
  try {
    const tokensStr = localStorage.getItem('auth_tokens');
    return tokensStr ? JSON.parse(tokensStr) : null;
  } catch (error) {
    console.error('Error retrieving tokens from storage:', error);
    return null;
  }
}

function getCsrfToken(): string | null {
  return document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || null;
}

// Simplified cachedGet without changes
apiClient.cachedGet = async <T>(url: string, config: AxiosRequestConfig = {}, cacheTtl?: number): Promise<T> => {
  const apiUrl = url.startsWith('/api/v1/') ? url : `/api/v1/${url}`;
  const requestKey = generateRequestKey({ ...config, url: apiUrl, method: 'get' });

  const cached = requestCache.get(requestKey);
  if (cached) {
    return cached as T;
  }

  if (pendingRequests.has(requestKey)) {
    return (await pendingRequests.get(requestKey)) as T;
  }

  const requestPromise = apiClient.get<T>(apiUrl, config);
  pendingRequests.set(requestKey, requestPromise);

  try {
    const response = await requestPromise;
    requestCache.set(requestKey, response.data, { ttl: cacheTtl || requestCache.ttl });
    return response.data;
  } finally {
    pendingRequests.delete(requestKey);
  }
};

// Request interceptor (simplified token check)
apiClient.interceptors.request.use(
  (config) => {
    // Ensure URL starts with /api/v1/
    if (config.url && !config.url.startsWith('/api/v1/') && !config.url.startsWith('http')) {
      config.url = `/api/v1/${config.url}`;
    }

    // Add CSRF token for non-GET
    if (config.method !== 'get') {
      const csrfToken = getCsrfToken();
      if (csrfToken) {
        config.headers = {
          ...config.headers,
          'X-CSRFToken': csrfToken
        };
      }
    }

    // Simplified token check
    const tokens = getTokensFromStorage();
    if (tokens?.access) {
      config.headers = {
        ...config.headers,
        'Authorization': `Bearer ${tokens.access}`
      };
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor remains unchanged
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;
    if (!originalRequest || originalRequest._retry) {
      return Promise.reject(error);
    }

    const errorResponse = {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
    };

    if (error.response?.status === 401) {
      if (originalRequest.url?.includes('/api/v1/auth/token/refresh/')) {
        localStorage.removeItem('auth_tokens');
        localStorage.removeItem('auth.user');
        return Promise.reject(errorResponse);
      }

      originalRequest._retry = true;

      try {
        const tokens = getTokensFromStorage();
        if (!tokens?.refresh) {
          throw new Error('No refresh token available');
        }

        const response = await apiClient.post('/api/v1/auth/token/refresh/', {
          refresh: tokens.refresh
        });

        if (response.data.access) {
          localStorage.setItem(
            'auth_tokens',
            JSON.stringify({
              access: response.data.access,
              refresh: tokens.refresh
            })
          );
          originalRequest.headers['Authorization'] = `Bearer ${response.data.access}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        localStorage.removeItem('auth_tokens');
        localStorage.removeItem('auth.user');
      }
    }

    return Promise.reject(errorResponse);
  }
);

export default apiClient;
