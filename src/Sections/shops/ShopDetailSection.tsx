import React from 'react';
import { MapPin, Phone, Mail, Globe, Clock, Star, Heart, Share2 } from 'lucide-react';
import { Shop } from '@/types/shops';

interface ShopDetailSectionProps {
  shop?: Shop;
  onFavoriteToggle?: (shopId: string) => void;
  onShare?: (shopId: string) => void;
}

const ShopDetailSection: React.FC<ShopDetailSectionProps> = ({
  shop,
  onFavoriteToggle,
  onShare,
}) => {
  if (!shop) {
    return (
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="bg-white/5 rounded-xl p-8 h-64 flex items-center justify-center">
            <p className="text-xl text-text-secondary">Shop information not available</p>
          </div>
        </div>
      </section>
    );
  }

  // Get shop initials from name
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <section className="pt-32 pb-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left column - Image and info */}
          <div className="lg:col-span-1">
            <div className="bg-white/5 rounded-xl overflow-hidden">
              {shop.banner_image ? (
                <img 
                  src={shop.banner_image} 
                  alt={shop.name} 
                  className="w-full h-auto object-cover aspect-video" 
                />
              ) : (
                <div className="w-full aspect-video bg-accent-pink/20 flex items-center justify-center">
                  <div className="w-24 h-24 bg-accent-pink rounded-full flex items-center justify-center text-4xl font-bold text-white">
                    {getInitials(shop.name)}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-8 bg-white/5 rounded-xl p-6">
              <div className="flex items-center gap-4 mb-6">
                {shop.logo ? (
                  <img 
                    src={shop.logo} 
                    alt={shop.name} 
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 bg-accent-blue rounded-lg flex items-center justify-center text-xl font-bold">
                    {getInitials(shop.name)}
                  </div>
                )}
                <div>
                  <h1 className="text-2xl font-bold">{shop.name}</h1>
                  <div className="flex items-center">
                    <div className="flex items-center mr-2">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={16} 
                          className={i < Math.floor(shop.rating) 
                            ? "text-accent-yellow fill-accent-yellow" 
                            : "text-white/20"
                          } 
                        />
                      ))}
                    </div>
                    <span className="text-text-secondary">{shop.rating.toFixed(1)}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mb-6">
                {shop.is_verified && (
                  <span className="px-3 py-1 bg-accent-blue/20 text-accent-blue text-sm font-medium rounded-full">
                    Verified
                  </span>
                )}
                {shop.is_featured && (
                  <span className="px-3 py-1 bg-accent-yellow/20 text-accent-yellow text-sm font-medium rounded-full">
                    Featured
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-3 text-text-secondary">
                <div className="flex items-center gap-2">
                  <MapPin size={16} />
                  <span className="text-sm">Location details would show here</span>
                </div>
                {shop.phone && (
                  <div className="flex items-center gap-2">
                    <Phone size={16} />
                    <span className="text-sm">{shop.phone}</span>
                  </div>
                )}
                {shop.email && (
                  <div className="flex items-center gap-2">
                    <Mail size={16} />
                    <span className="text-sm">{shop.email}</span>
                  </div>
                )}
                {shop.website && (
                  <div className="flex items-center gap-2">
                    <Globe size={16} />
                    <a href={shop.website} target="_blank" rel="noopener noreferrer" className="text-sm hover:text-accent-pink">
                      {shop.website.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-6 border-t border-white/10">
                <h3 className="font-semibold mb-2">Opening Hours</h3>
                {shop.opening_hours && Object.keys(shop.opening_hours).length > 0 ? (
                  <div className="text-sm text-text-secondary">
                    {Object.entries(shop.opening_hours).map(([day, hours]) => (
                      <div key={day} className="flex justify-between py-1">
                        <span className="capitalize">{day}</span>
                        <span>{hours}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-text-secondary">No opening hours available</p>
                )}
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button 
                className="flex-1 bg-transparent border border-white/20 hover:border-white/40 text-text-primary py-3 px-6 rounded-full font-semibold flex items-center justify-center gap-2 transition-all"
                onClick={() => onFavoriteToggle?.(shop.id.toString())}
              >
                <Heart size={16} /> Save
              </button>
              <button 
                className="flex-1 bg-transparent border border-white/20 hover:border-white/40 text-text-primary py-3 px-6 rounded-full font-semibold flex items-center justify-center gap-2 transition-all"
                onClick={() => onShare?.(shop.id.toString())}
              >
                <Share2 size={16} /> Share
              </button>
            </div>
          </div>

          {/* Right column - Description and deals */}
          <div className="lg:col-span-2">
            <div className="bg-white/5 rounded-xl p-6 mb-8">
              <h2 className="text-xl font-semibold mb-3">About {shop.name}</h2>
              <div className="prose prose-invert max-w-none">
                <p>{shop.description || shop.short_description}</p>
              </div>
            </div>

            <h2 className="text-2xl font-semibold mb-6">Current Deals</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(shop.deal_count || 2)].map((_, i) => (
                <div key={i} className="bg-white/5 rounded-xl p-6 hover:bg-white/10 transition-colors">
                  <h3 className="font-semibold mb-2">Sample Deal {i+1}</h3>
                  <p className="text-text-secondary text-sm mb-3">This is a sample deal until we fetch the real deals.</p>
                  <div className="flex justify-between items-center">
                    <span className="text-accent-pink font-bold">25% OFF</span>
                    <a href="#" className="text-sm text-accent-blue hover:underline">View Deal</a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShopDetailSection;