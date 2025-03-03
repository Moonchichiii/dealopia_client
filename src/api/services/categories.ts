import apiClient from '../client';
import { Category } from '@types/categories';

/**
 * Categories API service for category operations
 */
export const categoriesApi = {
  /**
   * Get all categories
   */
  getCategories: async (params?: { parent?: number; is_active?: boolean }) => {
    const { data } = await apiClient.get('/categories/', { params });
    return data;
  },

  /**
   * Get a single category by ID
   */
  getCategory: async (id: number | string): Promise<Category> => {
    const { data } = await apiClient.get(`/categories/${id}/`);
    return data;
  },

  /**
   * Get deals for a specific category
   */
  getCategoryDeals: async (categoryId: number | string) => {
    const { data } = await apiClient.get(`/categories/${categoryId}/deals/`);
    return data;
  },
};