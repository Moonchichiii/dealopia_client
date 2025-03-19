import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useFeaturedShops } from '@/hooks/useShops';
import SectionHeading from '@/components/ui/SectionHeading';
import ShopCard from '@/components/cards/ShopCard';

interface FeaturedShopsSectionProps {
  limit?: number;
  className?: string;
}

const FeaturedShopsSection: React.FC<FeaturedShopsSectionProps> = ({ 
  limit = 4,
  className = ''
}) => {
  const { data: shops, isLoading } = useFeaturedShops(limit);
  
  if (isLoading) {
    return (
      <section className={`py-16 ${className}`}>
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Featured Local Shops"
            subtitle="Discover these amazing local businesses with great offers"
            centered
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-64 bg-white/5 rounded-xl animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }
  
  if (!shops || shops.length === 0) {
    return null;
  }
  
  return (
    <section className={`py-16 ${className}`}>
      <div className="container mx-auto px-4">
        <SectionHeading
          title="Featured Local Shops"
          subtitle="Discover these amazing local businesses with great offers"
          centered
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {shops.map((shop) => (
            <ShopCard key={shop.id} shop={shop} />
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Link
            to="/shops"
            className="inline-flex items-center gap-2 text-text-primary hover:text-accent-pink transition-colors font-semibold group"
          >
            View all shops
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedShopsSection;