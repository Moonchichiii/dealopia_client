import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Tag } from 'lucide-react';
import { Shop } from '@/types/shops';
import { cn } from '@/utils/cn';

interface ShopCardProps {
  shop: Shop;
  className?: string;
  showDistance?: boolean;
  featured?: boolean;
}

export const ShopCard: React.FC<ShopCardProps> = ({
  shop,
  className = '',
  showDistance = false,
  featured = false,
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
      <div className="h-full bg-white/[0.03] backdrop-blur-md border border-white/5 rounded-2xl p-6 flex flex-col">
        {/* Shop header with logo/initials and name */}
        <div className="flex gap-5 mb-3">
          {shop.logo ? (
            <img 
              src={shop.logo_url || shop.logo} 
              alt={shop.name} 
              className="w-16 h-16 rounded-2xl object-cover flex-shrink-0"
            />
          ) : (
            <div className={`w-16 h-16 ${getInitialsColorClass(colorType)} rounded-2xl flex items-center justify-center font-bold text-xl flex-shrink-0`}>
              {initials}
            </div>
          )}

          <div className="min-w-0">
            <h3 className="text-xl font-semibold mb-1 truncate">{shop.name}</h3>
            <div className="text-sm text-text-secondary mb-1 truncate">
              {shop.category_names?.join(', ') || 'General'}
            </div>
            
            {/* Rating */}
            <div className="flex items-center">
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
        <p className="text-text-secondary text-sm flex-grow mb-4 line-clamp-3">
          {shop.short_description || shop.description || 'No description available.'}
        </p>

        {/* Shop status indicators */}
        <div className="flex flex-wrap gap-2 mb-4">
          {shop.is_verified && (
            <span className="text-xs px-2 py-1 bg-accent-blue/20 text-accent-blue rounded-full">
              Verified
            </span>
          )}
          
          {featured && (
            <span className="text-xs px-2 py-1 bg-accent-yellow/20 text-accent-yellow rounded-full">
              Featured
            </span>
          )}
          
          {shop.is_featured && !featured && (
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
    </Link>
  );
};

export default ShopCard;