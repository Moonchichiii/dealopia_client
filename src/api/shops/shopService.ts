import apiClient from '@/api/client';
import { Shop, ShopFilters } from '@/types/shops';

const CACHE_DURATIONS = {
  SHOPS_LIST: 6 * 60 * 60 * 1000,
  SHOP_DETAIL: 3 * 60 * 60 * 1000,
  FEATURED_SHOPS: 4 * 60 * 60 * 1000,
  SHOP_DEALS: 1 * 60 * 60 * 1000,
  NEARBY_SHOPS: 30 * 60 * 1000,
};

const handleShopError = <T>(error: unknown, fallback: T): T => {
  console.error('Shop service error:', error);
  return fallback;
};

const shopService = {
  getShops: async (filters?: ShopFilters): Promise<{ results: Shop[]; count: number }> => {
    try {
      return await apiClient.cachedGet<{ results: Shop[]; count: number }>(
        '/api/v1/shops/',
        { params: filters },
        CACHE_DURATIONS.SHOPS_LIST
      );
    } catch (error) {
      return handleShopError({ results: [], count: 0 }, { results: [], count: 0 });
    }
  },

  getShop: async (id: string | number): Promise<Shop | null> => {
    if (!id) return null;
    try {
      return await apiClient.cachedGet<Shop>(
        `/api/v1/shops/${id}/`, 
        {}, 
        CACHE_DURATIONS.SHOP_DETAIL
      );
    } catch (error) {
      return handleShopError<Shop | null>(error, null);
    }
  },

  getFeaturedShops: async (limit = 4): Promise<Shop[]> => {
    try {
      const response = await apiClient.cachedGet<{ results: Shop[] }>(
        '/api/v1/shops/featured/',
        { params: { limit } },
        CACHE_DURATIONS.FEATURED_SHOPS
      );
      return response.results || response;
    } catch (error) {
      return handleShopError<Shop[]>(error, []);
    }
  },

  getShopDeals: async (shopId: string | number, limit = 12): Promise<Shop[]> => {
    if (!shopId) return [];
    try {
      return await apiClient.cachedGet<Shop[]>(
        `/api/v1/shops/${shopId}/deals/`,
        { params: { limit } },
        CACHE_DURATIONS.SHOP_DEALS
      );
    } catch (error) {
      return handleShopError<Shop[]>(error, []);
    }
  },

  getNearbyShops: async (latitude: number, longitude: number, radius = 10): Promise<Shop[]> => {
    try {
      const safeRadius = Math.max(0.1, Math.min(radius, 50));
      const response = await apiClient.cachedGet<{ results: Shop[] }>(
        '/api/v1/shops/',
        { 
          params: { 
            lat: latitude, 
            lng: longitude, 
            radius: safeRadius, 
            is_verified: true 
          } 
        },
        CACHE_DURATIONS.NEARBY_SHOPS
      );
      return response.results || response;
    } catch (error) {
      return handleShopError<Shop[]>(error, []);
    }
  },

  searchShops: async (query: string, filters?: ShopFilters): Promise<Shop[]> => {
    if (!query || query.length < 2) return [];
    try {
      const response = await apiClient.cachedGet<{ results: Shop[] }>(
        '/api/v1/shops/',
        { params: { search: query, ...filters } },
        5 * 60 * 1000
      );
      return response.results || response;
    } catch (error) {
      return handleShopError<Shop[]>(error, []);
    }
  },

  getShopsByCategory: async (categoryId: string | number, limit = 8): Promise<Shop[]> => {
    if (!categoryId) return [];
    try {
      const response = await apiClient.cachedGet<{ results: Shop[] }>(
        '/api/v1/shops/',
        { 
          params: { 
            categories: categoryId, 
            is_verified: true, 
            limit 
          } 
        },
        CACHE_DURATIONS.SHOPS_LIST
      );
      return response.results || response;
    } catch (error) {
      return handleShopError<Shop[]>(error, []);
    }
  },

  formatOpeningHours: (hours: Record<string, string> | undefined): string[] => {
    if (!hours) return [];
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    return days.map((day) => {
      const dayHours = hours[day.toLowerCase()] || 'Closed';
      return `${day}: ${dayHours}`;
    });
  },

  isShopOpen: (shop: Shop | null): boolean => {
    if (!shop?.opening_hours) return false;
    
    const now = new Date();
    const dayOfWeek = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    const hoursToday = shop.opening_hours[dayOfWeek];
    if (!hoursToday || hoursToday === 'Closed') return false;
    
    const [openTime, closeTime] = hoursToday.split('-');
    return currentTime >= openTime && currentTime <= closeTime;
  },

  getShopLogo: (shop: Shop | null): string => 
    shop?.logo || '/assets/images/shop-default.png',

  formatRating: (rating: number): string => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    return '★'.repeat(fullStars) + (halfStar ? '½' : '') + '☆'.repeat(emptyStars);
  },
};

export default shopService;
