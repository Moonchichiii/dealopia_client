import React, { useState, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HeaderSearchProps {
  className?: string;
}

const HeaderSearch: React.FC<HeaderSearchProps> = ({ className = '' }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleToggleSearch = () => {
    setIsExpanded(!isExpanded);
    // Focus the input when expanded
    if (!isExpanded && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/deals?search=${encodeURIComponent(searchValue.trim())}`);
      setSearchValue('');
      setIsExpanded(false);
    }
  };

  // Determine if we're in mobile view by checking class name
  const isMobileView = className.includes('w-full');

  return (
    <div className={`relative ${className}`}>
      {!isExpanded ? (
        <button
          onClick={handleToggleSearch}
          className={`text-[color:var(--color-text-primary)] p-2 rounded-full hover:bg-white/5 transition-colors ${isMobileView ? 'w-full flex items-center justify-between bg-white/5 py-3 px-4' : ''}`}
          aria-label="Open search"
        >
          {isMobileView ? (
            <>
              <span className="text-[color:var(--color-text-secondary)]">Search deals...</span>
              <Search size={20} />
            </>
          ) : (
            <Search size={20} />
          )}
        </button>
      ) : (
        <form onSubmit={handleSearch} className={`flex items-center ${isMobileView ? 'w-full' : ''}`}>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search deals..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className={`bg-transparent border-b border-[color:var(--color-text-secondary)] focus:border-[color:var(--color-accent-pink)] outline-none py-2 px-2 text-[color:var(--color-text-primary)] placeholder:text-[color:var(--color-text-secondary)] ${isMobileView ? 'w-full' : 'w-40 md:w-60'}`}
          />
          <button
            type="button"
            onClick={handleToggleSearch}
            className="ml-2 text-[color:var(--color-text-primary)]"
            aria-label="Close search"
          >
            <X size={20} />
          </button>
        </form>
      )}
    </div>
  );
};

export default HeaderSearch;