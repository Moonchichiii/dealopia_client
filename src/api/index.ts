import apiClient from './client';

// Re-export the client as default
export default apiClient;

// Services for different features
export * from './services/auth';
export * from './services/deals';
export * from './services/shops';
export * from './services/categories';
export * from './services/locations';