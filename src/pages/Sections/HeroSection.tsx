'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Info } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Sample trending deals data
const trendingDeals = [
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

const HeroSection = () => {
  const router = useRouter();
  
  // Get icon style based on type
  const getIconStyle = (type) => {
    const styles = {
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
      }
    };
    
    const defaultStyle = {
      bg: 'bg-[color:var(--color-accent-pink)]',
      text: 'text-white'
    };
    
    return styles[type] || defaultStyle;
  };

  return (
    <section className="min-h-screen flex items-center pt-40 pb-32 relative overflow-hidden bg-gradient-to-br from-[color:var(--color-accent-blue)]/5 to-[color:var(--color-accent-green)]/5">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight bg-gradient-to-r from-[color:var(--color-accent-pink)] to-[color:var(--color-accent-blue)] bg-clip-text text-transparent animate-fadeIn">
              Discover Amazing Local Deals
            </h1>
           
            <p className="text-lg md:text-xl text-[color:var(--color-text-secondary)] mb-10 max-w-lg animate-fadeIn" style={{animationDelay: '0.2s'}}>
              Find the best discounts from your favorite local shops. Save money while supporting your community.
            </p>
           
            <div className="flex flex-col sm:flex-row gap-4 animate-fadeIn" style={{animationDelay: '0.4s'}}>
              <button
                onClick={() => router.push('/deals')}
                className="bg-[color:var(--color-accent-pink)] text-white py-4 px-8 rounded-full font-semibold flex items-center gap-2 shadow-lg hover:shadow-[color:var(--color-accent-pink)]/30 hover:-translate-y-1 transition-all"
              >
                Explore Deals
                <ArrowRight className="w-5 h-5" />
              </button>
             
              <button
                onClick={() => router.push('/how-it-works')}
                className="bg-transparent text-[color:var(--color-text-primary)] py-4 px-8 rounded-full font-semibold border border-[color:var(--color-text-secondary)] flex items-center gap-2 hover:border-[color:var(--color-text-primary)] hover:bg-white/5 transition-all"
              >
                How It Works
                <Info className="w-5 h-5" />
              </button>
            </div>
          </div>
         
          <div className="md:translate-y-12 animate-fadeIn" style={{animationDelay: '0.6s'}}>
            <div className="bg-[color:var(--color-bg-secondary)] rounded-3xl overflow-hidden shadow-[var(--shadow-custom)]">
              <div className="bg-black/30 p-5 flex items-center gap-3 font-medium">
                <div className="w-2 h-2 bg-[color:var(--color-accent-green)] rounded-full"></div>
                <div>Trending Deals Near You</div>
              </div>
             
              <div className="p-5 space-y-2">
                {trendingDeals.map((deal) => {
                  const iconStyle = getIconStyle(deal.iconType);
                  
                  return (
                    <Link
                      key={deal.id}
                      href={`/deals/${deal.id}`}
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
                })}
              </div>
            </div>
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