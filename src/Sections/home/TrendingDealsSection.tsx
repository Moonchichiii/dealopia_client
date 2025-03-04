import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { SectionProps } from '@/types/home';
import { Deal } from '@/types/deals';
import DealCard from '@/components/cards/DealCard';
import SectionHeading from '@/components/ui/SectionHeading';

interface TrendingDealsSectionProps extends SectionProps {
  deals?: Deal[];
}

// Sample trending deals data - in a real app, this would come from API
const defaultDeals: Deal[] = [
  {
    id: 'deal1',
    icon: '☕',
    type: 'coffee',
    tag: 'Trending',
    shop: { name: 'Morning Brew Coffee', id: 'shop1' },
    title: 'Buy One Get One Free on Specialty Coffees',
    description: 'Start your day with our signature house blend or try our seasonal specialties. Valid on any size.',
    originalPrice: 9.90,
    discountedPrice: 5.95,
  },
  {
    id: 'deal2',
    icon: '🧘',
    type: 'yoga',
    tag: 'Popular',
    shop: { name: 'Zen Yoga Studio', id: 'shop2' },
    title: 'Monthly Unlimited Classes Membership',
    description: 'Access to all class types, including hot yoga, meditation, and strength training sessions.',
    originalPrice: 120,
    discountedPrice: 90,
  },
  {
    id: 'deal3',
    icon: '📚',
    type: 'book',
    tag: 'New',
    shop: { name: 'Corner Bookshop', id: 'shop3' },
    title: 'Half Off All Fiction Books',
    description: 'Discover new worlds with our curated fiction collection. Limited time weekend offer.',
    originalPrice: null,
    discountedPrice: null,
    discountPercentage: 50,
  }
] as unknown as Deal[]; // Type casting because our mock data doesn't fully match the Deal type

export const TrendingDealsSection: React.FC<TrendingDealsSectionProps> = ({
  className = '',
  deals = defaultDeals,
}) => {
  return (
    <section className={`trending-section bg-bg-primary py-24 relative z-10 ${className}`}>
      <div className="container mx-auto px-4">
        <SectionHeading
          title="Trending Deals"
          description="The most popular discounts that everyone's talking about"
          centered
          descriptionClassName="max-w-xl mx-auto"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {deals.map((deal) => (
            <DealCard key={deal.id} {...deal} />
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Link
            to="/deals"
            className="inline-flex items-center gap-2 text-text-primary hover:text-accent-pink transition-colors font-semibold group"
          >
            View all deals
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TrendingDealsSection;