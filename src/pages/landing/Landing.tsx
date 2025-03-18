import { useEffect, useRef } from 'react';
import { Tag } from 'lucide-react';
import gsap from 'gsap';

interface LandingProps {
  onExploreClick: () => void;
}

export default function LandingPage({ onExploreClick }: LandingProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const tagRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (textRef.current && tagRef.current) {
      gsap.set(textRef.current.children, { 
        opacity: 0,
        y: 30 
      });
      
      gsap.set(tagRef.current, {
        opacity: 0,
        x: -50,
        y: 0
      });

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" }
      });

      tl.to(textRef.current.children, {
        opacity: 1,
        y: 0,
        duration: 1.2,
        stagger: 0.2
      })
      .to(tagRef.current, {
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: "bounce.out",
      }, "-=0.8")
      // Continuous bouncing animation
      .to(tagRef.current, {
        y: -10,
        duration: 0.6,
        repeat: -1, // Infinite repeat
        yoyo: true, // Go back and forth
        ease: "sine.inOut"
      });
    }
  }, []);

  const handleExploreClick = () => {
    if (onExploreClick) {
      onExploreClick();
    }
    const nextSection = document.querySelector('section:nth-of-type(2)');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({
        top: window.innerHeight,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div ref={containerRef} className="fixed inset-0 bg-[#080420] flex items-center justify-center">
      <div className="w-full max-w-6xl px-4 sm:px-6 lg:px-8 mx-auto flex flex-col items-center justify-center">
        <div ref={textRef} className="text-center relative w-full max-w-2xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6 flex items-center justify-center">
            <span className="text-white">DealOpia</span>
            <div ref={tagRef} className="ml-2 inline-flex">
              <Tag className="w-10 h-10 sm:w-10 sm:h-10 text-pink-500" />
            </div>
          </h1>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 sm:mb-8">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500">
              Discover Amazing Local Deals
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-white mb-8 sm:mb-12 font-medium">
            Find the best discounts from your favorite local shops.
            Save money while supporting your community.
          </p>
        </div>
        
        <div 
          className="absolute bottom-6 left-1/2 transform -translate-x-1/2 cursor-pointer flex flex-col items-center"
          onClick={handleExploreClick}
        >
          <div className="w-8 h-12 border-2 border-white/50 rounded-full flex items-center justify-center p-1">
            <div className="w-2 h-3 bg-white rounded-full animate-[bounce_1.5s_infinite]" />
          </div>
          <p className="text-white/70 text-lg mt-2 text-center w-full">
            Scroll to Explore
          </p>
        </div>
      </div>
    </div>
  );
}
