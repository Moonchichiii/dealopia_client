import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Tag } from 'lucide-react';
import { Shop } from '@/types/shops';
import { cn } from '@/utils/cn';
import OptimizedImage from '../ui/OptimizedImage';

interface ShopCardProps {
  shop: Shop;
  className?: string;
  showDistance?: boolean;
  featured?: boolean;
  showBanner?: boolean;
}

const ShopCard: React.FC<ShopCardProps> = ({
  shop,
  className = '',
  showDistance = false,
  featured = false,
  showBanner = true,
}) => {
  // Get initials from shop name
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Helper function to get a deterministic color based on the shop name
  const getColorClass = (shopId: string | number): 'pink' | 'green' | 'blue' | 'yellow' => {
    const colors: Array<'pink' | 'green' | 'blue' | 'yellow'> = ['pink', 'green', 'blue', 'yellow'];
    const index = typeof shopId === 'string'
      ? shopId.charCodeAt(0) % colors.length
      : Number(shopId) % colors.length;
    return colors[index];
  };

  // Get the appropriate color class based on color type
  const getInitialsColorClass = (color: 'pink' | 'green' | 'blue' | 'yellow'): string => {
    const colors: Record<string, string> = {
      pink: 'bg-accent-pink text-white',
      green: 'bg-accent-green text-bg-primary',
      blue: 'bg-accent-blue text-bg-primary',
      yellow: 'bg-accent-yellow text-bg-primary',
    };
    return colors[color] || colors.pink;
  };

  // Get color type for the shop
  const colorType = getColorClass(shop.id);
  const initials = getInitials(shop.name);

  return (
    <Link
      to={`/shops/${shop.id}`}
      className={cn(
        "transition-transform hover:-translate-y-2 duration-300 block h-full",
        className
      )}
    >
      <div className="h-full bg-white/[0.03] backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden flex flex-col">
        {/* Shop banner/header - only if showBanner is true */}
        {showBanner && (
          <div className="h-32 bg-gradient-to-r from-accent-pink/20 to-accent-blue/20 relative">
            {shop.banner_image ? (
              <OptimizedImage
                src={shop.banner_image}
                alt={shop.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center opacity-30">
                <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="text-3xl">{initials}</span>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Shop details */}
        <div className="p-5 flex-grow flex flex-col">
          <div className="flex gap-3 mb-3">
            {/* Shop logo or initials */}
            {shop.logo ? (
              <OptimizedImage 
                src={shop.logo_url || shop.logo} 
                alt={shop.name} 
                className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
              />
            ) : (
              <div className={`w-12 h-12 ${getInitialsColorClass(colorType)} rounded-lg flex items-center justify-center font-bold text-lg flex-shrink-0`}>
                {initials}
              </div>
            )}

            <div className="min-w-0">
              <h3 className="font-semibold text-lg leading-tight truncate">{shop.name}</h3>
              <div className="text-xs text-text-secondary truncate">
                {shop.category_names?.join(', ') || 'Local Business'}
              </div>
              
              {/* Rating */}
              <div className="flex items-center mt-1">
                <div className="flex items-center text-accent-yellow">
                  <Star className="w-4 h-4 mr-1 fill-accent-yellow" />
                  <span>{shop.rating?.toFixed(1) || '0.0'}</span>
                </div>
                
                {/* Show distance if available and requested */}
                {showDistance && shop.distance && (
                  <div className="ml-3 text-xs text-text-secondary flex items-center">
                    <MapPin className="w-3 h-3 mr-1" />
                    {shop.distance} km
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Shop description */}
          <p className="text-text-secondary text-sm flex-grow mb-4 line-clamp-2">
            {shop.short_description || shop.description || 'No description available.'}
          </p>

          {/* Shop status indicators */}
          <div className="flex flex-wrap gap-2 mb-4">
            {shop.is_verified && (
              <span className="text-xs px-2 py-1 bg-accent-blue/20 text-accent-blue rounded-full">
                Verified
              </span>
            )}
            
            {(featured || shop.is_featured) && (
              <span className="text-xs px-2 py-1 bg-accent-yellow/20 text-accent-yellow rounded-full">
                Featured
              </span>
            )}
          </div>

          {/* Shop metrics */}
          <div className="flex justify-between items-center text-sm mt-auto">
            <span className="text-accent-pink font-semibold flex items-center gap-1">
              <Tag className="w-4 h-4" />
              {shop.deal_count || 0} Active Deals
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ShopCard;