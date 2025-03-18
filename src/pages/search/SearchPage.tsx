import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';

// Import components
import SearchComponent from '@/components/SearchComponent';
import DealsListSection from '@/sections/deals/DealsListSection';

// Import types
import { Deal } from '@/types/deals';

const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const searchQuery = searchParams.get('q') || '';
  
  // Fetch search results
  const { data: searchResults, isLoading } = useQuery({
    queryKey: ['search', searchQuery],
    queryFn: async () => {
      if (!searchQuery) return { deals: [], total: 0 };
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Generate mock search results
      const mockResults = Array(searchQuery.length > 3 ? 6 : 2).fill(0).map((_, i) => ({
        id: `search-${i}`,
        title: `${searchQuery} Deal ${i + 1}`,
        shop: { 
          name: `Shop ${i}`, 
          id: `shop-${i}` 
        },
        description: `Great deal related to "${searchQuery}". Limited time offer.`,
        originalPrice: 100 + (i * 10),
        discountedPrice: 75 + (i * 5),
        discountPercentage: 25,
        is_featured: i % 3 === 0,
        is_exclusive: i % 4 === 0,
        type: i % 3 === 0 ? 'food' : i % 3 === 1 ? 'fashion' : 'wellness',
        icon: i % 3 === 0 ? '🍔' : i % 3 === 1 ? '👕' : '💆',
        tag: i % 3 === 0 ? 'Popular' : i % 3 === 1 ? 'New' : 'Hot',
        views_count: Math.floor(Math.random() * 1000),
        clicks_count: Math.floor(Math.random() * 500),
      })) as Deal[];
      
      return { 
        deals: mockResults,
        total: mockResults.length
      };
    },
    enabled: !!searchQuery,
  });

  // Handle search
  const handleSearch = (query: string) => {
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  // Handle back navigation
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header with back button */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={handleBack}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold">Search</h1>
        </div>
        
        {/* Search component */}
        <div className="mb-12">
          <SearchComponent
            onSearch={handleSearch}
            initialQuery={searchQuery}
            placeholder="Search for deals, shops, categories..."
          />
        </div>
        
        {/* Search results */}
        {searchQuery ? (
          <>
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-2">
                {isLoading
                  ? 'Searching...'
                  : searchResults?.deals.length
                    ? `Results for "${searchQuery}"`
                    : `No results for "${searchQuery}"`
                }
              </h2>
              {searchResults?.total > 0 && (
                <p className="text-text-secondary">
                  Found {searchResults.total} matching deals
                </p>
              )}
            </div>
            
            <DealsListSection
              deals={searchResults?.deals || []}
              isLoading={isLoading}
              hasMore={false}
            />
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-6">🔍</div>
            <h2 className="text-2xl font-semibold mb-4">Search for deals</h2>
            <p className="text-text-secondary max-w-lg mx-auto">
              Enter keywords above to search for deals, shops, or categories. 
              Discover exclusive discounts and special offers from your favorite local businesses.
            </p>
          </div>
        )}
      </div>
    </main>
  );
};

export default SearchPage;