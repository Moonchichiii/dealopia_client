import apiClient from '@/api/client';
import { Category } from '@/types/categories';

const CACHE_DURATIONS = {
  CATEGORIES: 24 * 60 * 60 * 1000,
  CATEGORY_DETAIL: 12 * 60 * 60 * 1000,
  FEATURED: 6 * 60 * 60 * 1000,
  CATEGORY_DEALS: 3 * 60 * 60 * 1000,
};

const handleCategoryError = (error: unknown, fallback: unknown = []): unknown => {
  console.error('Category service error:', error);
  return fallback;
};

const categoryService = {
  getCategories: async (
    params?: { parent?: number; is_active?: boolean; limit?: number }
  ): Promise<Category[]> => {
    try {
      return await apiClient.cachedGet<Category[]>('/api/v1/categories/', { params }, CACHE_DURATIONS.CATEGORIES);
    } catch (error: unknown) {
      return handleCategoryError(error, []);
    }
  },

  getCategory: async (id: number | string): Promise<Category | null> => {
    if (!id) return null;
    try {
      return await apiClient.cachedGet<Category>(`/api/v1/categories/${id}/`, {}, CACHE_DURATIONS.CATEGORY_DETAIL);
    } catch (error: unknown) {
      return handleCategoryError(error, null);
    }
  },

  getFeaturedCategories: async (limit: number = 6): Promise<Category[]> => {
    try {
      return await apiClient.cachedGet<Category[]>('/api/v1/categories/featured/', { params: { limit } }, CACHE_DURATIONS.FEATURED);
    } catch (error: unknown) {
      return handleCategoryError(error, []);
    }
  },

  getCategoryDeals: async (categoryId: number | string, limit: number = 12): Promise<Category[]> => {
    if (!categoryId) return [];
    try {
      return await apiClient.cachedGet<Category[]>(`/api/v1/categories/${categoryId}/deals/`, { params: { limit } }, CACHE_DURATIONS.CATEGORY_DEALS);
    } catch (error: unknown) {
      return handleCategoryError(error, []);
    }
  },

  getCategoryTree: async (): Promise<Category[]> => {
    try {
      const allCategories: Category[] = await apiClient.cachedGet('/api/v1/categories/', { params: { is_active: true } }, CACHE_DURATIONS.CATEGORIES);
      const rootCategories = allCategories.filter((cat) => !cat.parent);
      rootCategories.forEach((root) => {
        root.subcategories = allCategories.filter((cat) => cat.parent === root.id);
      });
      return rootCategories;
    } catch (error: unknown) {
      return handleCategoryError(error, []);
    }
  },

  getCategoryBreadcrumbs: async (categoryId: number | string): Promise<Category[]> => {
    if (!categoryId) return [];
    try {
      const category = await categoryService.getCategory(categoryId);
      if (!category) return [];
      const breadcrumbs = [category];
      if (category.parent) {
        const parents = await categoryService.getCategoryBreadcrumbs(category.parent);
        return [...parents, category];
      }
      return breadcrumbs;
    } catch (error: unknown) {
      return handleCategoryError(error, []);
    }
  },

  getRelatedCategories: async (categoryId: number | string, limit: number = 5): Promise<Category[]> => {
    if (!categoryId) return [];
    try {
      const category = await categoryService.getCategory(categoryId);
      if (!category) return [];
      if (category.parent) {
        const siblings = await apiClient.cachedGet<Category[]>('/api/v1/categories/', { params: { parent: category.parent, is_active: true } }, CACHE_DURATIONS.CATEGORIES);
        return siblings.filter((cat) => cat.id !== category.id).slice(0, limit);
      }
      return apiClient.cachedGet<Category[]>('/api/v1/categories/', { params: { parent: null, is_active: true } }, CACHE_DURATIONS.CATEGORIES)
        .then((cats) => cats.filter((cat) => cat.id !== category.id).slice(0, limit));
    } catch (error: unknown) {
      return handleCategoryError(error, []);
    }
  },

  searchCategories: async (query: string): Promise<Category[]> => {
    if (!query || query.length < 2) return [];
    try {
      return await apiClient.cachedGet<Category[]>('/api/v1/categories/', { params: { search: query } }, 5 * 60 * 1000);
    } catch (error: unknown) {
      return handleCategoryError(error, []);
    }
  },

  getCategoryIcon: (category: Category | null): string => {
    return category && category.icon ? category.icon : '/assets/icons/category-default.svg';
  },

  getCategoryImage: (category: Category | null): string => {
    return category && category.image ? category.image : '/assets/images/category-default.jpg';
  },
};

export default categoryService;
