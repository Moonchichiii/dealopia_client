'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import DealCard from '@/components/ui/DealCard';

// Sample trending deals data
const trendingDeals = [
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
];

const TrendingDealsSection = () => {
  return (
    <section className="bg-bg-primary py-24 relative z-10">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Trending Deals
          </h2>
          <p className="text-text-secondary text-lg max-w-xl mx-auto">
            The most popular discounts that everyone's talking about
          </p>
        </div>
       
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {trendingDeals.map((deal) => (
            <DealCard key={deal.id} {...deal} />
          ))}
        </div>
       
        <div className="mt-12 text-center">
          <Link
            href="/deals"
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