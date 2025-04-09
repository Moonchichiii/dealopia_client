import apiClient from '@/api/client';
import { Deal, DealFilters } from '@/types/deals';

const CACHE_DURATIONS = {
  FEATURED: 5 * 60 * 1000,
  SEARCH: 1 * 60 * 1000,
  DETAIL: 3 * 60 * 1000,
  RELATED: 5 * 60 * 1000,
  ENDING_SOON: 3 * 60 * 1000,
  NEARBY: 2 * 60 * 1000,
};

const handleApiError = <T>(error: unknown, fallback: T): T => {
  console.error('Deal API error:', error);
  return fallback;
};

interface DealResponse {
  results: Deal[];
  count: number;
}

const dealService = {
  getDeals: async (filters?: DealFilters): Promise<DealResponse> => {
    try {
      const response = await apiClient.cachedGet<DealResponse>(
        'deals/',
        { params: filters },
        CACHE_DURATIONS.SEARCH
      );
      return response;
    } catch (error: unknown) {
      return handleApiError(error, { results: [], count: 0 });
    }
  },

  getDeal: async (id: string | number): Promise<Deal | null> => {
    if (!id) return null;
    try {
      const response = await apiClient.cachedGet<Deal>(`deals/${id}/`, {}, CACHE_DURATIONS.DETAIL);
      return response;
    } catch (error: unknown) {
      return handleApiError(error, null);
    }
  },

  getFeaturedDeals: async (limit = 6): Promise<Deal[]> => {
    try {
      const response = await apiClient.cachedGet<Deal[]>(
        'deals/featured/',
        { params: { limit } },
        CACHE_DURATIONS.FEATURED
      );
      return response;
    } catch (error: unknown) {
      return handleApiError(error, []);
    }
  },

  getEndingSoonDeals: async (days = 3, limit = 6): Promise<Deal[]> => {
    try {
      const response = await apiClient.cachedGet<Deal[]>(
        'deals/ending-soon/',
        { params: { days, limit } },
        CACHE_DURATIONS.ENDING_SOON
      );
      return response;
    } catch (error: unknown) {
      return handleApiError(error, []);
    }
  },

  getNearbyDeals: async (latitude: number, longitude: number, radius = 10): Promise<Deal[]> => {
    try {
      if (!latitude || !longitude || isNaN(latitude) || isNaN(longitude)) {
        console.warn('Invalid coordinates for getNearbyDeals:', { latitude, longitude });
        return [];
      }
      const params = {
        lat: Number(latitude).toFixed(6),
        lng: Number(longitude).toFixed(6),
        radius: Math.max(0.1, Math.min(radius, 50)).toFixed(1),
      };
      const deals = await apiClient.cachedGet<Deal[]>(
        'deals/nearby/',
        { params },
        CACHE_DURATIONS.NEARBY
      );
      return deals;
    } catch (error: unknown) {
      console.error('getNearbyDeals error:', error);
      return [];
    }
  },

  trackDealView: async (id: string | number): Promise<boolean> => {
    try {
      await apiClient.post(`deals/${id}/track_view/`);
      return true;
    } catch (error: unknown) {
      console.warn('Failed to track deal view:', error);
      return false;
    }
  },

  trackDealClick: async (id: string | number): Promise<boolean> => {
    try {
      await apiClient.post(`deals/${id}/track_click/`);
      return true;
    } catch (error: unknown) {
      console.warn('Failed to track deal click:', error);
      return false;
    }
  },

  getRelatedDeals: async (dealId: string | number, limit = 3): Promise<Deal[]> => {
    try {
      const response = await apiClient.cachedGet<Deal[]>(
        `deals/${dealId}/related/`,
        { params: { limit } },
        CACHE_DURATIONS.RELATED
      );
      return response;
    } catch (error: unknown) {
      return handleApiError(error, []);
    }
  },

  searchDeals: async (query: string, filters?: DealFilters): Promise<DealResponse> => {
    if (!query || query.length < 2) return { results: [], count: 0 };
    try {
      const response = await apiClient.cachedGet<DealResponse>(
        'deals/',
        { params: { search: query, ...filters } },
        CACHE_DURATIONS.SEARCH
      );
      return response;
    } catch (error: unknown) {
      return handleApiError(error, { results: [], count: 0 });
    }
  },

  getCategoryDeals: async (categoryId: string | number, limit = 12): Promise<Deal[]> => {
    if (!categoryId) return [];
    try {
      const response = await apiClient.cachedGet<Deal[]>(
        `categories/${categoryId}/deals/`,
        { params: { limit } },
        CACHE_DURATIONS.SEARCH // or use an appropriate duration
      );
      return response;
    } catch (error: unknown) {
      return handleApiError(error, []);
    }
  },

  getShopDeals: async (shopId: string | number, limit = 12): Promise<Deal[]> => {
    if (!shopId) return [];
    try {
      const response = await apiClient.cachedGet<Deal[]>(
        `shops/${shopId}/deals/`,
        { params: { limit } },
        CACHE_DURATIONS.SEARCH // or use an appropriate duration
      );
      return response;
    } catch (error: unknown) {
      return handleApiError(error, []);
    }
  },

  toggleFavorite: async (dealId: string | number, isFavorite: boolean): Promise<unknown> => {
    try {
      const method = isFavorite ? 'post' : 'delete';
      const endpoint = isFavorite ? 'users/favorites/' : `users/favorites/deal/${dealId}/`;
      const response = await apiClient[method](
        endpoint,
        isFavorite ? { type: 'deal', id: dealId } : undefined
      );
      apiClient.clearCache('users/favorites');
      apiClient.clearCache(`deals/${dealId}`);
      return response.data;
    } catch (error: unknown) {
      console.error('Failed to toggle favorite status:', error);
      throw error;
    }
  },

  refreshDealsCache: (): void => {
    apiClient.clearCache('deals');
    apiClient.clearCache('deals/featured');
    apiClient.clearCache('deals/ending-soon');
    apiClient.clearCache('deals/nearby');
  },
};

export default dealService;
