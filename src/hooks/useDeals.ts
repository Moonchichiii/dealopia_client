import { 
    useQuery, 
    useInfiniteQuery, 
    useMutation, 
    useQueryClient 
  } from '@tanstack/react-query';
  import { dealsApi } from '@/services/api/deals';
  import { Deal, DealParams } from '@/types/deal';
  import { toast } from 'react-toastify';
  
  /**
   * Hook for fetching a paginated list of deals with filters
   */
  export const useDeals = (params?: DealParams) => {
    return useQuery({
      queryKey: ['deals', params],
      queryFn: () => dealsApi.getDeals(params),
      keepPreviousData: true,
    });
  };
  
  /**
   * Hook for fetching an infinite scrolling list of deals
   */
  export const useInfiniteDeals = (params?: DealParams) => {
    return useInfiniteQuery({
      queryKey: ['infiniteDeals', params],
      queryFn: ({ pageParam = 1 }) => 
        dealsApi.getDeals({ ...params, page: pageParam }),
      getNextPageParam: (lastPage) => 
        lastPage.next ? lastPage.page + 1 : undefined,
    });
  };
  
  /**
   * Hook for fetching a single deal by ID
   */
  export const useDeal = (id?: string) => {
    return useQuery({
      queryKey: ['deal', id],
      queryFn: () => dealsApi.getDealById(id!),
      enabled: !!id,
    });
  };
  
  /**
   * Hook for fetching featured deals for homepage
   */
  export const useFeaturedDeals = () => {
    return useQuery({
      queryKey: ['featuredDeals'],
      queryFn: dealsApi.getFeaturedDeals,
    });
  };
  
  /**
   * Hook for fetching deals near user's location
   */
  export const useNearbyDeals = (
    latitude?: number, 
    longitude?: number, 
    radius?: number
  ) => {
    return useQuery({
      queryKey: ['nearbyDeals', latitude, longitude, radius],
      queryFn: () => dealsApi.getNearbyDeals(latitude!, longitude!, radius),
      enabled: !!latitude && !!longitude,
    });
  };
  
  /**
   * Hook for searching deals
   */
  export const useSearchDeals = (query: string) => {
    return useQuery({
      queryKey: ['searchDeals', query],
      queryFn: () => dealsApi.searchDeals(query),
      enabled: query.length > 2, // Only search when query is at least 3 characters
    });
  };
  
  /**
   * Hook for toggling deal favorite status
   */
  export const useToggleDealFavorite = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
      mutationFn: ({ dealId, isFavorite }: { dealId: string; isFavorite: boolean }) => 
        dealsApi.toggleFavorite(dealId, isFavorite),
      onMutate: async ({ dealId, isFavorite }) => {
        // Cancel any outgoing refetches so they don't overwrite our optimistic update
        await queryClient.cancelQueries({ queryKey: ['deal', dealId] });
        
        // Snapshot the previous value
        const previousDeal = queryClient.getQueryData<Deal>(['deal', dealId]);
        
        // Optimistically update to the new value
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
        // Rollback to the previous value if there was an error
        if (context?.previousDeal) {
          queryClient.setQueryData(['deal', dealId], context.previousDeal);
        }
        toast.error('Failed to update favorites. Please try again.');
      },
      onSettled: (_, __, { dealId }) => {
        // Refetch after error or success to make sure our data is correct
        queryClient.invalidateQueries({ queryKey: ['deal', dealId] });
        queryClient.invalidateQueries({ queryKey: ['userFavorites'] });
      },
    });
  };
  
  /**
   * Hook for fetching deals by shop ID
   */
  export const useDealsByShop = (shopId?: string, params?: DealParams) => {
    return useQuery({
      queryKey: ['shopDeals', shopId, params],
      queryFn: () => dealsApi.getDealsByShop(shopId!, params),
      enabled: !!shopId,
    });
  };
  
  /**
   * Hook for fetching deals by category ID
   */
  export const useDealsByCategory = (categoryId?: string, params?: DealParams) => {
    return useQuery({
      queryKey: ['categoryDeals', categoryId, params],
      queryFn: () => dealsApi.getDealsByCategory(categoryId!, params),
      enabled: !!categoryId,
    });
  };