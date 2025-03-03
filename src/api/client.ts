import axios from 'axios';

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

// With HTTP-only cookies, we don't need to manually add tokens to headers
// The browser will automatically include cookies in the request

// Response interceptor for handling errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Handle 401 errors (token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh the token using the refresh cookie that's already attached
        await axios.post('/api/v1/auth/token/refresh/', {}, { 
          withCredentials: true 
        });
        
        // If the refresh succeeded, retry the original request
        // The new access token is now in the cookies
        return axios(originalRequest);
      } catch (refreshError) {
        // If refresh fails, redirect to login
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;