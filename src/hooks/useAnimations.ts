// src/hooks/useAnimations.ts
import { useRef, useLayoutEffect } from 'react';
import { gsap, ScrollTrigger } from '@/utils/gsap';

interface FadeInOptions {
  y?: number;
  x?: number;
  delay?: number;
  duration?: number;
  stagger?: number;
  scrollTrigger?: boolean;
  start?: string;
  markers?: boolean;
  once?: boolean;
}

/**
 * Hook for creating fade-in animation on element(s)
 */
export const useFadeIn = (
  elementRef: React.RefObject<HTMLElement>,
  options: FadeInOptions = {}
) => {
  useLayoutEffect(() => {
    if (!elementRef.current) return;
    
    const element = elementRef.current;
    const {
      y = 30,
      x = 0,
      delay = 0,
      duration = 0.8,
      stagger = 0,
      scrollTrigger: useScrollTrigger = false,
      start = 'top bottom-=100',
      markers = false,
      once = true,
    } = options;
    
    const ctx = gsap.context(() => {
      // Animation properties
      const animationProps = {
        y,
        x,
        opacity: 0,
      };
      
      // Animation options
      const animationOptions = {
        y: 0,
        x: 0,
        opacity: 1,
        duration,
        delay,
        stagger,
        ease: 'power3.out',
      };
      
      // Apply scroll trigger if enabled
      if (useScrollTrigger) {
        gsap.fromTo(element, animationProps, {
          ...animationOptions,
          scrollTrigger: {
            trigger: element,
            start,
            markers,
            toggleActions: once ? 'play none none none' : 'play none none reset',
          },
        });
      } else {
        // Simple animation without scroll trigger
        gsap.fromTo(element, animationProps, animationOptions);
      }
    }, elementRef);
    
    return () => ctx.revert(); // Clean up
  }, [elementRef, options]);
};

interface StaggerOptions {
  y?: number;
  x?: number;
  delay?: number;
  duration?: number;
  stagger?: number;
  scrollTrigger?: boolean;
  start?: string;
  markers?: boolean;
  childSelector?: string;
  ease?: string;
}

/**
 * Hook for creating staggered animations on child elements
 */
export const useStaggerAnimation = (
  containerRef: React.RefObject<HTMLElement>,
  options: StaggerOptions = {}
) => {
  useLayoutEffect(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const {
      y = 30,
      x = 0,
      delay = 0,
      duration = 0.5,
      stagger = 0.1,
      scrollTrigger: useScrollTrigger = true,
      start = 'top bottom-=100',
      markers = false,
      childSelector = ':scope > *',
      ease = 'power2.out',
    } = options;
    
    const ctx = gsap.context(() => {
      const elements = container.querySelectorAll(childSelector);
      if (elements.length === 0) return;
      
      // Animation properties
      const animationProps = {
        y,
        x,
        opacity: 0,
      };
      
      // Animation options
      const animationOptions = {
        y: 0,
        x: 0,
        opacity: 1,
        duration,
        delay,
        stagger,
        ease,
      };
      
      // Apply scroll trigger if enabled
      if (useScrollTrigger) {
        gsap.fromTo(elements, animationProps, {
          ...animationOptions,
          scrollTrigger: {
            trigger: container,
            start,
            markers,
            toggleActions: 'play none none reset',
          },
        });
      } else {
        // Simple animation without scroll trigger
        gsap.fromTo(elements, animationProps, animationOptions);
      }
    }, containerRef);
    
    return () => ctx.revert(); // Clean up
  }, [containerRef, options]);
};

interface ParallaxOptions {
  speed?: number;
  direction?: 'y' | 'x';
  start?: string;
  end?: string;
  scrub?: boolean | number;
  markers?: boolean;
}

/**
 * Hook for creating parallax scrolling effects
 */
export const useParallax = (
  elementRef: React.RefObject<HTMLElement>,
  options: ParallaxOptions = {}
) => {
  useLayoutEffect(() => {
    if (!elementRef.current) return;
    
    const element = elementRef.current;
    const {
      speed = 0.5,
      direction = 'y',
      start = 'top bottom',
      end = 'bottom top',
      scrub = 1,
      markers = false,
    } = options;
    
    // Calculate the movement distance based on speed
    // Higher speed = more movement
    const distance = direction === 'y' ? -50 * speed : -50 * speed;
    
    const ctx = gsap.context(() => {
      gsap.to(element, {
        [direction]: `${distance}%`,
        ease: 'none',
        scrollTrigger: {
          trigger: element,
          start,
          end,
          scrub,
          markers,
        },
      });
    }, elementRef);
    
    return () => ctx.revert(); // Clean up
  }, [elementRef, options]);
};

interface TextRevealOptions {
  type?: 'words' | 'chars' | 'lines';
  duration?: number;
  stagger?: number;
  y?: number;
  ease?: string;
  scrollTrigger?: boolean;
  start?: string;
  markers?: boolean;
}

/**
 * Hook for creating text reveal animations with SplitText
 */
export const useTextReveal = (
  textRef: React.RefObject<HTMLElement>,
  options: TextRevealOptions = {}
) => {
  useLayoutEffect(() => {
    if (!textRef.current) return;
    
    const element = textRef.current;
    const {
      type = 'words',
      duration = 0.8,
      stagger = 0.03,
      y = 50,
      ease = 'power3.out',
      scrollTrigger: useScrollTrigger = true,
      start = 'top bottom-=100',
      markers = false,
    } = options;
    
    const ctx = gsap.context(() => {
      // Initialize SplitText
      const splitTypes = type === 'words' 
        ? 'words' 
        : type === 'chars' 
          ? 'words,chars' 
          : 'lines';
          
      const split = new SplitText(element, { type: splitTypes });
      
      // Get the elements to animate based on type
      const elements = type === 'words' 
        ? split.words 
        : type === 'chars' 
          ? split.chars 
          : split.lines;
      
      if (useScrollTrigger) {
        gsap.from(elements, {
          opacity: 0,
          y,
          duration,
          stagger,
          ease,
          scrollTrigger: {
            trigger: element,
            start,
            markers,
            toggleActions: 'play none none reset',
          },
          onComplete: () => split.revert(),
        });
      } else {
        gsap.from(elements, {
          opacity: 0,
          y,
          duration,
          stagger,
          ease,
          onComplete: () => split.revert(),
        });
      }
    }, textRef);
    
    return () => ctx.revert();
  }, [textRef, options]);
};