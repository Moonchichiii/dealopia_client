// src/api/services.ts
import apiClient from '@/api/client';
import {
    Category,
    Deal,
    DealFilters,
    Location,
    Shop,
    UserProfile,
    LoginCredentials,
    RegisterData,
    SocialLoginParams,
    Tokens
} from '@/types';

// Define missing types if not already in @/types
interface ShopFilters {
    lat?: number;
    lng?: number;
    radius?: number;
    search?: string;
    limit?: number;
    categories?: number[];
    is_verified?: boolean;
    is_featured?: boolean;
    page?: number;
    page_size?: number;
    ordering?: string;
}

interface CategoryParams {
    parent?: number;
    is_active?: boolean;
    limit?: number;
    page?: number;
    ordering?: string;
}

// Define endpoints including auth endpoints
export const ENDPOINTS = {
    DEALS: {
        BASE: '/api/v1/deals/',
        FEATURED: '/api/v1/deals/featured/',
        ENDING_SOON: '/api/v1/deals/ending-soon/',
        NEARBY: '/api/v1/deals/nearby/',
        DETAIL: (id: number | string) => `/api/v1/deals/${id}/`,
        TRACK_VIEW: (id: number | string) => `/api/v1/deals/${id}/track_view/`,
        TRACK_CLICK: (id: number | string) => `/api/v1/deals/${id}/track_click/`,
        RELATED: (id: number | string) => `/api/v1/deals/${id}/related/`
    },
    SHOPS: {
        BASE: '/api/v1/shops/',
        FEATURED: '/api/v1/shops/featured/',
        DETAIL: (id: number | string) => `/api/v1/shops/${id}/`,
        DEALS: (id: number | string) => `/api/v1/shops/${id}/deals/`
    },
    CATEGORIES: {
        BASE: '/api/v1/categories/',
        FEATURED: '/api/v1/categories/featured/',
        DETAIL: (id: number | string) => `/api/v1/categories/${id}/`,
        DEALS: (id: number | string) => `/api/v1/categories/${id}/deals/`
    },
    LOCATIONS: {
        BASE: '/api/v1/locations/',
        NEARBY: '/api/v1/locations/nearby/',
        DETAIL: (id: number | string) => `/api/v1/locations/${id}/`
    },
    AUTH: {
        LOGIN: '/api/v1/auth/login/',
        REGISTER: '/api/v1/auth/registration/',
        LOGOUT: '/api/v1/auth/logout/',
        ME: '/api/v1/auth/me/',
        UPDATE_PROFILE: '/api/v1/users/update_profile/',
        VERIFY_EMAIL: '/api/v1/auth/registration/verify-email/',
        REFRESH_TOKEN: '/api/v1/auth/token/refresh/',
        VERIFY_TOKEN: '/api/v1/auth/token/verify/',
        PASSWORD_RESET: '/api/v1/auth/password/reset/',
        PASSWORD_RESET_CONFIRM: '/api/v1/auth/password/reset/confirm/',
        PASSWORD_CHANGE: '/api/v1/auth/password/change/',
        TWO_FACTOR_VERIFY: '/api/v1/auth/2fa/verify/',
        TWO_FACTOR_SETUP: '/api/v1/auth/2fa/setup/',
        TWO_FACTOR_DISABLE: '/api/v1/auth/2fa/disable/',
        SOCIAL_LOGIN: '/api/v1/auth/social-login/'
    }
};

