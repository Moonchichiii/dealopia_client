import React, { useEffect, useState, lazy, Suspense } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';

// Import essential sections
import DealsHeroSection from '@/sections/deals/DealsHeroSection';
import DealsListSection from '@/sections/deals/DealsListSection';

// Lazy-load non-critical sections
const NewsletterSection = lazy(() => import('@/sections/common/NewsletterSection'));

// Import types
import { Deal } from '@/types/deals';
import { Category } from '@/types/categories';

// In a real app, import your API services
// import { dealsApi } from '@/services/api/deals';
// import { categoriesApi } from '@/services/api/categories';

const DealsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  const categoryId = searchParams.get('category') || '';
  
  // Fetch categories for filters
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      // In a real app, call your API
      // return categoriesApi.getCategories();
      
      // Mock data for demonstration
      await new Promise(resolve => setTimeout(resolve, 500));
      return [
        { id: 1, name: 'Food & Dining' },
        { id: 2, name: 'Fashion' },
        { id: 3, name: 'Wellness' },
        { id: 4, name: 'Books' },
        { id: 5, name: 'Entertainment' }
      ] as Category[];
    },
  });
  
  // Fetch deals with infinite loading
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ['deals', searchQuery, categoryId],
    queryFn: async ({ pageParam = 1 }) => {
      // In a real app, call your API with pagination
      // return dealsApi.getDeals({ 
      //   search: searchQuery, 
      //   category: categoryId, 
      //   page: pageParam 
      // });
      
      // Mock data for demonstration
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Generate dynamic mock data based on query params
      const mockDeals = Array(6).fill(0).map((_, i) => ({
        id: `deal-${pageParam}-${i}`,
        title: `${searchQuery ? `${searchQuery} related deal` : 'Amazing deal'} ${pageParam}-${i}`,
        shop: { 
          name: `Shop ${pageParam}-${i}`, 
          id: `shop-${pageParam}-${i}` 
        },
        description: 'Get amazing discounts on our products.',
        originalPrice: 100,
        discountedPrice: 75,
        discountPercentage: 25,
        categories: categoryId ? [parseInt(categoryId)] : [1, 2],
        is_featured: i % 3 === 0,
        is_exclusive: i % 4 === 0,
        type: i % 3 === 0 ? 'food' : i % 3 === 1 ? 'fashion' : 'wellness',
        icon: i % 3 === 0 ? '🍔' : i % 3 === 1 ? '👕' : '💆',
        tag: i % 3 === 0 ? 'Popular' : i % 3 === 1 ? 'New' : 'Hot',
        views_count: Math.floor(Math.random() * 1000),
        clicks_count: Math.floor(Math.random() * 500),
      })) as unknown as Deal[];
      
      return {
        deals: mockDeals,
        currentPage: pageParam,
        totalPages: 3, // Mock having 3 pages total
      };
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.currentPage < lastPage.totalPages) {
        return lastPage.currentPage + 1;
      }
      return undefined;
    },
  });
  
  // Flatten deals from all pages
  const deals = data?.pages.flatMap(page => page.deals) || [];
  
  // Handle search query change
  const handleSearch = (query: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (query) {
      newParams.set('q', query);
    } else {
      newParams.delete('q');
    }
    setSearchParams(newParams);
  };

  return (
    <main>
      <DealsHeroSection 
        categories={categories} 
        onSearch={handleSearch}
        initialSearchQuery={searchQuery}
      />
      
      <DealsListSection 
        deals={deals}
        isLoading={isLoading || isFetchingNextPage}
        onLoadMore={() => fetchNextPage()}
        hasMore={!!hasNextPage}
      />
      
      <Suspense fallback={<div className="h-64 flex items-center justify-center">Loading...</div>}>
        <NewsletterSection />
      </Suspense>
    </main>
  );
};

export default DealsPage;