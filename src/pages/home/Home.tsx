import React, { useEffect, lazy, Suspense } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Import essential sections
import HeroSection from '@/sections/home/HeroSection';
import FeaturedDealsSection from '@/Sections/deals/FeaturedDealsSection';
import EndingSoonDealsSection from '@/sections/home/EndingSoonDealsSection';

// Lazy load less critical sections
const FeaturedShopsSection = lazy(() => import('@/sections/common/FeaturedShopsSection'));
const NewsletterSection = lazy(() => import('@/sections/common/NewsletterSection'));

const HomePage: React.FC = () => {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const handleNewsletterSubmit = async (email: string): Promise<void> => {
    console.log(`Subscribing ${email} to newsletter`);
    await new Promise(resolve => setTimeout(resolve, 1500));
  };

  return (
    <main className="relative">
      {/* Gradient background */}
      <div
        className="absolute inset-0 -z-10 opacity-[0.3]"
        style={{
          background: 'linear-gradient(135deg, var(--hero-gradient-from), var(--hero-gradient-to))'
        }}
      ></div>
      
      {/* Critical sections loaded immediately */}
      <HeroSection />
      
      <FeaturedDealsSection 
        title="Featured Deals" 
        subtitle="Handpicked exclusive offers just for you" 
      />
      
      <EndingSoonDealsSection 
        title="Ending Soon" 
        subtitle="Don't miss out on these limited-time offers" 
      />
      
      {/* Less critical sections lazy loaded */}
      <Suspense fallback={<div className="h-64 flex items-center justify-center">Loading...</div>}>
        <FeaturedShopsSection />
        <NewsletterSection onSubmit={handleNewsletterSubmit} />
      </Suspense>
    </main>
  );
};

export default HomePage;