// Auth service
export const authService = {
    login: async (credentials: LoginCredentials) => {
        const response = await apiClient.post(ENDPOINTS.AUTH.LOGIN, credentials);
        return response.data;
    },

    socialLogin: async (params: SocialLoginParams) => {
        const response = await apiClient.post(ENDPOINTS.AUTH.SOCIAL_LOGIN, params);
        return response.data;
    },

    register: async (userData: RegisterData) => {
        const response = await apiClient.post(ENDPOINTS.AUTH.REGISTER, userData);
        return response.data;
    },

    logout: async () => {
        return await apiClient.post(ENDPOINTS.AUTH.LOGOUT);
    },

    getProfile: async () => {
        const response = await apiClient.get(ENDPOINTS.AUTH.ME);
        return response.data;
    },

    updateProfile: async (profileData: Partial<UserProfile>) => {
        const response = await apiClient.patch(ENDPOINTS.AUTH.UPDATE_PROFILE, profileData);
        return response.data;
    },

    verifyEmail: async (key: string) => {
        const response = await apiClient.post(ENDPOINTS.AUTH.VERIFY_EMAIL, { key });
        return response.data;
    },

    verifyToken: async (token: string) => {
        try {
            const response = await apiClient.post(ENDPOINTS.AUTH.VERIFY_TOKEN, { token });
            return !!response.data;
        } catch {
            return false;
        }
    },

    refreshToken: async (refreshToken: string) => {
        const response = await apiClient.post(ENDPOINTS.AUTH.REFRESH_TOKEN, {
            refresh: refreshToken
        });
        return response.data;
    },

    requestPasswordReset: async (email: string) => {
        await apiClient.post(ENDPOINTS.AUTH.PASSWORD_RESET, { email });
    },

    resetPassword: async (token: string, password: string, password_confirm: string) => {
        await apiClient.post(ENDPOINTS.AUTH.PASSWORD_RESET_CONFIRM, {
            token,
            new_password1: password,
            new_password2: password_confirm
        });
    },

    verifyTwoFactor: async (userId: string, token: string) => {
        const response = await apiClient.post(ENDPOINTS.AUTH.TWO_FACTOR_VERIFY, {
            user_id: userId,
            token
        });
        return response.data;
    },

    setupTwoFactor: async () => {
        const response = await apiClient.get(ENDPOINTS.AUTH.TWO_FACTOR_SETUP);
        return response.data;
    },

    confirmTwoFactorSetup: async (token: string) => {
        const response = await apiClient.post(ENDPOINTS.AUTH.TWO_FACTOR_SETUP, { token });
        return response.data;
    },

    disableTwoFactor: async (password: string) => {
        const response = await apiClient.post(ENDPOINTS.AUTH.TWO_FACTOR_DISABLE, { password });
        return response.data;
    }
};

// Deal service
export const dealService = {
    getDeals: async (filters?: DealFilters) => {
        const response = await apiClient.get(ENDPOINTS.DEALS.BASE, { params: filters });
        return response.data;
    },

    getDeal: async (id: number | string) => {
        const response = await apiClient.get(ENDPOINTS.DEALS.DETAIL(id));
        return response.data;
    },

    getFeaturedDeals: async (limit: number = 6) => {
        const response = await apiClient.get(ENDPOINTS.DEALS.FEATURED, { params: { limit } });
        return response.data;
    },

    getEndingSoonDeals: async (days: number = 3, limit: number = 6) => {
        const response = await apiClient.get(ENDPOINTS.DEALS.ENDING_SOON, {
            params: { days, limit }
        });
        return response.data;
    },

    getNearbyDeals: async (lat: number, lng: number, radius: number = 10) => {
        const response = await apiClient.get(ENDPOINTS.DEALS.NEARBY, {
            params: { lat, lng, radius }
        });
        return response.data;
    },

    trackDealView: async (id: number | string) => {
        await apiClient.post(ENDPOINTS.DEALS.TRACK_VIEW(id));
    },

    trackDealClick: async (id: number | string) => {
        await apiClient.post(ENDPOINTS.DEALS.TRACK_CLICK(id));
    },

    getRelatedDeals: async (dealId: number | string, limit: number = 3) => {
        const response = await apiClient.get(ENDPOINTS.DEALS.RELATED(dealId), {
            params: { limit }
        });
        return response.data;
    },
    
    createDeal: async (dealData: Partial<Deal>) => {
        const response = await apiClient.post(ENDPOINTS.DEALS.BASE, dealData);
        return response.data;
    },
    
    updateDeal: async (id: number | string, dealData: Partial<Deal>) => {
        const response = await apiClient.patch(ENDPOINTS.DEALS.DETAIL(id), dealData);
        return response.data;
    },
    
    deleteDeal: async (id: number | string) => {
        await apiClient.delete(ENDPOINTS.DEALS.DETAIL(id));
    }
};

