import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { Deal } from '@/types/deals';
import { cn } from '@/utils/cn';
import OptimizedImage from '@/components/ui/OptimizedImage';

interface DealCardProps {
  deal?: Deal;
  className?: string;
  showShop?: boolean;
  compact?: boolean;
}

const DealCard: React.FC<DealCardProps> = ({
  deal,
  className = '',
  showShop = true,
  compact = false
}) => {
  // Return null if no deal is provided
  if (!deal) {
    return null;
  }

  // Get appropriate icon emoji based on category
  const getIconEmoji = () => {
    const categoryName = deal.category_names?.[0]?.toLowerCase() || '';
    
    if (categoryName.includes('food') || categoryName.includes('dining') || categoryName.includes('restaurant')) {
      return '🍔';
    } else if (categoryName.includes('coffee') || categoryName.includes('cafe')) {
      return '☕';
    } else if (categoryName.includes('fashion') || categoryName.includes('clothing')) {
      return '👕';
    } else if (categoryName.includes('wellness') || categoryName.includes('spa')) {
      return '💆';
    } else if (categoryName.includes('book')) {
      return '📚';
    } else if (categoryName.includes('entertainment')) {
      return '🎬';
    }
    
    return '🏷️'; // Default tag emoji
  };

  // Helper to get deal discount text
  const getDiscountText = () => {
    if (deal.discount_percentage) {
      return `${deal.discount_percentage}% OFF`;
    }
    
    if (deal.original_price && deal.discounted_price) {
      const savings = deal.original_price - deal.discounted_price;
      return `Save ${formatCurrency(savings)}`;
    }
    
    return 'Special Deal';
  };

  // Render a compact version for related deals sections
  if (compact) {
    return (
      <Link 
        to={`/deals/${deal.id}`}
        className={cn(
          "block p-4 rounded-lg bg-white/[0.03] border border-white/10 hover:bg-white/[0.05] transition-all",
          className
        )}
      >
        <div>
          {deal.time_left && (
            <div className="text-xs text-text-secondary flex items-center gap-1">
              <Clock size={12} />
              {deal.time_left}
            </div>
          )}
          <h2 className="font-semibold text-text-primary truncate">{deal.title}</h2>
          
          <div className="flex justify-between items-center mt-2">
            <div className="text-accent-pink font-bold">{getDiscountText()}</div>
            {deal.views_count !== undefined && (
              <span className="text-xs text-text-secondary">
                {deal.views_count} views
              </span>
            )}
          </div>
        </div>
      </Link>
    );
  }
  
  // Full card view (modern image-based design)
  return (
    <Link to={`/deals/${deal.id}`} className={cn("group", className)}>
      <div className="bg-white/5 rounded-xl overflow-hidden transition-all duration-300 group-hover:bg-white/10 h-full flex flex-col">
        {/* Card image */}
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          {deal.image ? (
            <OptimizedImage 
              src={deal.image} 
              alt={deal.title} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-accent-pink/20 flex items-center justify-center">
              <span className="text-4xl">{getIconEmoji()}</span>
            </div>
          )}
          
          {/* Tags */}
          <div className="absolute top-2 left-2 flex flex-wrap gap-2">
            {deal.is_exclusive && (
              <span className="px-2 py-1 bg-accent-pink text-white text-xs font-medium rounded-full">
                Exclusive
              </span>
            )}
            {deal.is_new && (
              <span className="px-2 py-1 bg-accent-yellow text-bg-primary text-xs font-medium rounded-full">
                New
              </span>
            )}
          </div>
        </div>
        
        {/* Card content */}
        <div className="p-4 flex flex-col flex-1">
          {showShop && (
            <div className="text-text-secondary text-sm mb-1">{deal.shop_name}</div>
          )}
          <h3 className="font-semibold mb-2 line-clamp-2">{deal.title}</h3>
          
          {/* Pricing */}
          <div className="flex items-baseline gap-2 mb-4">
            {deal.discount_percentage > 0 && (
              <span className="text-accent-pink font-bold">
                {deal.discount_percentage}% OFF
              </span>
            )}
            {deal.original_price && (
              <span className="text-text-secondary line-through text-sm">
                {formatCurrency(deal.original_price)}
              </span>
            )}
            {deal.discounted_price && (
              <span className="font-semibold">
                {formatCurrency(deal.discounted_price)}
              </span>
            )}
          </div>
          
          {/* Category tags */}
          {deal.category_names && deal.category_names.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {deal.category_names.map((category, index) => (
                <span 
                  key={index}
                  className="text-xs px-2 py-1 bg-white/10 rounded-full text-text-secondary"
                >
                  {category}
                </span>
              ))}
            </div>
          )}
          
          {/* Footer */}
          <div className="mt-auto pt-4 border-t border-white/10 flex items-center justify-between text-text-secondary text-sm">
            <div className="flex items-center gap-1">
              <Clock size={14} />
              <span>{deal.time_left || "Limited time"}</span>
            </div>
            <div>
              {deal.views_count > 0 && `${deal.views_count} views`}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default DealCard;