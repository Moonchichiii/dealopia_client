import { 
  useQuery, 
  useInfiniteQuery, 
  useMutation, 
  useQueryClient 
} from '@tanstack/react-query';
import { dealsApi } from '@/api';
import { Deal, DealFilters } from '@/types/deals';
import { toast } from 'react-toastify';

/** Fetch paginated deals with filters */
export const useDeals = (params?: DealFilters) => {
  return useQuery({
    queryKey: ['deals', params],
    queryFn: () => dealsApi.getDeals(params),
    keepPreviousData: true,
  });
};

/** Fetch infinite scrolling deals list */
export const useInfiniteDeals = (filters?: DealFilters) => {
  return useInfiniteQuery({
    queryKey: ['deals', 'infinite', filters],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await dealsApi.getDeals({
        ...filters,
        page: pageParam,
      });
      return {
        deals: response.results,
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

/** Fetch single deal by ID */
export const useDeal = (id?: string) => {
  return useQuery({
    queryKey: ['deal', id],
    queryFn: () => dealsApi.getDeal(id!),
    enabled: !!id,
  });
};

/** Fetch featured deals */
export const useFeaturedDeals = (limit: number = 6) => {
  return useQuery({
    queryKey: ['deals', 'featured', limit],
    queryFn: () => dealsApi.getFeaturedDeals(),
    staleTime: 1000 * 60 * 30,
  });
};

/** Fetch deals ending soon */
export const useEndingSoonDeals = (days: number = 3, limit: number = 6) => {
  return useQuery({
    queryKey: ['deals', 'ending-soon', days, limit],
    queryFn: () => dealsApi.getEndingSoonDeals(),
    staleTime: 1000 * 60 * 60,
  });
};

/** Fetch popular deals */
export const usePopularDeals = (limit: number = 6) => {
  return useQuery({
    queryKey: ['deals', 'popular', limit],
    queryFn: () => dealsApi.getPopularDeals(limit),
    staleTime: 1000 * 60 * 60 * 24,
  });
};

/** Fetch deals near user's location */
export const useNearbyDeals = (
  latitude?: number, 
  longitude?: number, 
  radius: number = 10
) => {
  return useQuery({
    queryKey: ['deals', 'nearby', latitude, longitude, radius],
    queryFn: () => dealsApi.getNearbyDeals(latitude!, longitude!, radius),
    enabled: !!latitude && !!longitude,
    staleTime: 1000 * 60 * 10,
  });
};

/** Search deals */
export const useSearchDeals = (query: string) => {
  return useQuery({
    queryKey: ['deals', 'search', query],
    queryFn: () => dealsApi.searchDeals(query),
    enabled: query.length > 2,
    staleTime: 1000 * 60 * 5,
  });
};

/** Toggle deal favorite status */
export const useToggleDealFavorite = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ dealId, isFavorite }: { dealId: string; isFavorite: boolean }) => 
      dealsApi.toggleFavorite(dealId, isFavorite),
    onMutate: async ({ dealId, isFavorite }) => {
      await queryClient.cancelQueries({ queryKey: ['deal', dealId] });
      const previousDeal = queryClient.getQueryData<Deal>(['deal', dealId]);
      
      if (previousDeal) {
        queryClient.setQueryData(['deal', dealId], {
          ...previousDeal,
          isFavorite
        });
      }
      
      return { previousDeal };
    },
    onSuccess: (_, { isFavorite }) => {
      toast.success(
        isFavorite 
          ? 'Deal added to favorites' 
          : 'Deal removed from favorites'
      );
    },
    onError: (error, { dealId }, context) => {
      if (context?.previousDeal) {
        queryClient.setQueryData(['deal', dealId], context.previousDeal);
      }
      toast.error('Failed to update favorites. Please try again.');
    },
    onSettled: (_, __, { dealId }) => {
      queryClient.invalidateQueries({ queryKey: ['deal', dealId] });
      queryClient.invalidateQueries({ queryKey: ['userFavorites'] });
    },
  });
};

/** Fetch deals by shop */
export const useDealsByShop = (shopId?: string, limit: number = 12) => {
  return useQuery({
    queryKey: ['deals', 'shop', shopId, limit],
    queryFn: () => dealsApi.getShopDeals(shopId!),
    enabled: !!shopId,
    staleTime: 1000 * 60 * 15,
  });
};

/** Fetch deals by category */
export const useDealsByCategory = (categoryId?: string, limit: number = 12) => {
  return useQuery({
    queryKey: ['deals', 'category', categoryId, limit],
    queryFn: () => dealsApi.getCategoryDeals(categoryId!),
    enabled: !!categoryId,
    staleTime: 1000 * 60 * 60,
  });
};

/** Fetch related deals */
export const useRelatedDeals = (dealId?: string, limit: number = 3) => {
  return useQuery({
    queryKey: ['deals', 'related', dealId, limit],
    queryFn: () => dealsApi.getRelatedDeals(dealId!, limit),
    enabled: !!dealId,
    staleTime: 1000 * 60 * 30,
  });
};
