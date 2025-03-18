import React, { useState, useEffect } from 'react';
import { Search, Filter, X } from 'lucide-react';

interface SearchComponentProps {
  onSearch: (query: string, filters?: Record<string, any>) => void;
  initialQuery?: string;
  placeholder?: string;
  buttonText?: string;
  className?: string;
  categories?: Array<{ id: number; name: string }>;
  initialFilters?: Record<string, any>;
  showFilterButton?: boolean;
}

const SearchComponent: React.FC<SearchComponentProps> = ({
  onSearch,
  initialQuery = '',
  placeholder = 'Search...',
  buttonText = 'Search',
  className = '',
  categories = [],
  initialFilters = {},
  showFilterButton = true,
}) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>(initialFilters);
  const [selectedCategories, setSelectedCategories] = useState<number[]>(
    initialFilters.categories || []
  );

  // Update local state if initialQuery changes (e.g. from URL params)
  useEffect(() => {
    setSearchQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    setActiveFilters(initialFilters);
    setSelectedCategories(initialFilters.categories || []);
  }, [initialFilters]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Combine search query with active filters
    const filters = {
      ...activeFilters,
      categories: selectedCategories.length > 0 ? selectedCategories : undefined,
    };
    
    onSearch(searchQuery, filters);
  };

  const toggleCategory = (categoryId: number) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setActiveFilters({});
  };

  return (
    <div className={`${className}`}>
      <form 
        onSubmit={handleSearch} 
        className="flex items-center gap-2 p-2 bg-white/5 rounded-full border border-white/10"
      >
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" />
          <input
            type="text"
            placeholder={placeholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border-none pl-12 py-3 focus:outline-none text-text-primary"
          />
        </div>
        
        {showFilterButton && (
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="bg-white/10 hover:bg-white/15 text-white px-4 py-3 rounded-full font-medium transition-colors flex items-center gap-2"
          >
            <Filter size={16} />
            <span className="hidden sm:inline">Filters</span>
            {(selectedCategories.length > 0) && (
              <span className="bg-accent-pink text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {selectedCategories.length}
              </span>
            )}
          </button>
        )}
        
        <button
          type="submit"
          className="bg-accent-pink text-white px-6 py-3 rounded-full font-medium hover:bg-accent-pink/90 transition-colors"
        >
          {buttonText}
        </button>
      </form>
      
      {/* Filter dropdown */}
      {showFilters && (
        <div className="mt-4 p-4 bg-white/5 rounded-xl border border-white/10 animate-fadeIn">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Filters</h3>
            {(selectedCategories.length > 0) && (
              <button 
                onClick={clearFilters}
                className="text-sm text-text-secondary flex items-center gap-1 hover:text-white transition-colors"
              >
                <X size={14} /> Clear all
              </button>
            )}
          </div>
          
          {categories.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm text-text-secondary mb-2">Categories</h4>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => toggleCategory(category.id)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      selectedCategories.includes(category.id)
                        ? 'bg-accent-pink text-white'
                        : 'bg-white/10 text-text-primary hover:bg-white/20'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setShowFilters(false)}
              className="text-sm text-accent-pink hover:text-accent-pink/80 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchComponent;