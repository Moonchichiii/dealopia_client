import { useQuery } from '@tanstack/react-query';
import { shopService } from '@/api/services';
import { ShopFilters } from '@/types/shops';

// Query key factory
const shopKeys = {
  all: ['shops'] as const,
  lists: () => [...shopKeys.all, 'list'] as const,
  list: (filters: ShopFilters = {}) => [...shopKeys.lists(), filters] as const,
  details: () => [...shopKeys.all, 'detail'] as const,
  detail: (id: string | number) => [...shopKeys.details(), id] as const,
  featured: (limit?: number) => [...shopKeys.all, 'featured', limit] as const,
};

/**
 * Hook for fetching shops with filters
 */
export const useShops = (filters?: ShopFilters) => {
  return useQuery({
    queryKey: shopKeys.list(filters),
    queryFn: () => shopService.getShops(filters),
    staleTime: 5 * 60 * 1000, // 5 minute cache
  });
};

/**
 * Hook for fetching a single shop by ID
 */
export const useShop = (id?: string | number) => {
  return useQuery({
    queryKey: id ? shopKeys.detail(id) : shopKeys.details(),
    queryFn: () => shopService.getShop(id!),
    enabled: !!id,
    staleTime: 3 * 60 * 1000, // 3 minutes
  });
};

/**
 * Hook for fetching featured shops
 */
export const useFeaturedShops = (limit: number = 4) => {
  return useQuery({
    queryKey: shopKeys.featured(limit),
    queryFn: () => shopService.getFeaturedShops(limit),
    staleTime: 4 * 60 * 1000, // 4 minutes cache
  });
};

/**
 * Hook for fetching shops by category
 */
export const useShopsByCategory = (categoryId?: string | number, limit: number = 8) => {
  return useQuery({
    queryKey: [...shopKeys.lists(), 'category', categoryId, limit],
    queryFn: () => shopService.getShopsByCategory(categoryId!, limit),
    enabled: !!categoryId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Export default object with all hooks
export default {
  useShops,
  useShop,
  useFeaturedShops,
  useShopsByCategory
};