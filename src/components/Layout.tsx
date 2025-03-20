import { Suspense, useEffect, useState, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/Footer';
import Loader from '@/components/Loader';
import LandingPage from '@/pages/landing/Landing';

// Import GSAP
import { useGSAP,ScrollTrigger } from '@/utils/useGsap';

const Layout = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const [showContent, setShowContent] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const layoutRef = useRef<HTMLDivElement>(null);
  
  // Set up page background
  useEffect(() => {
    document.body.style.backgroundColor = isHomePage ? '#0E0C15' : '';
    
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, [isHomePage]);

  // Initialize GSAP for the layout
  useGSAP(() => {
    // Set up ScrollTrigger config
    ScrollTrigger.config({
      autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load,resize'
    });
    
    return () => {
      // Clean up all ScrollTrigger instances when the layout unmounts
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  // Function to handle scroll down to content
  const handleExploreClick = () => {
    setShowContent(true);
    
    // Ensure content is rendered before scrolling
    setTimeout(() => {
      if (contentRef.current) {
        window.scrollTo({
          top: window.innerHeight,
          behavior: 'smooth'
        });
      }
    }, 100);
  };

  return (
    <div ref={layoutRef} className="min-h-screen flex flex-col relative">
      {isHomePage && !showContent ? (
        // Show landing page for homepage when content is not revealed
        <LandingPage onExploreClick={handleExploreClick} />
      ) : (
        // Regular site layout after user scrolls down or on other pages
        <>
          {/* Header is outside the main content flow */}
          <Header />
          
          <main
            ref={contentRef}
            className="flex-grow w-full"
            style={{
              paddingTop: isHomePage ? "0" : ""
            }}
          >
            <Suspense fallback={<Loader progress={50} />}>
              <Outlet />
            </Suspense>
          </main>
          
          <Footer />
        </>
      )}
    </div>
  );
};

export default Layout;