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

/**
 * Validate coordinate values for API requests
 */
const validateCoordinates = (lat?: number | null, lng?: number | null): boolean => {
  if (lat === undefined || lat === null || lng === undefined || lng === null) {
    return false;
  }
  
  return (
    !isNaN(lat) &&
    !isNaN(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );
};

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

  getNearbyDeals: async (latitude: number | null, longitude: number | null, radius = 10): Promise<Deal[]> => {
    try {
      // Validate coordinates before making the API call
      if (!validateCoordinates(latitude, longitude)) {
        console.warn('Invalid coordinates for getNearbyDeals:', { latitude, longitude });
        return [];
      }

      // Properly format coordinates to 6 decimal places for precision
      const params = {
        latitude: Number(latitude).toFixed(6),
        longitude: Number(longitude).toFixed(6),
        radius: Math.max(0.1, Math.min(radius, 50)).toFixed(1), // Ensure radius is reasonable
      };

      console.log('Fetching nearby deals with params:', params);

      const deals = await apiClient.cachedGet<any>(
        'deals/nearby/',
        { params },
        CACHE_DURATIONS.NEARBY
      );

      // Handle both array and paginated response formats
      if (Array.isArray(deals)) {
        return deals;
      } else if (deals && deals.results) {
        return deals.results;
      }
      
      return [];
    } catch (error: unknown) {
      console.error('getNearbyDeals error:', error);
      return handleApiError(error, []);
    }
  },

  searchDeals: async (query: string, filters?: DealFilters): Promise<DealResponse> => {
    if (!query || query.length < 2) return { results: [], count: 0 };
    try {
      const mergedFilters = { search: query, ...filters };
      const response = await apiClient.cachedGet<DealResponse>(
        'deals/',
        { params: mergedFilters },
        CACHE_DURATIONS.SEARCH
      );
      return response;
    } catch (error: unknown) {
      return handleApiError(error, { results: [], count: 0 });
    }
  },

  // New method for location-aware searches
  searchDealsWithLocation: async (
    query: string = '',
    latitude?: number | null,
    longitude?: number | null,
    radius: number = 10,
    additionalFilters: DealFilters = {}
  ): Promise<DealResponse> => {
    try {
      // If we have valid coordinates, prioritize location-based search
      if (validateCoordinates(latitude, longitude)) {
        // For empty queries with location, just get nearby deals
        if (!query || query.length < 2) {
          const deals = await dealService.getNearbyDeals(latitude, longitude, radius);
          return { 
            results: deals, 
            count: deals.length 
          };
        }
        
        // Otherwise, combine query with location
        const filters: DealFilters = {
          ...additionalFilters,
          search: query,
          latitude,
          longitude,
          radius
        };
        
        return await apiClient.cachedGet<DealResponse>(
          'deals/',
          { params: filters },
          CACHE_DURATIONS.SEARCH
        );
      } 
      
      // Fall back to regular search if no valid location
      return await dealService.searchDeals(query, additionalFilters);
    } catch (error: unknown) {
      return handleApiError(error, { results: [], count: 0 });
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

  getCategoryDeals: async (categoryId: string | number, limit = 12): Promise<Deal[]> => {
    if (!categoryId) return [];
    try {
      const response = await apiClient.cachedGet<Deal[]>(
        `categories/${categoryId}/deals/`,
        { params: { limit } },
        CACHE_DURATIONS.SEARCH
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
        CACHE_DURATIONS.SEARCH
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
      
      // Invalidate relevant caches
      if (typeof apiClient.clearCache === 'function') {
        apiClient.clearCache('users/favorites');
        apiClient.clearCache(`deals/${dealId}`);
      }
      
      return response.data;
    } catch (error: unknown) {
      console.error('Failed to toggle favorite status:', error);
      throw error;
    }
  },

  refreshDealsCache: (): void => {
    // Clear all deal-related caches
    if (typeof apiClient.clearCache === 'function') {
      apiClient.clearCache('deals');
      apiClient.clearCache('deals/featured');
      apiClient.clearCache('deals/ending-soon');
      apiClient.clearCache('deals/nearby');
    }
  },
};

export default dealService;