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

const DealsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  const categoryId = searchParams.get('category') || '';
  
  // Fetch categories for filters - Fixed with proper queryFn
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
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
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  // Define the response type for pagination
  type DealsResponse = {
    deals: Deal[];
    currentPage: number;
    totalPages: number;
  };

  // Fetch deals with infinite loading - Fixed with proper queryFn
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ['deals', searchQuery, categoryId],
    queryFn: async ({ pageParam = 1 }) => {
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
      })) as Deal[];
      
      return {
        deals: mockDeals,
        currentPage: pageParam,
        totalPages: 3, // Mock having 3 pages total
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

  // Handle newsletter submission
  const handleNewsletterSubmit = async (email: string): Promise<void> => {
    console.log(`Subscribing ${email} to newsletter`);
    await new Promise(resolve => setTimeout(resolve, 1500));
  };

  return (
    <main className="relative min-h-screen w-full">
      {/* Gradient background filling entire page */}
      <div 
        className="absolute inset-0 -z-10 opacity-[0.3]"
        style={{
          background: 'linear-gradient(135deg, var(--hero-gradient-from), var(--hero-gradient-to))'
        }}
      ></div>
      
      {/* Hero section with search and filters */}
      <div className="py-16 md:py-24 w-full">
        <div className="container mx-auto px-4 max-w-6xl">
          <DealsHeroSection 
            categories={categories} 
            onSearch={handleSearch}
            initialSearchQuery={searchQuery}
          />
        </div>
      </div>
      
      {/* List section title and filter - centralized content */}
      <div className="w-full">
        <div className="container mx-auto px-4 mb-8 max-w-6xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl md:text-3xl font-bold text-white">All Deals</h2>
            <button className="bg-black/20 hover:bg-black/30 text-white px-4 py-2 rounded-full flex items-center gap-2 transition-colors">
              <span>Filter</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Deals list cards in container - centralized content */}
      <div className="w-full">
        <div className="container mx-auto px-4 mb-16 max-w-6xl">
          <DealsListSection 
            deals={deals}
            isLoading={isLoading || isFetchingNextPage}
            onLoadMore={() => fetchNextPage()}
            hasMore={!!hasNextPage}
          />
        </div>
      </div>
      
      {/* Newsletter section - full width but content centralized */}
      <div className="w-full">
        <Suspense fallback={<div className="h-64 flex items-center justify-center">Loading...</div>}>
          <NewsletterSection onSubmit={handleNewsletterSubmit} />
        </Suspense>
      </div>
    </main>
  );
};

export default DealsPage;