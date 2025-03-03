import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Info } from 'lucide-react';
import { SectionProps, TrendingDeal } from '@/types/home';
import TrendingDealsContainer from '@/components/home/TrendingDealsContainer';

interface HeroSectionProps extends SectionProps {
  trendingDeals?: TrendingDeal[];
}

// Default trending deals if none are provided
const defaultTrendingDeals: TrendingDeal[] = [
  {
    id: 'deal1',
    icon: '🍔',
    iconType: 'food',
    title: 'The Local Bistro',
    subtitle: 'Dinner for Two Special',
    discount: '30% OFF'
  },
  {
    id: 'deal2',
    icon: '👕',
    iconType: 'fashion',
    title: 'Urban Threads',
    subtitle: 'Summer Collection Sale',
    discount: '50% OFF'
  },
  {
    id: 'deal3',
    icon: '💆',
    iconType: 'wellness',
    title: 'Serenity Spa',
    subtitle: 'Full Body Massage',
    discount: '25% OFF'
  }
];

export const HeroSection: React.FC<HeroSectionProps> = ({ 
  className = '',
  trendingDeals = defaultTrendingDeals
}) => {
  const navigate = useNavigate();

  return (
    <section className={`min-h-screen flex items-center pt-40 pb-32 relative overflow-hidden bg-gradient-to-br from-[color:var(--color-accent-blue)]/5 to-[color:var(--color-accent-green)]/5 ${className}`}>
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight bg-gradient-to-r from-[color:var(--color-accent-pink)] to-[color:var(--color-accent-blue)] bg-clip-text text-transparent animate-fadeIn">
              Discover Amazing Local Deals
            </h1>

            <p className="text-lg md:text-xl text-[color:var(--color-text-secondary)] mb-10 max-w-lg animate-fadeIn" style={{ animationDelay: '0.2s' }}>
              Find the best discounts from your favorite local shops. Save money while supporting your community.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 animate-fadeIn" style={{ animationDelay: '0.4s' }}>
              <button
                onClick={() => navigate('/deals')}
                className="bg-[color:var(--color-accent-pink)] text-white py-4 px-8 rounded-full font-semibold flex items-center gap-2 shadow-lg hover:shadow-[color:var(--color-accent-pink)]/30 hover:-translate-y-1 transition-all"
              >
                Explore Deals
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={() => navigate('/how-it-works')}
                className="bg-transparent text-[color:var(--color-text-primary)] py-4 px-8 rounded-full font-semibold border border-[color:var(--color-text-secondary)] flex items-center gap-2 hover:border-[color:var(--color-text-primary)] hover:bg-white/5 transition-all"
              >
                How It Works
                <Info className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="md:translate-y-12 animate-fadeIn" style={{ animationDelay: '0.6s' }}>
            <TrendingDealsContainer 
              title="Trending Deals Near You" 
              deals={trendingDeals} 
            />
          </div>
        </div>
      </div>

      {/* Wave SVG at the bottom */}
      <svg
        className="absolute bottom-0 left-0 w-full h-[10vw] min-h-[100px]"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
      >
        <path
          fill="currentColor"
          fillOpacity="1"
          d="M0,96L48,106.7C96,117,192,139,288,138.7C384,139,480,117,576,117.3C672,117,768,139,864,138.7C960,139,1056,117,1152,112C1248,107,1344,117,1392,122.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        ></path>
      </svg>
    </section>
  );
};

export default HeroSection;