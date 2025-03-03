import React from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { Shop } from '@/types/shops';
import { FeaturedShop } from '@/types/home';

interface ShopsListSectionProps {
  shops?: Shop[];
  isLoading: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

const ShopsListSection: React.FC<ShopsListSectionProps> = ({
  shops = [],
  isLoading,
  onLoadMore,
  hasMore = false,
}) => {
  // Helper function to get color class based on initials (for demo)
  const getRandomColorClass = (id: string | number): 'pink' | 'green' | 'blue' | 'yellow' => {
    const colors: Array<'pink' | 'green' | 'blue' | 'yellow'> = ['pink', 'green', 'blue', 'yellow'];
    const index = typeof id === 'string' 
      ? id.charCodeAt(0) % colors.length 
      : id % colors.length;
    return colors[index];
  };

  const getInitialsColorClass = (color: 'pink' | 'green' | 'blue' | 'yellow'): string => {
    const colors: Record<string, string> = {
      pink: 'bg-accent-pink text-white',
      green: 'bg-accent-green text-bg-primary',
      blue: 'bg-accent-blue text-bg-primary',
      yellow: 'bg-accent-yellow text-bg-primary',
    };
    return colors[color] || colors.pink;
  };

  // Get shop initials from name
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Render loading state
  if (isLoading && !shops.length) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white/5 rounded-xl p-6 h-64 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Render empty state
  if (!isLoading && !shops.length) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="bg-white/5 rounded-xl p-12 text-center">
            <h3 className="text-2xl font-semibold mb-4">No shops found</h3>
            <p className="text-text-secondary mb-6">
              We couldn't find any shops matching your criteria. Try adjusting your search or check back later.
            </p>
            <a 
              href="/shops" 
              className="inline-block bg-accent-pink text-white px-6 py-3 rounded-full font-medium hover:bg-accent-pink/90 transition-colors"
            >
              View all shops
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
          {shops.map((shop) => {
            const colorType = getRandomColorClass(shop.id);
            const initials = getInitials(shop.name);
            
            return (
              <Link
                key={shop.id}
                to={`/shops/${shop.id}`}
                className="transition-transform hover:-translate-y-2 duration-300"
              >
                <div className="h-full bg-white/[0.03] backdrop-blur-md border border-white/5 rounded-2xl p-6 flex flex-col">
                  <div className="flex gap-5 mb-3">
                    <div className={`w-16 h-16 ${getInitialsColorClass(colorType)} rounded-2xl flex items-center justify-center font-bold text-xl flex-shrink-0`}>
                      {initials}
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold mb-1">{shop.name}</h3>
                      <div className="text-sm text-text-secondary mb-1">
                        {shop.category_names?.join(', ') || 'General'}
                      </div>
                    </div>
                  </div>

                  <p className="text-text-secondary text-sm flex-grow mb-4">
                    {shop.description || shop.short_description}
                  </p>

                  <div className="flex justify-between items-center text-sm mt-auto">
                    <span className="text-accent-pink font-semibold">
                      {shop.deal_count || 0} Active Deals
                    </span>

                    <span className="flex items-center text-accent-yellow">
                      <Star className="w-4 h-4 mr-1 fill-accent-yellow" />
                      {shop.rating?.toFixed(1) || '0.0'}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
          
          {/* Loading placeholders when loading more */}
          {isLoading && shops.length > 0 && (
            [...Array(3)].map((_, i) => (
              <div key={`loading-${i}`} className="bg-white/5 rounded-xl p-6 h-64 animate-pulse" />
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
              {isLoading ? 'Loading...' : 'Load More Shops'}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ShopsListSection;