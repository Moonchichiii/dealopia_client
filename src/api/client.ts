import axios from 'axios';

// Flag to track if a refresh token request is in progress
let isRefreshing = false;
// Queue of requests that are waiting for the token refresh
let failedQueue = [];
// Flag to track if the user is authenticated
let isAuthenticated = false;

// Process the queue of failed requests
const processQueue = (error, token = null) => {
  failedQueue.forEach(promise => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve();
    }
  });
  
  failedQueue = [];
};

// Function to check if user has an access token in cookies
const checkAuthStatus = () => {
  // Simple check for authentication cookie - adjust based on your actual cookie name
  const cookies = document.cookie.split(';');
  const hasAuthCookie = cookies.some(cookie => 
    cookie.trim().startsWith('auth-token=')
  );
  isAuthenticated = hasAuthCookie;
  return hasAuthCookie;
};

/**
 * Main API client instance configured for the Dealopia backend
 */
const apiClient = axios.create({
  baseURL: '/api/v1',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // This is crucial for sending cookies with requests
});

// Request interceptor to avoid auth checks when not authenticated
apiClient.interceptors.request.use(
  (config) => {
    // Skip auth endpoints if not authenticated
    if (!isAuthenticated && 
        (config.url === '/auth/me/' || config.url === '/auth/token/refresh/')) {
      // Cancel the request
      const source = axios.CancelToken.source();
      config.cancelToken = source.token;
      source.cancel('Not authenticated, skipping auth check');
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling errors
apiClient.interceptors.response.use(
  (response) => {
    // If we get a successful response from auth/me, update authenticated status
    if (response.config.url === '/auth/me/') {
      isAuthenticated = true;
    }
    return response;
  },
  async (error) => {
    // If the request was cancelled by our interceptor, just return
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }

    const originalRequest = error.config;
    
    // Don't retry if:
    // 1. The request has already been retried
    // 2. It's a refresh token request itself (prevent loop)
    // 3. The status is not 401 (Unauthorized)
    if (
      originalRequest._retry || 
      originalRequest.url === '/auth/token/refresh/' || 
      error.response?.status !== 401
    ) {
      // If auth/me fails with 401, update authenticated status
      if (originalRequest.url === '/auth/me/') {
        isAuthenticated = false;
      }
      return Promise.reject(error);
    }
    
    // Mark as retried to prevent multiple attempts
    originalRequest._retry = true;
    
    // If a token refresh is already in progress, add this request to the queue
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(() => {
          return apiClient(originalRequest);
        })
        .catch(err => {
          return Promise.reject(err);
        });
    }
    
    // Start the refresh token process
    isRefreshing = true;
    
    try {
      // Try to refresh the token using the refresh cookie that's already attached
      await axios.post('/api/v1/auth/token/refresh/', {}, {
        withCredentials: true
      });
      
      // If the refresh succeeded, update auth status and process the queue
      isAuthenticated = true;
      isRefreshing = false;
      processQueue(null);
      return apiClient(originalRequest);
    } catch (refreshError) {
      // If refresh fails, update auth status and process the queue with error
      isAuthenticated = false;
      isRefreshing = false;
      processQueue(refreshError);
      
      // Only redirect if it's a real auth error, not a network error
      if (refreshError.response?.status === 401) {
        console.log('Authentication failed, redirecting to login page');
        window.location.href = '/login';
      }
      
      return Promise.reject(refreshError);
    }
  }
);

// Initialize authentication status on load
checkAuthStatus();

export default apiClient;

// Export a function to manually update auth status (useful after login/logout)
export const updateAuthStatus = (status) => {
  isAuthenticated = status;
  return status;
};