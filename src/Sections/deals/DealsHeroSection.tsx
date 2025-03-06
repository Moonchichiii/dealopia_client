import React from 'react';
import { Search } from 'lucide-react';
import { Category } from '@/types/categories';

interface DealsHeroSectionProps {
  categories?: Category[];
  onSearch?: (query: string) => void;
  initialSearchQuery?: string;
}

const DealsHeroSection: React.FC<DealsHeroSectionProps> = ({
  categories = [],
  onSearch,
  initialSearchQuery = '',
}) => {
  const [searchQuery, setSearchQuery] = React.useState(initialSearchQuery);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  return (
    <section className="pt-32 pb-16">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Discover Amazing Deals
          </h1>
          <p className="text-lg text-text-secondary mb-8">
            Find exclusive discounts from the best local shops and save money while supporting your community
          </p>

          <form onSubmit={handleSearch} className="flex items-center gap-2 p-2 bg-white/5 rounded-full border border-white/10 mb-8">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" />
              <input
                type="text"
                placeholder="Search for deals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-none pl-12 py-3 focus:outline-none text-text-primary"
              />
            </div>
            <button 
              type="submit"
              className="bg-accent-pink text-white px-6 py-3 rounded-full font-medium hover:bg-accent-pink/90 transition-colors"
            >
              Search
            </button>
          </form>

          {categories.length > 0 && (
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((category) => (
                <a
                  key={category.id}
                  href={`/deals?category=${category.id}`}
                  className="px-4 py-2 bg-white/5 rounded-full text-sm font-medium hover:bg-white/10 transition-colors"
                >
                  {category.name}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default DealsHeroSection;