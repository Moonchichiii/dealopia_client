import React, { lazy, Suspense } from 'react';
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
  
  // Fetch categories for filters
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
  
  // Handle search query and filter changes
  const handleSearch = (query: string, filters?: Record<string, any>) => {
    const newParams = new URLSearchParams(searchParams);
    
    // Update search query
    if (query) {
      newParams.set('q', query);
    } else {
      newParams.delete('q');
    }
    
    // Update category filter
    if (filters?.categories?.length) {
      newParams.set('category', filters.categories[0].toString());
    } else {
      newParams.delete('category');
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
      {/* Gradient background */}
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
      
      {/* List section title */}
      <div className="w-full">
        <div className="container mx-auto px-4 mb-8 max-w-6xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              {searchQuery ? `Results for "${searchQuery}"` : "All Deals"}
            </h2>
            {deals.length > 0 && (
              <div className="text-text-secondary">
                {deals.length} {deals.length === 1 ? 'deal' : 'deals'} found
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Deals list section */}
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
      
      {/* Newsletter section */}
      <div className="w-full">
        <Suspense fallback={<div className="h-64 flex items-center justify-center">Loading...</div>}>
          <NewsletterSection onSubmit={handleNewsletterSubmit} />
        </Suspense>
      </div>
    </main>
  );
};

export default DealsPage;