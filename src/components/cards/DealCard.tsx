import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { Deal } from '@/types/deals';
import { cn } from '@/utils/cn';

interface DealCardProps {
  deal?: Deal;
  className?: string;
  showShop?: boolean;
  compact?: boolean;
}

export const DealCard: React.FC<DealCardProps> = ({
  deal,
  className = '',
  showShop = true,
  compact = false
}) => {
  // Return null if no deal is provided
  if (!deal) {
    return null;
  }

  // Cast deal to appropriate type for optional properties
  const dealWithOptionalProps = deal;
  // Get icon/tag based on deal type
  const getIconClass = () => {
    const typeMappings = {
      food: 'bg-accent-yellow text-bg-primary',
      coffee: 'bg-accent-yellow text-bg-primary',
      fashion: 'bg-accent-pink text-white',
      wellness: 'bg-accent-green text-bg-primary',
      book: 'bg-accent-blue text-bg-primary',
      entertainment: 'bg-accent-blue text-bg-primary',
      default: 'bg-accent-pink text-white'
    };

    // Get category name
    let dealType = 'default';
    if (deal.category_names && deal.category_names.length > 0) {
      const firstCategory = deal.category_names[0].toLowerCase();
      
      // Match category to type
      if (firstCategory.includes('food') || firstCategory.includes('dining') || firstCategory.includes('restaurant')) {
        dealType = 'food';
      } else if (firstCategory.includes('fashion') || firstCategory.includes('clothing') || firstCategory.includes('apparel')) {
        dealType = 'fashion';
      } else if (firstCategory.includes('wellness') || firstCategory.includes('spa') || firstCategory.includes('health')) {
        dealType = 'wellness';
      } else if (firstCategory.includes('book') || firstCategory.includes('reading')) {
        dealType = 'book';
      } else if (firstCategory.includes('entertainment') || firstCategory.includes('movie') || firstCategory.includes('theater')) {
        dealType = 'entertainment';
      } else if (firstCategory.includes('coffee') || firstCategory.includes('cafe')) {
        dealType = 'coffee';
      }
    }

    return typeMappings[dealType as keyof typeof typeMappings] || typeMappings.default;
  };

  // Get appropriate icon emoji
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

  // Determine if the deal is new (less than 3 days old)
  const isNewDeal = () => {
    if (!deal.created_at) return false;
    const createdDate = new Date(deal.created_at);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays < 3;
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
          <div>
            {deal.time_left && (
              <div className="text-xs text-text-secondary flex items-center gap-1">
                <Clock size={12} />
                {deal.time_left}
              </div>
            )}
            <h2 className="font-semibold text-text-primary truncate">{deal.title}</h2>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="text-accent-pink font-bold">{getDiscountText()}</div>
            {deal.time_left && (
              <div className="text-xs text-text-secondary flex items-center gap-1">
                <Clock size={12} />
                {deal.time_left}
              </div>
            )}
          </div>
        </div>
      </Link>
    );
  }
  
  return (
    <div className={cn("relative p-6 rounded-lg border border-white/10 bg-white/[0.03] hover:bg-white/[0.05] transition-all group", className)}>
      
      {isNewDeal() && !deal.is_exclusive && (
        <div className="absolute top-6 right-0 font-semibold text-sm text-accent-green">
          New
        </div>
      )}
      
      <div className="flex gap-4 mb-4">
        <div className={`w-12 h-12 ${getIconClass()} rounded-md flex items-center justify-center text-2xl flex-shrink-0`}>
          {getIconEmoji()}
        </div>
        
        <div>
          {showShop && (
            <div className="text-text-secondary text-sm mb-1">{deal.shop_name}</div>
          )}
          <h3 className="text-xl font-semibold text-text-primary mb-2 leading-snug">{deal.title}</h3>
        </div>
      </div>
      
      {deal.description && (
        <p className="text-text-secondary mb-4 text-base line-clamp-2">{deal.description}</p>
      )}
      
      <div className="mt-auto">
        <div className="flex flex-wrap gap-2 mb-4">
          {deal.category_names?.map((category, index) => (
            <span 
              key={index}
              className="text-xs px-2 py-1 bg-white/10 rounded-full text-text-secondary"
            >
              {category}
            </span>
          ))}
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            {deal.original_price && (
              <span className="text-text-secondary line-through text-sm">
                {formatCurrency(deal.original_price)}
              </span>
            )}
            
            {deal.discounted_price && (
              <span className="text-text-primary font-bold">
                {formatCurrency(deal.discounted_price)}
              </span>
            )}
            
            {deal.discount_percentage && !deal.discounted_price && (
              <span className="text-accent-pink font-bold">
                {deal.discount_percentage}% OFF
              </span>
            )}
          </div>
          
          {deal.time_left && (
            <div className="text-xs text-text-secondary flex items-center gap-1">
              <Clock size={12} />
              {deal.time_left}
            </div>
          )}
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <Link
            to={`/deals/${deal.id}`}
            className="inline-flex items-center gap-1 text-text-primary font-semibold text-sm group-hover:text-accent-pink transition-colors"
          >
            View Deal <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
          
          {deal.views_count !== undefined && (
            <span className="text-xs text-text-secondary">
              {deal.views_count} views
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default DealCard;