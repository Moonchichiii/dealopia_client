import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useSearchDeals } from '@/hooks/useDeals';
import { useCategories } from '@/hooks/useCategories';
import SearchComponent from '@/components/search/SearchComponent';
import DealsListSection from '@/sections/deals/DealsListSection';
import SearchResultsHeader from '@/components/search/SearchResultsHeader';

const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const searchQuery = searchParams.get('q') || '';
  const categoryId = searchParams.get('category');
  
  // Fetch categories for search filters
  const { data: categories } = useCategories();
  
  // Fetch search results with real API
  const { data: searchResults, isLoading, fetchNextPage, hasNextPage } = useSearchDeals(
    searchQuery,
    categoryId ? Number(categoryId) : undefined
  );
  
  // Handle search
  const handleSearch = (query: string, filters?: Record<string, any>) => {
    const newParams = new URLSearchParams();
    
    if (query) {
      newParams.set('q', query);
    }
    
    if (filters?.categories?.length) {
      newParams.set('category', filters.categories[0].toString());
    }
    
    setSearchParams(newParams);
  };
  
  // Handle back navigation
  const handleBack = () => {
    navigate(-1);
  };
  
  // Get initial filters from URL params
  const initialFilters = {
    categories: categoryId ? [Number(categoryId)] : [],
  };
  
  // Flatten deals from all pages
  const deals = searchResults?.pages.flatMap(page => page.deals) || [];
  const totalResults = searchResults?.pages[0]?.totalResults || 0;

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
            categories={categories || []}
            initialFilters={initialFilters}
          />
        </div>
        
        {/* Search results */}
        {searchQuery ? (
          <>
            <SearchResultsHeader
              query={searchQuery}
              totalResults={totalResults}
              isLoading={isLoading}
            />
            
            <DealsListSection
              deals={deals}
              isLoading={isLoading}
              onLoadMore={() => fetchNextPage()}
              hasMore={!!hasNextPage}
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