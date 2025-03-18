import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Info } from 'lucide-react';

// Import GSAP
import { useGSAP, gsap } from '@/utils/useGsap';

interface HeroSectionProps {
  // Add any props if needed
}

const HeroSection: React.FC<HeroSectionProps> = () => {
  const heroRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const showcaseRef = useRef<HTMLDivElement>(null);
  
  // Use GSAP for animations
  useGSAP(() => {
    if (!contentRef.current || !showcaseRef.current) return;
    
    // Create a timeline for entry animations
    const tl = gsap.timeline();
    
    // Animate the hero content
    tl.from(contentRef.current.querySelector('h1'), {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    })
    .from(contentRef.current.querySelector('p'), {
      y: 20,
      opacity: 0,
      duration: 0.6,
      ease: 'power3.out'
    }, '-=0.4')
    .from(contentRef.current.querySelectorAll('.hero-btn'), {
      y: 20,
      opacity: 0,
      stagger: 0.2,
      duration: 0.6,
      ease: 'power3.out'
    }, '-=0.4')
    .from(showcaseRef.current, {
      y: 40,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    }, '-=0.6');
    
    return () => {
      tl.kill();
    };
  }, []);
  
  return (
    <section 
      ref={heroRef}
      className="relative min-h-screen flex items-center pt-20 pb-32 overflow-hidden"
    >
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--hero-gradient-from)] to-[var(--hero-gradient-to)] opacity-15 z-[-1]"></div>
      
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          {/* Hero Content */}
          <div ref={contentRef} className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-pink)] to-[var(--accent-blue)]">
              Discover Amazing Local Deals
            </h1>
            
            <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-lg">
              Find the best discounts from your favorite local shops. Save money while supporting your community.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
              <Link 
                to="/deals" 
                className="hero-btn flex items-center justify-center gap-2 bg-[var(--accent-pink)] text-white px-8 py-4 rounded-full font-medium hover:shadow-lg hover:shadow-pink-500/30 hover:-translate-y-1 transition-all"
              >
                Explore Deals
                <ArrowRight size={20} />
              </Link>
              
              <button 
                className="hero-btn flex items-center justify-center gap-2 bg-transparent border border-gray-600 text-white px-8 py-4 rounded-full font-medium hover:border-white hover:bg-white/5 transition-all"
              >
                How It Works
                <Info size={20} />
              </button>
            </div>
          </div>
          
          {/* Trending Deals Showcase */}
          <div ref={showcaseRef} className="bg-black/30 rounded-2xl overflow-hidden backdrop-blur-sm shadow-xl">
            <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
              <div className="w-2 h-2 rounded-full bg-[var(--accent-green)]"></div>
              <div className="text-gray-200 font-medium">Trending Deals Near You</div>
            </div>
            
            <div className="p-4">
              {/* Deal 1 */}
              <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors mb-2">
                <div className="w-12 h-12 bg-[var(--accent-yellow)] text-black rounded-lg flex items-center justify-center text-2xl">
                  🍔
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-white">The Local Bistro</h4>
                  <p className="text-sm text-gray-300">Dinner for Two Special</p>
                </div>
                <div className="bg-[var(--accent-pink)] text-white text-sm font-bold px-3 py-1.5 rounded-full">
                  30% OFF
                </div>
              </div>
              
              {/* Deal 2 */}
              <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors mb-2">
                <div className="w-12 h-12 bg-[var(--accent-blue)] text-black rounded-lg flex items-center justify-center text-2xl">
                  👕
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-white">Urban Threads</h4>
                  <p className="text-sm text-gray-300">Summer Collection Sale</p>
                </div>
                <div className="bg-[var(--accent-pink)] text-white text-sm font-bold px-3 py-1.5 rounded-full">
                  50% OFF
                </div>
              </div>
              
              {/* Deal 3 */}
              <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors">
                <div className="w-12 h-12 bg-[var(--accent-green)] text-black rounded-lg flex items-center justify-center text-2xl">
                  💆
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-white">Serenity Spa</h4>
                  <p className="text-sm text-gray-300">Full Body Massage</p>
                </div>
                <div className="bg-[var(--accent-pink)] text-white text-sm font-bold px-3 py-1.5 rounded-full">
                  25% OFF
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Wave Divider */}
      <svg className="absolute bottom-0 left-0 w-full h-40 text-black" preserveAspectRatio="none" viewBox="0 0 1440 320">
        <path 
          fill="#1A1727" 
          fillOpacity="1" 
          d="M0,96L48,106.7C96,117,192,139,288,138.7C384,139,480,117,576,117.3C672,117,768,139,864,138.7C960,139,1056,117,1152,112C1248,107,1344,117,1392,122.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        ></path>
      </svg>
    </section>
  );
};

export default HeroSection;