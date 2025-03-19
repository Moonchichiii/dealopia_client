import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock } from 'lucide-react';
import { useEndingSoonDeals } from '@/hooks/useDeals';
import DealCard from '@/components/cards/DealCard';
import SectionHeading from '@/components/ui/SectionHeading';

interface EndingSoonDealsSectionProps {
  title?: string;
  subtitle?: string;
  limit?: number;
  className?: string;
}

const EndingSoonDealsSection: React.FC<EndingSoonDealsSectionProps> = ({
  title = "Ending Soon",
  subtitle = "Don't miss out on these limited-time offers",
  limit = 6,
  className = ""
}) => {
  const { data: deals, isLoading } = useEndingSoonDeals(3, limit);
  
  if (isLoading) {
    return (
      <section className={`py-16 ${className}`}>
        <div className="container mx-auto px-4">
          <SectionHeading
            title={title}
            subtitle={subtitle}
            centered
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(limit > 3 ? 3 : limit)].map((_, i) => (
              <div key={i} className="h-80 bg-white/5 rounded-xl animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }
  
  if (!deals || deals.length === 0) {
    return null;
  }
  
  return (
    <section className={`py-16 ${className}`}>
      <div className="container mx-auto px-4">
        <SectionHeading
          title={title}
          subtitle={subtitle}
          centered
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {deals.map((deal) => (
            <DealCard key={deal.id} deal={deal} />
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Link
            to="/deals?ending_soon=true"
            className="inline-flex items-center gap-2 text-text-primary hover:text-accent-pink transition-colors font-semibold group"
          >
            View more ending soon deals
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default EndingSoonDealsSection;