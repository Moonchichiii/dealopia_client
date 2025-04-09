import { useState, useCallback, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { dealService } from '@/api/services';
import { DealFilters } from '@/types/deals';

// Define constants
const DEBOUNCE_DELAY = 800; // Increased debounce delay
const MIN_SEARCH_LENGTH = 3;

/**
 * Custom hook for search functionality with optimized querying
 */
export function useSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilters, setSearchFilters] = useState<DealFilters>({});
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [debouncedFilters, setDebouncedFilters] = useState<DealFilters>({});
  
  // Track if this is the first render to prevent initial API call
  const isFirstSearchRef = useRef(true);
  // Track debounce timer
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  // Track last search timestamp to prevent rapid searches
  const lastSearchTimeRef = useRef<number>(0);
  // Track previous filters for deep comparison
  const prevFiltersRef = useRef<string>('');

  // Effect to debounce search inputs
  useEffect(() => {
    // Skip debounce for empty query on first load
    if (isFirstSearchRef.current && searchQuery === '') {
      isFirstSearchRef.current = false;
      return;
    }
    
    // Stringify filters for comparison
    const currentFiltersString = JSON.stringify(searchFilters);
    
    // Skip if filters haven't changed and query is the same
    if (
      prevFiltersRef.current === currentFiltersString &&
      debouncedQuery === searchQuery
    ) {
      return;
    }
    
    // Update previous filters ref
    prevFiltersRef.current = currentFiltersString;
    
    // Clear any existing debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    // Set a new debounce timer
    debounceTimerRef.current = setTimeout(() => {
      // Only update if query meets minimum length or is empty (to clear results)
      if (searchQuery.length >= MIN_SEARCH_LENGTH || searchQuery === '') {
        setDebouncedQuery(searchQuery);
        setDebouncedFilters(searchFilters);
      }
    }, DEBOUNCE_DELAY);
    
    // Cleanup on unmount
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchQuery, searchFilters, debouncedQuery]);

  // Only fetch when we have debounced values
  const shouldFetch = debouncedQuery.length >= MIN_SEARCH_LENGTH;
  
  // Query for search results
  const { data, isLoading, error } = useQuery({
    queryKey: ['deals', 'search', debouncedQuery, JSON.stringify(debouncedFilters)],
    queryFn: () => dealService.searchDeals(debouncedQuery, debouncedFilters),
    enabled: shouldFetch,
    staleTime: 60 * 1000, // Cache results for 1 minute
    keepPreviousData: true, // Keep previous results while loading new ones
  });

  // Optimize the search handler to prevent excessive state updates
  const handleSearch = useCallback((query: string, filters: DealFilters = {}) => {
    const now = Date.now();
    
    // Rate limiting - prevent searches more frequently than every 800ms
    if (now - lastSearchTimeRef.current < 800) {
      return;
    }
    
    // Skip updates if nothing changed
    const filtersString = JSON.stringify(filters);
    if (query === searchQuery && filtersString === JSON.stringify(searchFilters)) {
      return;
    }
    
    lastSearchTimeRef.current = now;
    setSearchQuery(query);
    setSearchFilters(filters);
    
    console.log('Search initiated:', query, filters);
  }, [searchQuery, searchFilters]);

  return {
    searchQuery,
    searchFilters,
    results: data?.results || [],
    totalResults: data?.count || 0,
    isLoading,
    error,
    handleSearch
  };
}

export default useSearch;