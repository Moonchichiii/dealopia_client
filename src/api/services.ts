import apiClient, { updateAuthStatus } from './client';

import { 
    LoginCredentials, 
    RegisterData, 
    UserProfile,
    DealFilters,
    Deal,
    Shop,
    Category,
    Location
} from '@/types';

export interface SocialLoginParams {
    provider: 'google' | 'facebook' | 'github';
    token?: string;
    code?: string;
}

// Auth Services
export const authService = {
    login: async (credentials: LoginCredentials) => { 
        const response = await apiClient.post('/auth/login/', credentials); 
        updateAuthStatus(true); 
        return response.data; 
    },

    socialLogin: async (params: SocialLoginParams) => {
        const response = await apiClient.post('/auth/social-login/', params);
        updateAuthStatus(true);
        return response.data;
    },

    register: async (userData: RegisterData) => {
        try {
            const response = await apiClient.post('/auth/registration/', userData);
            
            // Check if email verification is required
            if (response.data.detail && response.data.detail.includes('verification email')) {
                // Return object with verification status info
                return {
                    success: true,
                    requiresVerification: true,
                    message: 'Registration successful! Please check your email to verify your account.',
                    data: response.data
                };
            } else {
                // If no verification needed (rare in production), return success
                return {
                    success: true,
                    requiresVerification: false,
                    message: 'Registration successful!',
                    data: response.data
                };
            }
        } catch (error) {
            // Handle registration errors (duplicate email, etc.)
            const errorMessage = error.response?.data?.detail || 
                              error.response?.data?.email?.[0] ||
                              'Registration failed. Please try again.';
            
            return {
                success: false,
                requiresVerification: false,
                message: errorMessage,
                error: error.response?.data
            };
        }
    },

    logout: async () => {
        await apiClient.post('/auth/logout/');
        updateAuthStatus(false);
    },

    getProfile: async () => {
        // Check if authentication cookies exist before making the request 
        const hasAuthCookies = document.cookie.includes('auth-token') || 
                              document.cookie.includes('refresh-token'); 
        
        if (!hasAuthCookies) { 
            console.log('No authentication cookies found, skipping profile fetch'); 
            updateAuthStatus(false); 
            return null; 
        } 
        
        try {
            const response = await apiClient.get('/auth/me/');
            updateAuthStatus(true);
            return response.data;
        } catch (error) {
            console.error('Error fetching profile:', error);
            updateAuthStatus(false);
            return null;
        }
    },

    updateProfile: async (profileData: Partial<UserProfile>) => {
        const response = await apiClient.patch('/auth/me/', profileData);
        return response.data;
    },

    verifyEmail: async (key: string) => {
        await apiClient.post('/auth/registration/verify-email/', { key });
    },

    refreshToken: async () => {
        const response = await apiClient.post('/auth/token/refresh/');
        return response.data;
    },

    requestPasswordReset: async (email: string) => {
        await apiClient.post('/auth/password/reset/', { email });
    },

    resetPassword: async (token: string, new_password1: string, new_password2: string) => {
        await apiClient.post('/auth/password/reset/confirm/', {
            token,
            new_password1,
            new_password2
        });
    }
};

// Deal Services
export const dealService = {
    getDeals: async (filters?: DealFilters) => {
        const response = await apiClient.get('/deals/', { params: filters });
        return response.data;
    },

    getDeal: async (id: number | string) => {
        const response = await apiClient.get(`/deals/${id}/`);
        return response.data;
    },

    getFeaturedDeals: async (limit: number = 6) => {
        const response = await apiClient.get('/deals/featured/', { params: { limit } });
        return response.data;
    },

    getEndingSoonDeals: async (days: number = 3, limit: number = 6) => {
        const response = await apiClient.get('/deals/ending-soon/', { 
            params: { days, limit } 
        });
        return response.data;
    },

    getNearbyDeals: async (lat: number, lng: number, radius: number = 10) => {
        const response = await apiClient.get('/deals/nearby/', {
            params: { lat, lng, radius }
        });
        return response.data;
    },

    trackDealView: async (id: number) => {
        await apiClient.post(`/deals/${id}/track_view/`);
    },

    trackDealClick: async (id: number) => {
        await apiClient.post(`/deals/${id}/track_click/`);
    },

    getRelatedDeals: async (dealId: number | string, limit: number = 3) => {
        const response = await apiClient.get(`/deals/${dealId}/related/`, {
            params: { limit }
        });
        return response.data;
    }
};

// Shop Services
export const shopService = {
    getShops: async (filters?: any) => {
        const response = await apiClient.get('/shops/', { params: filters });
        return response.data;
    },

    getShop: async (id: number | string) => {
        const response = await apiClient.get(`/shops/${id}/`);
        return response.data;
    },

    getFeaturedShops: async (limit: number = 4) => {
        const response = await apiClient.get('/shops/featured/', { 
            params: { limit } 
        });
        return response.data;
    },

    getShopDeals: async (shopId: number | string) => {
        const response = await apiClient.get(`/shops/${shopId}/deals/`);
        return response.data;
    },

    getNearbyShops: async (lat: number, lng: number, radius: number = 10) => {
        const response = await apiClient.get('/shops/', {
            params: { lat, lng, radius }
        });
        return response.data;
    }
};

// Category Services
export const categoryService = {
    getCategories: async (params?: { parent?: number; is_active?: boolean }) => {
        const response = await apiClient.get('/categories/', { params });
        return response.data;
    },

    getCategory: async (id: number | string) => {
        const response = await apiClient.get(`/categories/${id}/`);
        return response.data;
    },

    getCategoryDeals: async (categoryId: number | string, limit: number = 12) => {
        const response = await apiClient.get(`/categories/${categoryId}/deals/`, {
            params: { limit }
        });
        return response.data;
    },

    getFeaturedCategories: async (limit: number = 6) => {
        const response = await apiClient.get('/categories/featured/', {
            params: { limit }
        });
        return response.data;
    }
};

// Location Services
export const locationService = {
    getLocations: async (search?: string) => {
        const response = await apiClient.get('/locations/', {
            params: search ? { search } : undefined
        });
        return response.data;
    },

    getLocation: async (id: number | string) => {
        const response = await apiClient.get(`/locations/${id}/`);
        return response.data;
    },

    // In your services.ts file
async getNearbyLocations(lat: number, lng: number, radius: number) {
    try {
      const response = await api.get('/locations/nearby/', {
        params: { lat, lng, radius }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching nearby locations:', error);
      // Return empty array instead of throwing
      return [];
    }
  }
};

// Unified export
const apiServices = {
    auth: authService,
    deals: dealService,
    shops: shopService,
    categories: categoryService,
    locations: locationService
};

export default apiServices;