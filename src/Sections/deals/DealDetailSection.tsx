import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Tag, ExternalLink, Heart, Share2 } from 'lucide-react';
import { Deal } from '@/types/deals';
import { formatCurrency } from '@/utils/formatters';

interface DealDetailSectionProps {
  deal?: Deal;
  onFavoriteToggle?: (dealId: string) => void;
  onShare?: (dealId: string) => void;
}

const DealDetailSection: React.FC<DealDetailSectionProps> = ({
  deal,
  onFavoriteToggle,
  onShare,
}) => {
  if (!deal) {
    return (
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="bg-white/5 rounded-xl p-8 h-64 flex items-center justify-center">
            <p className="text-xl text-text-secondary">Deal information not available</p>
          </div>
        </div>
      </section>
    );
  }

  // Calculate percentage discount if not provided
  const discountPercentage = deal.discountPercentage ?? (
    deal.originalPrice && deal.discountedPrice 
      ? Math.round(((deal.originalPrice - deal.discountedPrice) / deal.originalPrice) * 100)
      : null
  );

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left column - Image and shop info */}
          <div className="lg:col-span-1">
            <div className="bg-white/5 rounded-xl overflow-hidden">
              {deal.image ? (
                <img 
                  src={deal.image} 
                  alt={deal.title} 
                  className="w-full h-auto object-cover aspect-square" 
                />
              ) : (
                <div className="w-full aspect-square bg-accent-pink/20 flex items-center justify-center">
                  <span className="text-6xl">{deal.type === 'food' ? '🍔' : deal.type === 'fashion' ? '👕' : '🛍️'}</span>
                </div>
              )}
            </div>

            <div className="mt-8 bg-white/5 rounded-xl p-6">
              <Link to={`/shops/${deal.shop}`} className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-accent-blue rounded-lg flex items-center justify-center text-xl font-bold">
                  {deal.shop_name?.charAt(0) || 'S'}
                </div>
                <div>
                  <h3 className="font-semibold">{deal.shop_name}</h3>
                  <p className="text-sm text-text-secondary">View shop profile</p>
                </div>
              </Link>

              <hr className="border-white/10 my-4" />

              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-text-secondary">
                  <Calendar size={16} />
                  <span className="text-sm">
                    Valid until {new Date(deal.end_date).toLocaleDateString()}
                  </span>
                </div>
                
                {deal.terms_and_conditions && (
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Terms & Conditions</h4>
                    <p className="text-sm text-text-secondary">{deal.terms_and_conditions}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right column - Deal details */}
          <div className="lg:col-span-2">
            <div className="flex flex-wrap gap-3 mb-4">
              {deal.is_exclusive && (
                <span className="px-3 py-1 bg-accent-pink text-white text-sm font-medium rounded-full">
                  Exclusive
                </span>
              )}
              {deal.is_featured && (
                <span className="px-3 py-1 bg-accent-yellow text-bg-primary text-sm font-medium rounded-full">
                  Featured
                </span>
              )}
              {deal.category_names?.map((category, index) => (
                <span 
                  key={index} 
                  className="px-3 py-1 bg-white/10 text-text-primary text-sm font-medium rounded-full"
                >
                  {category}
                </span>
              ))}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-4">{deal.title}</h1>

            <div className="flex flex-wrap items-center gap-4 mb-8">
              {discountPercentage && (
                <span className="text-2xl font-bold text-accent-pink">
                  {discountPercentage}% OFF
                </span>
              )}

              {deal.originalPrice && (
                <div className="flex items-center gap-2">
                  <span className="text-text-secondary line-through">
                    {formatCurrency(deal.originalPrice)}
                  </span>
                  {deal.discountedPrice && (
                    <span className="text-2xl font-bold">
                      {formatCurrency(deal.discountedPrice)}
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="bg-white/5 rounded-xl p-6 mb-8">
              <div className="prose prose-invert max-w-none">
                <p>{deal.description}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mb-12">
              {deal.redemption_link && (
                <a 
                  href={deal.redemption_link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-accent-pink hover:bg-accent-pink/90 text-white py-3 px-6 rounded-full font-semibold flex items-center gap-2 transition-colors"
                >
                  Redeem Deal <ExternalLink size={16} />
                </a>
              )}

              {deal.coupon_code && (
                <div className="flex items-center gap-2">
                  <div className="bg-white/10 py-3 px-6 rounded-l-full font-mono font-medium">
                    {deal.coupon_code}
                  </div>
                  <button 
                    className="bg-white/20 hover:bg-white/30 text-white py-3 px-4 rounded-r-full font-medium flex items-center transition-colors"
                    onClick={() => navigator.clipboard.writeText(deal.coupon_code)}
                  >
                    Copy
                  </button>
                </div>
              )}

              <button 
                className="bg-transparent border border-white/20 hover:border-white/40 text-text-primary py-3 px-6 rounded-full font-semibold flex items-center gap-2 transition-all"
                onClick={() => onFavoriteToggle?.(deal.id.toString())}
              >
                <Heart size={16} /> Save
              </button>

              <button 
                className="bg-transparent border border-white/20 hover:border-white/40 text-text-primary py-3 px-6 rounded-full font-semibold flex items-center gap-2 transition-all"
                onClick={() => onShare?.(deal.id.toString())}
              >
                <Share2 size={16} /> Share
              </button>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Deal Statistics</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white/5 rounded-xl p-4">
                  <p className="text-text-secondary text-sm mb-1">Views</p>
                  <p className="text-2xl font-bold">{deal.views_count}</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4">
                  <p className="text-text-secondary text-sm mb-1">Clicks</p>
                  <p className="text-2xl font-bold">{deal.clicks_count}</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4">
                  <p className="text-text-secondary text-sm mb-1">Remaining</p>
                  <p className="text-2xl font-bold">
                    {new Date(deal.end_date) > new Date() 
                      ? Math.ceil((new Date(deal.end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) 
                      : 0} days
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DealDetailSection;