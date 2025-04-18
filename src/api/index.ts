export const ENDPOINTS = {
    DEALS: {
        BASE: '/deals/',
        FEATURED: '/deals/featured/',
        ENDING_SOON: '/deals/ending-soon/',
        NEARBY: '/deals/nearby/',
        DETAIL: (id: number | string) => `/deals/${id}/`,
        TRACK_VIEW: (id: number | string) => `/deals/${id}/track_view/`,
        TRACK_CLICK: (id: number | string) => `/deals/${id}/track_click/`,
        RELATED: (id: number | string) => `/deals/${id}/related/`
    },
    SHOPS: {
        BASE: '/shops/',
        FEATURED: '/shops/featured/',
        DETAIL: (id: number | string) => `/shops/${id}/`,
        DEALS: (id: number | string) => `/shops/${id}/deals/`
    },
    CATEGORIES: {
        BASE: '/categories/',
        FEATURED: '/categories/featured/',
        DETAIL: (id: number | string) => `/categories/${id}/`,
        DEALS: (id: number | string) => `/categories/${id}/deals/`
    },
    LOCATIONS: {
        BASE: '/locations/',
        NEARBY: '/locations/nearby/',
        DETAIL: (id: number | string) => `/locations/${id}/`
    },
    AUTH: {
        LOGIN: '/auth/login/',
        REGISTER: '/auth/registration/',
        LOGOUT: '/auth/logout/',
        ME: '/auth/me/',
        UPDATE_PROFILE: '/users/update_profile/',
        VERIFY_EMAIL: '/auth/registration/verify-email/',
        REFRESH_TOKEN: '/auth/token/refresh/',
        VERIFY_TOKEN: '/auth/token/verify/',
        PASSWORD_RESET: '/auth/password/reset/',
        PASSWORD_RESET_CONFIRM: '/auth/password/reset/confirm/',
        PASSWORD_CHANGE: '/auth/password/change/',
        TWO_FACTOR_VERIFY: '/auth/2fa/verify/',
        TWO_FACTOR_SETUP: '/auth/2fa/setup/',
        TWO_FACTOR_DISABLE: '/auth/2fa/disable/',
        SOCIAL_LOGIN: '/auth/social-login/'
    },
    USERS: {
        FAVORITES: '/users/favorites/',
        PROFILE: '/users/profile/',
        SETTINGS: '/users/settings/'
    }
};

import dealServiceImport from '@/api/deals/dealService';
import locationServiceImport from '@/api/locations/locationService';
import categoryServiceImport from '@/api/categories/categoryService';
import shopServiceImport from '@/api/shops/shopService';
import authServiceImport from '@/api/auth/authService';

export const dealService = dealServiceImport;
export const locationService = locationServiceImport;
export const categoryService = categoryServiceImport;
export const shopService = shopServiceImport;
export const authService = authServiceImport;

export default {
    deals: dealServiceImport,
    locations: locationServiceImport,
    categories: categoryServiceImport,
    shops: shopServiceImport,
    auth: authServiceImport,
    endpoints: ENDPOINTS
};
