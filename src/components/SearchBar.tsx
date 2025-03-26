import { useState, useRef } from 'react';
import { Search, Filter, X, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useGeolocation } from '@/hooks/useGeolocation';
import { cn } from '@/utils/cn';

interface SearchBarProps {
  onSearch: (query: string, filters?: Record<string, any>) => void;
  initialQuery?: string;
  className?: string;
  categories?: Array<{ id: number; name: string }>;
  initialFilters?: Record<string, any>;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  initialQuery = '',
  className = '',
  categories = [],
  initialFilters = {},
}) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<number[]>(
    initialFilters.categories || []
  );

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const { latitude, longitude } = useGeolocation();

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    const filters = {
      ...initialFilters,
      categories: selectedCategories,
      ...(latitude && longitude ? { latitude, longitude, radius: 10 } : {}),
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

  return (
    <div className={cn("relative", className)}>
      <form onSubmit={handleSearch} className="relative" ref={searchContainerRef}>
        <div className="flex items-center gap-2 p-2 bg-white/90 dark:bg-black/90 backdrop-blur-sm rounded-full shadow-soft">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder={t('search.placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-none pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500/50 rounded-full text-black dark:text-white"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {latitude && longitude && (
            <button
              type="button"
              onClick={handleSearch}
              className="hidden md:flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white rounded-full transition-colors"
            >
              <MapPin size={18} />
              <span>{t('search.nearMe')}</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "p-2 rounded-full transition-colors",
              showFilters 
                ? "bg-[#8b5cf6] text-white" 
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            )}
            aria-label="Toggle filters"
          >
            <Filter size={20} />
          </button>

          <button
            type="submit"
            className="hidden md:flex items-center justify-center bg-[#8b5cf6] hover:bg-[#7c3aed] text-white px-6 py-2 rounded-full font-medium transition-colors"
          >
            {t('search.button')}
          </button>
        </div>

        {showFilters && (
          <div className="absolute top-full mt-2 w-full bg-white/95 dark:bg-black/95 backdrop-blur-sm rounded-xl shadow-elevation p-4 border border-gray-200 dark:border-gray-800 z-20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-black dark:text-white">{t('search.filters')}</h3>
              {selectedCategories.length > 0 && (
                <button 
                  onClick={() => setSelectedCategories([])}
                  className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  {t('search.clearAll')}
                </button>
              )}
            </div>

            {categories.length > 0 && (
              <div>
                <h4 className="text-sm text-gray-500 dark:text-gray-400 mb-2">{t('search.categories')}</h4>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => toggleCategory(category.id)}
                      className={cn(
                        "px-3 py-1 rounded-full text-sm transition-colors",
                        selectedCategories.includes(category.id)
                          ? "bg-[#8b5cf6] text-white"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                      )}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </form>
    </div>
  );
};

export default SearchBar;