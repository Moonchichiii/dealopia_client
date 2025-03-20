import axios from 'axios';

// Auth state management
let isRefreshing = false;
let failedQueue = [];
let isAuthenticated = false;

/**
 * Process the queue of failed requests after token refresh
 * @param {Error|null} error - Error if token refresh failed
 */
const processQueue = (error = null) => {
  failedQueue.forEach(promise => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve();
    }
  });
  
  failedQueue = [];
};

/**
 * Check if the user has an auth token cookie
 * @returns {boolean} Whether the user is authenticated
 */
const checkAuthStatus = () => {
  const cookies = document.cookie.split(';');
  const hasAuthCookie = cookies.some(cookie => 
    cookie.trim().startsWith('auth-token=')
  );
  isAuthenticated = hasAuthCookie;
  return hasAuthCookie;
};

/**
 * Main API client instance for the Dealopia backend
 */
const apiClient = axios.create({
  baseURL: '/api/v1',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Crucial for sending cookies with requests
});

/**
 * Request interceptor
 * - Skip auth endpoints if not authenticated
 * - Add request ID for debugging
 */
apiClient.interceptors.request.use(
  (config) => {
    // Add a unique request ID for debugging
    config.headers['X-Request-ID'] = `req_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;

    // Skip certain auth endpoints if not authenticated to avoid unnecessary requests
    if (!isAuthenticated && config.url !== '/auth/login/' && 
        (config.url === '/auth/me/' || config.url === '/auth/token/refresh/')) {
      const source = axios.CancelToken.source();
      config.cancelToken = source.token;
      source.cancel('Authentication required');
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response interceptor
 * - Handle 401 errors with token refresh
 * - Update authentication state
 */
apiClient.interceptors.response.use(
  (response) => {
    // Update authentication state on successful auth requests
    if (response.config.url.includes('/auth/login/') || 
        response.config.url.includes('/auth/registration/')) {
      isAuthenticated = true;
    } else if (response.config.url.includes('/auth/logout/')) {
      isAuthenticated = false;
    } else if (response.config.url === '/auth/me/') {
      isAuthenticated = true;
    }
    
    return response;
  },
  async (error) => {
    // Handle request cancellation
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }
    
    const originalRequest = error.config;
    
    // Only attempt to refresh token for 401 errors on endpoints that require auth
    // Skip if we're already trying to refresh or it's a refresh request itself
    if (error.response?.status === 401 && 
        !originalRequest._retry && 
        originalRequest.url !== '/auth/token/refresh/' &&
        originalRequest.url !== '/auth/login/' &&
        originalRequest.url !== '/auth/registration/') {
      
      // Mark this request as having been retried
      originalRequest._retry = true;
      
      // If a token refresh is already in progress, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => apiClient(originalRequest))
          .catch(err => Promise.reject(err));
      }
      
      // Start the refresh token process
      isRefreshing = true;
      
      try {
        // Attempt to refresh token
        await axios.post('/api/v1/auth/token/refresh/', {}, {
          withCredentials: true
        });
        
        // Refresh succeeded
        isAuthenticated = true;
        isRefreshing = false;
        
        // Process queued requests
        processQueue();
        
        // Retry the original request
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed
        isAuthenticated = false;
        isRefreshing = false;
        
        // Process queued requests with the error
        processQueue(refreshError);
        
        // Handle expired session
        if (refreshError.response?.status === 401 || refreshError.response?.status === 403) {
          console.log('Session expired. Please log in again.');
          
          // Dispatch a custom event that can be listened for by auth components
          window.dispatchEvent(new CustomEvent('auth:sessionExpired'));
        }
        
        return Promise.reject(refreshError);
      }
    }
    
    // Handle other errors
    return Promise.reject(error);
  }
);

// Initialize auth status
checkAuthStatus();

/**
 * Update the authentication status manually
 * @param {boolean} status - New authentication status
 */
export const updateAuthStatus = (status) => {
  isAuthenticated = status;
  return status;
};

export default apiClient;