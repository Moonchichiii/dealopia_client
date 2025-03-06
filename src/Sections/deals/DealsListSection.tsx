import React, { useEffect, useState, useRef } from 'react';
import { useInfiniteDeals } from '@/hooks/useDeals';
import { useInView } from 'react-intersection-observer';
import { Deal, DealFilters } from '@/types/deals';
import DealCard from '@/components/cards/DealCard';
import { cn } from '@/utils/cn';

interface DealsListSectionProps {
  deals?: Deal[];
  isLoading: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
  filters?: DealFilters;
  className?: string;
}

const DealsListSection: React.FC<DealsListSectionProps> = ({
  deals = [],
  isLoading,
  onLoadMore,
  hasMore = false,
  filters,
  className = ''
}) => {
  // Setup intersection observer for infinite loading
  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });

  // Call onLoadMore when the load more trigger element is visible
  useEffect(() => {
    if (inView && hasMore && onLoadMore && !isLoading) {
      onLoadMore();
    }
  }, [inView, hasMore, onLoadMore, isLoading]);

  // Render loading state
  if (isLoading && !deals.length) {
    return (
      <section className={cn("py-12", className)}>
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
      <section className={cn("py-12", className)}>
        <div className="container mx-auto px-4">
          <div className="bg-white/5 rounded-xl p-12 text-center">
            <h3 className="text-2xl font-semibold mb-4">No deals found</h3>
            <p className="text-text-secondary mb-6">
              {filters && Object.keys(filters).length > 0 
                ? "We couldn't find any deals matching your criteria. Try adjusting your filters or check back later."
                : "No deals are available at the moment. Please check back soon for new offers."}
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
    <section className={cn("py-12", className)}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {deals.map((deal) => (
            <DealCard key={deal.id} deal={deal} />
          ))}
          
          {/* Loading placeholders when loading more */}
          {isLoading && deals.length > 0 && (
            [...Array(3)].map((_, i) => (
              <div key={`loading-${i}`} className="bg-white/5 rounded-xl p-6 h-80 animate-pulse" />
            ))
          )}
        </div>
        
        {hasMore && (
          <div ref={loadMoreRef} className="mt-12 text-center">
            <button
              onClick={onLoadMore}
              className="bg-white/10 hover:bg-white/20 transition-colors text-text-primary font-medium px-8 py-3 rounded-full"
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Load More Deals'}
            </button>
          </div>
        )}
        
        {!hasMore && deals.length > 0 && (
          <div className="mt-12 text-center text-text-secondary">
            You've reached the end of the results.
          </div>
        )}
      </div>
    </section>
  );
};

export default DealsListSection;