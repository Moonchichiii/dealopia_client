import React from 'react';
import { Filter } from 'lucide-react';

interface SearchResultsHeaderProps {
  query: string;
  totalResults: number;
  isLoading: boolean;
  onFilterClick?: () => void;
}

const SearchResultsHeader: React.FC<SearchResultsHeaderProps> = ({
  query,
  totalResults,
  isLoading,
  onFilterClick
}) => {
  return (
    <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
      <div>
        <h2 className="text-xl font-semibold mb-1">
          {isLoading
            ? 'Searching...'
            : totalResults > 0
              ? `Results for "${query}"`
              : `No results for "${query}"`
          }
        </h2>
        {totalResults > 0 && !isLoading && (
          <p className="text-text-secondary">
            Found {totalResults} matching {totalResults === 1 ? 'deal' : 'deals'}
          </p>
        )}
      </div>
      
      {totalResults > 0 && !isLoading && onFilterClick && (
        <button 
          onClick={onFilterClick}
          className="bg-white/5 hover:bg-white/10 transition-colors text-text-primary px-4 py-2 rounded-full flex items-center gap-2"
        >
          <Filter size={16} />
          <span>Filter</span>
        </button>
      )}
    </div>
  );
};

export default SearchResultsHeader;