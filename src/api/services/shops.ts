import apiClient from '../client';
import { Shop, ShopFilters } from '@types/shops';

/**
 * Shops API service for shop operations
 */
export const shopsApi = {
  /**
   * Get all shops with optional filters
   */
  getShops: async (filters?: ShopFilters) => {
    const { data } = await apiClient.get('/shops/', { params: filters });
    return data;
  },

  /**
   * Get a single shop by ID
   */
  getShop: async (id: number | string): Promise<Shop> => {
    const { data } = await apiClient.get(`/shops/${id}/`);
    return data;
  },

  /**
   * Get featured shops
   */
  getFeaturedShops: async () => {
    const { data } = await apiClient.get('/shops/featured/');
    return data;
  },

  /**
   * Get deals for a specific shop
   */
  getShopDeals: async (shopId: number | string) => {
    const { data } = await apiClient.get(`/shops/${shopId}/deals/`);
    return data;
  },
};