// Shop service
export const shopService = {
    getShops: async (filters?: ShopFilters) => {
        const response = await apiClient.get(ENDPOINTS.SHOPS.BASE, { params: filters });
        return response.data;
    },

    getShop: async (id: number | string) => {
        const response = await apiClient.get(ENDPOINTS.SHOPS.DETAIL(id));
        return response.data;
    },

    getFeaturedShops: async (limit: number = 4) => {
        const response = await apiClient.get(ENDPOINTS.SHOPS.FEATURED, {
            params: { limit }
        });
        return response.data;
    },

    getShopDeals: async (shopId: number | string) => {
        const response = await apiClient.get(ENDPOINTS.SHOPS.DEALS(shopId));
        return response.data;
    },

    getNearbyShops: async (lat: number, lng: number, radius: number = 10) => {
        const response = await apiClient.get(ENDPOINTS.SHOPS.BASE, {
            params: { lat, lng, radius }
        });
        return response.data;
    },
    
    createShop: async (shopData: Partial<Shop>) => {
        const response = await apiClient.post(ENDPOINTS.SHOPS.BASE, shopData);
        return response.data;
    },
    
    updateShop: async (id: number | string, shopData: Partial<Shop>) => {
        const response = await apiClient.patch(ENDPOINTS.SHOPS.DETAIL(id), shopData);
        return response.data;
    },
    
    deleteShop: async (id: number | string) => {
        await apiClient.delete(ENDPOINTS.SHOPS.DETAIL(id));
    }
};

// Category service
export const categoryService = {
    getCategories: async (params?: CategoryParams) => {
        const response = await apiClient.get(ENDPOINTS.CATEGORIES.BASE, { params });
        return response.data;
    },

    getCategory: async (id: number | string) => {
        const response = await apiClient.get(ENDPOINTS.CATEGORIES.DETAIL(id));
        return response.data;
    },

    getCategoryDeals: async (categoryId: number | string, limit: number = 12) => {
        const response = await apiClient.get(ENDPOINTS.CATEGORIES.DEALS(categoryId), {
            params: { limit }
        });
        return response.data;
    },

    getFeaturedCategories: async (limit: number = 6) => {
        const response = await apiClient.get(ENDPOINTS.CATEGORIES.FEATURED, {
            params: { limit }
        });
        return response.data;
    },
    
    createCategory: async (categoryData: Partial<Category>) => {
        const response = await apiClient.post(ENDPOINTS.CATEGORIES.BASE, categoryData);
        return response.data;
    },
    
    updateCategory: async (id: number | string, categoryData: Partial<Category>) => {
        const response = await apiClient.patch(ENDPOINTS.CATEGORIES.DETAIL(id), categoryData);
        return response.data;
    },
    
    deleteCategory: async (id: number | string) => {
        await apiClient.delete(ENDPOINTS.CATEGORIES.DETAIL(id));
    }
};

// Location service
export const locationService = {
    getLocations: async (search?: string) => {
        const response = await apiClient.get(ENDPOINTS.LOCATIONS.BASE, {
            params: search ? { search } : undefined
        });
        return response.data;
    },

    getLocation: async (id: number | string) => {
        const response = await apiClient.get(ENDPOINTS.LOCATIONS.DETAIL(id));
        return response.data;
    },

    getNearbyLocations: async (lat: number, lng: number, radius: number = 10) => {
        try {
            const response = await apiClient.get(ENDPOINTS.LOCATIONS.NEARBY, {
                params: { lat, lng, radius }
            });
            return response.data;
        } catch (error) {
            throw new Error(`Failed to fetch nearby locations: ${error}`);
        }
    },
    
    createLocation: async (locationData: Partial<Location>) => {
        const response = await apiClient.post(ENDPOINTS.LOCATIONS.BASE, locationData);
        return response.data;
    },
    
    updateLocation: async (id: number | string, locationData: Partial<Location>) => {
        const response = await apiClient.patch(ENDPOINTS.LOCATIONS.DETAIL(id), locationData);
        return response.data;
    },
    
    deleteLocation: async (id: number | string) => {
        await apiClient.delete(ENDPOINTS.LOCATIONS.DETAIL(id));
    }
};

// Export all services as a unified API object
const apiServices = {
    auth: authService,
    deals: dealService,
    shops: shopService,
    categories: categoryService,
    locations: locationService,
    endpoints: ENDPOINTS
};

export default apiServices;