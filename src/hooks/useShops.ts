import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { shopsApi } from '@/api';
import { ShopFilters } from '@/types/shops';

/**
 * Hook for fetching a list of shops with filters
 */
export const useShops = (filters?: ShopFilters) => {
    return useQuery({
        queryKey: ['shops', filters],
        queryFn: () => shopsApi.getShops(filters),
        staleTime: 1000 * 60 * 10, // 10 minutes
    });
};

/**
 * Hook for fetching featured shops
 */
export const useFeaturedShops = (limit: number = 4) => {
    return useQuery({
        queryKey: ['shops', 'featured', limit],
        queryFn: () => shopsApi.getFeaturedShops(),
        staleTime: 1000 * 60 * 30, // 30 minutes
    });
};

/**
 * Hook for fetching a single shop by ID
 */
export const useShop = (id?: string | number) => {
    return useQuery({
        queryKey: ['shop', id],
        queryFn: () => shopsApi.getShop(id!),
        enabled: !!id,
        staleTime: 1000
  });
};

/**
 * Hook for fetching deals by shop ID
 */
export const useShopDeals = (shopId?: string | number) => {
  return useQuery({
    queryKey: ['shop-deals', shopId],
    queryFn: () => shopsApi.getShopDeals(shopId!),
    enabled: !!shopId,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

/**
 * Hook for infinite scrolling of shops
 */
export const useInfiniteShops = (filters?: ShopFilters) => {
  return useInfiniteQuery({
    queryKey: ['shops', 'infinite', filters],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await shopsApi.getShops({
        ...filters,
        page: pageParam,
      });
      return {
        shops: response.results,
        currentPage: pageParam,
        totalPages: Math.ceil(response.count / (filters?.page_size || 20)),
      };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.currentPage < lastPage.totalPages) {
        return lastPage.currentPage + 1;
      }
      return undefined;
    },
  });
};