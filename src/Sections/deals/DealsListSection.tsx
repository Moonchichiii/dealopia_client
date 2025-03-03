import React from 'react';
import { Deal } from '@/types/deals';
import DealCard from '@/components/ui/DealCard';

interface DealsListSectionProps {
  deals?: Deal[];
  isLoading: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

const DealsListSection: React.FC<DealsListSectionProps> = ({
  deals = [],
  isLoading,
  onLoadMore,
  hasMore = false,
}) => {
  // Render loading state
  if (isLoading && !deals.length) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white/5 rounded-xl p-6 h-80 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Render empty state
  if (!isLoading && !deals.length) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="bg-white/5 rounded-xl p-12 text-center">
            <h3 className="text-2xl font-semibold mb-4">No deals found</h3>
            <p className="text-text-secondary mb-6">
              We couldn't find any deals matching your criteria. Try adjusting your filters or check back later.
            </p>
            <a 
              href="/deals" 
              className="inline-block bg-accent-pink text-white px-6 py-3 rounded-full font-medium hover:bg-accent-pink/90 transition-colors"
            >
              View all deals
            </a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {deals.map((deal) => (
            <DealCard key={deal.id} {...deal} />
          ))}
          
          {/* Loading placeholders when loading more */}
          {isLoading && deals.length > 0 && (
            [...Array(3)].map((_, i) => (
              <div key={`loading-${i}`} className="bg-white/5 rounded-xl p-6 h-80 animate-pulse" />
            ))
          )}
        </div>
        
        {hasMore && (
          <div className="mt-12 text-center">
            <button
              onClick={onLoadMore}
              className="bg-white/10 hover:bg-white/20 transition-colors text-text-primary font-medium px-8 py-3 rounded-full"
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Load More Deals'}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default DealsListSection;