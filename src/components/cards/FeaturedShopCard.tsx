import React from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { FeaturedShop } from '@/types/home';

interface FeaturedShopCardProps {
  shop: FeaturedShop;
}

export const FeaturedShopCard: React.FC<FeaturedShopCardProps> = ({ shop }) => {
  const getInitialsColorClass = (color: FeaturedShop['initialsColor']): string => {
    const colors: Record<string, string> = {
      pink: 'bg-accent-pink text-white',
      green: 'bg-accent-green text-bg-primary',
      blue: 'bg-accent-blue text-bg-primary',
      yellow: 'bg-accent-yellow text-bg-primary',
    };

    return colors[color] || colors.pink;
  };

  return (
    <Link
      to={`/shops/${shop.id}`}
      className="transition-transform hover:-translate-y-2 duration-300"
    >
      <div className="h-full bg-white/[0.03] backdrop-blur-md border border-white/5 rounded-2xl p-6 flex flex-col">
        <div className="flex gap-5 mb-3">
          <div className={`w-16 h-16 ${getInitialsColorClass(shop.initialsColor)} rounded-2xl flex items-center justify-center font-bold text-xl flex-shrink-0`}>
            {shop.initials}
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-1">{shop.name}</h3>
            <div className="text-sm text-text-secondary mb-1">{shop.category}</div>
          </div>
        </div>

        <p className="text-text-secondary text-sm flex-grow mb-4">
          {shop.description}
        </p>

        <div className="flex justify-between items-center text-sm mt-auto">
          <span className="text-accent-pink font-semibold">
            {shop.activeDeals} Active Deals
          </span>

          <span className="flex items-center text-accent-yellow">
            <Star className="w-4 h-4 mr-1 fill-accent-yellow" />
            {shop.rating.toFixed(1)}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default FeaturedShopCard;