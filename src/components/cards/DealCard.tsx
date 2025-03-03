import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface Shop {
  name: string;
}

interface DealCardProps {
  id: string | number;
  title: string;
  description?: string;
  shop?: Shop;
  originalPrice?: number;
  discountedPrice?: number;
  discountPercentage?: number;
  type?: 'default' | 'coffee' | 'yoga' | 'wellness' | 'book' | 'fashion';
  icon?: React.ReactNode;
  tag?: string;
  isExclusive?: boolean;
}

const DealCard: React.FC<DealCardProps> = ({
  id,
  title,
  description,
  shop = { name: 'Local Shop' },
  originalPrice,
  discountedPrice,
  discountPercentage,
  type = 'default',
  icon,
  tag,
  isExclusive = false,
}) => {
  // Generate icon background color based on deal type
  const getIconClass = () => {
    switch (type) {
      case 'coffee':
        return 'bg-accent-yellow text-bg-primary';
      case 'yoga':
      case 'wellness':
        return 'bg-accent-green text-bg-primary';
      case 'book':
        return 'bg-accent-blue text-bg-primary';
      case 'fashion':
        return 'bg-accent-pink text-white';
      default:
        return 'bg-accent-pink text-white';
    }
  };

  // Calculate discount percentage if not provided but prices are available
  const calculatedDiscount = discountPercentage || (originalPrice && discountedPrice
    ? Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)
    : null);

  return (
    <div className="p-6 border-t border-white/5 relative group hover:bg-white/[0.02] transition-colors rounded-md">
      {isExclusive && (
        <div className="absolute top-6 right-0 font-semibold text-sm text-accent-pink">
          Exclusive
        </div>
      )}
      
      {tag && (
        <div className="absolute top-6 right-0 font-semibold text-sm text-accent-pink">
          {tag}
        </div>
      )}
      
      <div className="flex gap-4 mb-4">
        <div className={`w-12 h-12 ${getIconClass()} rounded-md flex items-center justify-center text-2xl flex-shrink-0`}>
          {icon || (
            type === 'coffee' ? '☕' :
            type === 'yoga' ? '🧘' :
            type === 'book' ? '📚' :
            type === 'fashion' ? '👗' : '🛍️'
          )}
        </div>
        
        <div>
          <div className="text-text-secondary text-sm mb-1">{shop.name}</div>
          <h3 className="text-xl font-semibold text-text-primary mb-2 leading-snug">{title}</h3>
        </div>
      </div>
      
      {description && (
        <p className="text-text-secondary mb-4 text-base">{description}</p>
      )}
      
      <div className="flex justify-between items-center">
        <Link 
          to={`/deals/${id}`}
          className="inline-flex items-center gap-1 text-text-primary font-semibold text-sm group-hover:text-accent-pink transition-colors"
        >
          View Deal <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
};

export default DealCard;