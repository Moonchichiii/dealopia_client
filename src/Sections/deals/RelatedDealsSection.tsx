import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight } from 'lucide-react';
import { Deal } from '@/types/deals';
import DealCard from '@/components/ui/DealCard';
import SectionHeading from '@/components/ui/SectionHeading';

interface RelatedDealsSectionProps {
  categoryId?: number;
  dealId?: string;
  limit?: number;
}

const RelatedDealsSection: React.FC<RelatedDealsSectionProps> = ({
  categoryId,
  dealId,
  limit = 3 
}) => {
  // Fetch related deals
  const { data: relatedDeals, isLoading } = useQuery({
    queryKey: ['relatedDeals', categoryId, dealId],
    queryFn: async () => {
      // In a real app, call your API:
      // return dealsApi.getRelatedDeals(categoryId, dealId, limit);
      
      // For demo purposes, return mock data
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // Sample related deals data
      return [
        {
          id: 'related1',
          title: 'Weekend Brunch Special',
          shop: { name: 'Urban Cafe', id: 'shop1' },
          description: 'Enjoy our special weekend brunch menu with complimentary mimosas.',
          originalPrice: 35,
          discountedPrice: 25,
          type: 'food',
          icon: '🍳',
          tag: 'Popular',
          is_featured: true
        },
        {
          id: 'related2',
          title: 'Coffee & Pastry Combo',
          shop: { name: 'Morning Brew', id: 'shop2' },
          description: 'Get any specialty coffee and pastry for a special price.',
          originalPrice: 12.50,
          discountedPrice: 8.95,
          type: 'coffee',
          icon: '☕',
          tag: 'Hot Deal',
          is_exclusive: true
        },
        {
          id: 'related3',
          title: 'Happy Hour: Buy One Get One',
          shop: { name: 'The Local', id: 'shop3' },
          description: 'Buy one, get one free on all drinks during happy hour (4-7pm).',
          originalPrice: null,
          discountedPrice: null,
          discountPercentage: 50,
          type: 'food',
          icon: '🍹',
          tag: 'Limited',
          is_featured: true
        },
      ] as unknown as Deal[];
    },
    enabled: !!categoryId,
  });

  if (isLoading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <SectionHeading 
            title="Related Deals You Might Like"
            centered
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-80 bg-white/5 rounded-xl animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!relatedDeals || relatedDeals.length === 0) {
    return null;
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <SectionHeading 
          title="Related Deals You Might Like"
          centered
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {relatedDeals.map((deal) => (
            <DealCard key={deal.id} {...deal} />
          ))}
        </div>
        
        {relatedDeals.length > 0 && (
          <div className="mt-12 text-center">
            <a
              href={categoryId ? `/deals?category=${categoryId}` : '/deals'}
              className="inline-flex items-center gap-2 text-text-primary hover:text-accent-pink transition-colors font-semibold group"
            >
              View more deals
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        )}
      </div>
    </section>
  );
};

export default RelatedDealsSection;