import React from 'react';
import { TrendingDeal } from '@/types/home';
import TrendingDealCard from '@/components/cards/TrendingDealCard';

interface TrendingDealsContainerProps {
  title: string;
  deals: TrendingDeal[];
  className?: string;
}

export const TrendingDealsContainer: React.FC<TrendingDealsContainerProps> = ({
  title,
  deals,
  className = '',
}) => {
  return (
    <div className={`bg-[color:var(--color-bg-secondary)] rounded-3xl overflow-hidden shadow-[var(--shadow-custom)] ${className}`}>
      <div className="bg-black/30 p-5 flex items-center gap-3 font-medium">
        <div className="w-2 h-2 bg-[color:var(--color-accent-green)] rounded-full"></div>
        <div>{title}</div>
      </div>

      <div className="p-5 space-y-2">
        {deals.map((deal) => (
          <TrendingDealCard key={deal.id} deal={deal} />
        ))}
      </div>
    </div>
  );
};

export default TrendingDealsContainer;