'use client';

import { useLayoutEffect, useRef } from 'react';
import { gsap, ScrollSmoother, ScrollTrigger } from '@/utils/gsap';
import  { Header }  from '@/components/layout/Header';
import  Footer from '@/components/layout/Footer';
import  HeroSection  from '@/components/home/HeroSection';
import  TrendingDealsSection from '@/components/home/TrendingDealsSection';
import  FeaturedShopsSection  from '@/components/home/FeaturedShopsSection';
import  NewsletterSection  from '@/components/home/NewsletterSection';

export default function HomePage() {
  const smoothWrapperRef = useRef<HTMLDivElement>(null);
  const smoothContentRef = useRef<HTMLDivElement>(null);
  
  // Initialize smooth scrolling
  useLayoutEffect(() => {
    // Create scroll smoother for smooth scrolling effect
    const smoother = ScrollSmoother.create({
      wrapper: smoothWrapperRef.current!,
      content: smoothContentRef.current!,
      smooth: 1.5, // Adjust smoothness (higher = slower)
      effects: true,
      normalizeScroll: true,
      ignoreMobileResize: true,
    });
    
    // Set up a listener for route changes to kill ScrollTrigger instances when navigating away
    const handleRouteChange = () => {
      smoother.kill();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
    
    return () => {
      // Clean up all scroll-related instances when component unmounts
      smoother.kill();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      window.removeEventListener('beforeunload', handleRouteChange);
    };
  }, []);
  
  return (
    <div ref={smoothWrapperRef} className="smooth-wrapper">
      <div ref={smoothContentRef} className="smooth-content">
        <Header />
        <main>
          <HeroSection />
          <TrendingDealsSection />
          <FeaturedShopsSection />
          <NewsletterSection />
        </main>
        <Footer />
      </div>
    </div>
  );
}