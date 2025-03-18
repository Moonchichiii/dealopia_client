import React from 'react';
import { Category } from '@/types/categories';
import SearchComponent from '@/components/search/SearchComponent';

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
          
          {/* Using our reusable search component */}
          <SearchComponent
            onSearch={onSearch || (() => {})}
            initialQuery={initialSearchQuery}
            placeholder="Search for deals..."
            className="mb-8"
          />
          
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