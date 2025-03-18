import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export const useHeaderScroll = () => {
  const headerRef = useRef<HTMLElement | null>(null);
  
  useEffect(() => {
    if (typeof window === 'undefined' || !headerRef.current) return;
    
    const handleScroll = () => {
      if (!headerRef.current) return;
      
      const scrollPosition = window.scrollY;
      const threshold = window.innerHeight * 0.05;
      
      if (scrollPosition > threshold) {
        gsap.to(headerRef.current, {
          backgroundColor: 'var(--color-secondary-900)',
          boxShadow: '0 5px 20px rgba(0, 0, 0, 0.2)',
          backdropFilter: 'blur(10px)',
          padding: '15px 0',
          duration: 0.3,
          ease: 'power2.out'
        });
      } else {
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
    
    gsap.set(headerRef.current, {
      backgroundColor: 'transparent',
      boxShadow: 'none',
      backdropFilter: 'none',
      padding: '30px 0'
    });
    
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  return headerRef;
};

export default useHeaderScroll;
