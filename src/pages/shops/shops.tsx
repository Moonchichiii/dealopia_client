import React, { lazy, Suspense } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';

// Import essential sections
import ShopsHeroSection from '@/sections/shops/ShopsHeroSection';
import ShopsListSection from '@/sections/shops/ShopsListSection';

// Lazy-load non-critical sections
const NewsletterSection = lazy(() => import('@/sections/common/NewsletterSection'));

// Import types
import { Shop } from '@/types/shops';

// In a real app, import your API services
// import { shopsApi } from '@/services/api/shops';

const ShopsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  
  // Fetch shops with infinite loading
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ['shops', searchQuery],
    queryFn: async ({ pageParam = 1 }) => {
      // In a real app, call your API with pagination
      // return shopsApi.getShops({ 
      //   search: searchQuery,
      //   page: pageParam 
      // });
      
      // Mock data for demonstration
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Generate dynamic mock data based on query params
      const mockShops = Array(6).fill(0).map((_, i) => ({
        id: `shop-${pageParam}-${i}`,
        name: `${searchQuery ? `${searchQuery} Shop` : 'Local Shop'} ${pageParam}-${i}`,
        owner: 1,
        description: 'This is a detailed description of the shop that would explain what they offer, their history, etc.',
        short_description: 'A great local shop with amazing deals.',
        logo: '',
        banner_image: '',
        website: 'https://example.com',
        phone: '+1234567890',
        email: 'contact@example.com',
        categories: [1, 2],
        category_names: ['Retail', 'Fashion'],
        location: 1,
        is_verified: i % 3 === 0,
        is_featured: i % 4 === 0,
        rating: 3.5 + (Math.random() * 1.5),
        opening_hours: {
          monday: '9:00 AM - 5:00 PM',
          tuesday: '9:00 AM - 5:00 PM',
          wednesday: '9:00 AM - 5:00 PM',
          thursday: '9:00 AM - 5:00 PM',
          friday: '9:00 AM - 5:00 PM',
          saturday: '10:00 AM - 4:00 PM',
          sunday: 'Closed'
        },
        deal_count: Math.floor(Math.random() * 10) + 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })) as Shop[];
      
      return {
        shops: mockShops,
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
  
  // Flatten shops from all pages
  const shops = data?.pages.flatMap(page => page.shops) || [];
  
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
      <ShopsHeroSection 
        onSearch={handleSearch}
        initialSearchQuery={searchQuery}
      />
      
      <ShopsListSection 
        shops={shops}
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

export default ShopsPage;