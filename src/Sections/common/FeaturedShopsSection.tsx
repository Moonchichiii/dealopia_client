import React from 'react';
import { SectionProps, FeaturedShop } from '@/types/home';
import SectionHeading from '@/components/ui/SectionHeading';
import FeaturedShopCard from '@/components/cards/FeaturedShopCard';

interface FeaturedShopsSectionProps extends SectionProps {
  shops?: FeaturedShop[];
}

// Sample featured shops data - in a real app, this would come from API
const defaultShops: FeaturedShop[] = [
  {
    id: 'shop1',
    name: 'Urban Threads',
    initials: 'UT',
    initialsColor: 'pink',
    category: 'Fashion & Apparel',
    description: 'A boutique clothing store featuring local designers and sustainable fashion for all styles.',
    activeDeals: 8,
    rating: 4.8
  },
  {
    id: 'shop2',
    name: 'Green Earth Market',
    initials: 'GEM',
    initialsColor: 'blue',
    category: 'Wellness & Beauty',
    description: 'A peaceful sanctuary offering massages, facials, and holistic wellness treatments.',
    activeDeals: 3,
    rating: 4.9
  },
  {
    id: 'shop3',
    name: 'Page & Binding',
    initials: 'PB',
    initialsColor: 'yellow',
    category: 'Books & Stationery',
    description: 'Independent bookstore with a carefully curated selection and cozy reading nooks.',
    activeDeals: 6,
    rating: 4.6
  },
  {
    id: 'shop4',
    name: 'Fresh Bites',
    initials: 'FB',
    initialsColor: 'green',
    category: 'Food & Dining',
    description: 'Farm-to-table restaurant offering seasonal dishes made with locally-sourced ingredients.',
    activeDeals: 5,
    rating: 4.7
  }
];

export const FeaturedShopsSection: React.FC<FeaturedShopsSectionProps> = ({
  className = '',
  shops = defaultShops,
}) => {
  return (
    <section className={`bg-bg-primary py-24 ${className}`}>
      <div className="container mx-auto px-4">
        <SectionHeading
          title="Featured Local Shops"
          description="Discover these amazing local businesses with great offers"
          centered
          descriptionClassName="max-w-2xl mx-auto"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {shops.map((shop) => (
            <FeaturedShopCard key={shop.id} shop={shop} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedShopsSection;