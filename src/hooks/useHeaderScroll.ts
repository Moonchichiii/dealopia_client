import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Custom hook to handle header scroll effects
 * @returns A ref to attach to the header element
 */
export const useHeaderScroll = () => {
  const headerRef = useRef<HTMLElement | null>(null);
  
  useEffect(() => {
    // Only run on client-side
    if (typeof window === 'undefined' || !headerRef.current) return;
    
    // Simple scroll listener approach
    const handleScroll = () => {
      if (!headerRef.current) return;
      
      const scrollPosition = window.scrollY;
      const threshold = window.innerHeight * 0.05; // 5% of viewport height
      
      if (scrollPosition > threshold) {
        // Scrolled down - apply solid background
        gsap.to(headerRef.current, {
          backgroundColor: 'var(--color-secondary-900)',
          boxShadow: '0 5px 20px rgba(0, 0, 0, 0.2)',
          backdropFilter: 'blur(10px)',
          padding: '15px 0',
          duration: 0.3,
          ease: 'power2.out'
        });
      } else {
        // At top - apply transparent background
        gsap.to(headerRef.current, {
          backgroundColor: 'transparent',
          boxShadow: 'none',
          backdropFilter: 'none',
          padding: '30px 0',
          duration: 0.3,
          ease: 'power2.out'
        });
      }
    };
    
    // Set initial state to transparent
    gsap.set(headerRef.current, {
      backgroundColor: 'transparent',
      boxShadow: 'none',
      backdropFilter: 'none',
      padding: '30px 0'
    });
    
    // Add scroll listener
    window.addEventListener('scroll', handleScroll);
    
    // Run once to set initial state based on current scroll position
    handleScroll();
    
    return () => {
      // Clean up
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  return headerRef;
};

export default useHeaderScroll;