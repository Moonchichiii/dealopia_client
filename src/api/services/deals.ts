import apiClient from '../client';
import { Deal, DealFilters } from '@types/deals';

/**
 * Deals API service for deal operations
 */
export const dealsApi = {
  /**
   * Get all deals with optional filters
   */
  getDeals: async (filters?: DealFilters) => {
    const { data } = await apiClient.get('/deals/', { params: filters });
    return data;
  },

  /**
   * Get a single deal by ID
   */
  getDeal: async (id: number | string): Promise<Deal> => {
    const { data } = await apiClient.get(`/deals/${id}/`);
    return data;
  },

  /**
   * Get featured deals
   */
  getFeaturedDeals: async () => {
    const { data } = await apiClient.get('/deals/featured/');
    return data;
  },

  /**
   * Get deals that are ending soon
   */
  getEndingSoonDeals: async () => {
    const { data } = await apiClient.get('/deals/ending-soon/');
    return data;
  },

  /**
   * Get nearby deals based on location
   */
  getNearbyDeals: async (lat: number, lng: number, radius: number = 10) => {
    const { data } = await apiClient.get('/deals/nearby/', {
      params: { lat, lng, radius }
    });
    return data;
  },

  /**
   * Track a view on a deal
   */
  trackDealView: async (id: number) => {
    const { data } = await apiClient.post(`/deals/${id}/track_view/`);
    return data;
  },

  /**
   * Track a click on a deal
   */
  trackDealClick: async (id: number) => {
    const { data } = await apiClient.post(`/deals/${id}/track_click/`);
    return data;
  },

  /**
   * Get deals by category with proper caching support
   */
  getDealsByCategory: async (categoryId: number | string, limit: number = 12) => {
    const { data } = await apiClient.get(`/categories/${categoryId}/deals/`, {
      params: { limit }
    });
    return data;
  },
  
  /**
   * Get popular deals - leveraging the new backend endpoint
   */
  getPopularDeals: async (limit: number = 6) => {
    const { data } = await apiClient.get('/deals/popular/', {
      params: { limit }
    });
    return data;
  },

  /**
   * Get related deals for a specific deal
   */
  getRelatedDeals: async (dealId: number | string, limit: number = 3) => {
    const { data } = await apiClient.get(`/deals/${dealId}/related/`, {
      params: { limit }
    });
    return data;
  }
};