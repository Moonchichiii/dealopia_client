import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingDeal, IconStyle } from '@/types/home';

interface TrendingDealCardProps {
  deal: TrendingDeal;
}

export const TrendingDealCard: React.FC<TrendingDealCardProps> = ({ deal }) => {
  const getIconStyle = (type: TrendingDeal['iconType']): IconStyle => {
    const styles: Record<string, IconStyle> = {
      food: {
        bg: 'bg-[color:var(--color-accent-yellow)]',
        text: 'text-[color:var(--color-bg-primary)]'
      },
      fashion: {
        bg: 'bg-[color:var(--color-accent-blue)]',
        text: 'text-[color:var(--color-bg-primary)]'
      },
      wellness: {
        bg: 'bg-[color:var(--color-accent-green)]',
        text: 'text-[color:var(--color-bg-primary)]'
      },
      coffee: {
        bg: 'bg-[color:var(--color-accent-yellow)]',
        text: 'text-[color:var(--color-bg-primary)]'
      },
      yoga: {
        bg: 'bg-[color:var(--color-accent-green)]',
        text: 'text-[color:var(--color-bg-primary)]'
      },
      book: {
        bg: 'bg-[color:var(--color-accent-blue)]',
        text: 'text-[color:var(--color-bg-primary)]'
      }
    };

    const defaultStyle = {
      bg: 'bg-[color:var(--color-accent-pink)]',
      text: 'text-white'
    };

    return styles[type] || defaultStyle;
  };

  const iconStyle = getIconStyle(deal.iconType);

  return (
    <Link
      to={`/deals/${deal.id}`}
      className="flex items-center gap-4 p-4 rounded-md hover:bg-white/5 transition-colors"
    >
      <div className={`w-12 h-12 ${iconStyle.bg} ${iconStyle.text} rounded-md flex items-center justify-center text-2xl`}>
        {deal.icon}
      </div>

      <div className="flex-1">
        <h4 className="font-semibold">{deal.title}</h4>
        <p className="text-sm text-[color:var(--color-text-secondary)]">{deal.subtitle}</p>
      </div>

      <div className="bg-[color:var(--color-accent-pink)] text-white px-3 py-1.5 rounded-full text-sm font-bold">
        {deal.discount}
      </div>
    </Link>
  );
};

export default TrendingDealCard;