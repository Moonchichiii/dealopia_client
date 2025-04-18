import { useState, useCallback, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { dealService } from '@/api';
import { DealFilters } from '@/types/deals';

const DEBOUNCE_DELAY = 800;
const MIN_SEARCH_LENGTH = 3;
const RATE_LIMIT_DELAY = 800;

export function useSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilters, setSearchFilters] = useState<DealFilters>({});
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [debouncedFilters, setDebouncedFilters] = useState<DealFilters>({});

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastSearchTimeRef = useRef<number>(0);
  const prevFiltersRef = useRef<string>('');
  const isInitialMountRef = useRef(true);

  useEffect(() => {
    if (isInitialMountRef.current && searchQuery === '') {
      isInitialMountRef.current = false;
      return;
    }

    const currentFiltersString = JSON.stringify(searchFilters);

    if (
      prevFiltersRef.current === currentFiltersString &&
      debouncedQuery === searchQuery
    ) {
      return;
    }

    prevFiltersRef.current = currentFiltersString;

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      if (searchQuery.length >= MIN_SEARCH_LENGTH || searchQuery === '') {
        setDebouncedQuery(searchQuery);
        setDebouncedFilters(searchFilters);
      }
    }, DEBOUNCE_DELAY);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchQuery, searchFilters, debouncedQuery]);

  const shouldFetch = debouncedQuery.length >= MIN_SEARCH_LENGTH;

  const { data, isLoading, error } = useQuery({
    queryKey: ['deals', 'search', debouncedQuery, JSON.stringify(debouncedFilters)],
    queryFn: () => dealService.searchDeals(debouncedQuery, debouncedFilters),
    enabled: shouldFetch,
    staleTime: 60 * 1000, // 1 minute
    keepPreviousData: true,
  });

  const handleSearch = useCallback((query: string, filters: DealFilters = {}) => {
    const now = Date.now();

    if (now - lastSearchTimeRef.current < RATE_LIMIT_DELAY) {
      return;
    }

    const filtersString = JSON.stringify(filters);
    if (query === searchQuery && filtersString === JSON.stringify(searchFilters)) {
      return;
    }

    lastSearchTimeRef.current = now;
    setSearchQuery(query);
    setSearchFilters(filters);
  }, [searchQuery, searchFilters]);

  return {
    searchQuery,
    searchFilters,
    results: data?.results ?? [],
    totalResults: data?.count ?? 0,
    isLoading,
    error,
    handleSearch,
  };
}
