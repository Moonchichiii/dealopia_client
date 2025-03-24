import { Suspense, useEffect, lazy, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '@/components/header';
import Loader from '@/components/Loader';
import AuthModal from '@/components/AuthModal';
import { useAuthModal } from '@/context/AuthModalContext';
import CookieConsent from '@/components/CookieConsent';
import { useGSAP, ScrollTrigger } from '@/utils/useGsap';

// Lazy load the Footer component
const Footer = lazy(() => import('@/components/Footer'));

const Layout = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const { isAuthModalOpen, initialView, closeAuthModal } = useAuthModal();
  const [showFooter, setShowFooter] = useState(false);
  
  // Background setup
  useEffect(() => {
    if (isHomePage) {
      document.body.classList.add('home-page');
      document.body.style.background = 'linear-gradient(135deg, rgba(76, 29, 149, 0.3) 0%, #0a0a0a 50%, rgba(22, 78, 99, 0.3) 100%)';
    } else {
      document.body.classList.remove('home-page');
      document.body.style.backgroundColor = '#0a0a0a';
    }
    
    return () => {
      document.body.classList.remove('home-page');
      document.body.style.background = '';
      document.body.style.backgroundColor = '';
    };
  }, [isHomePage]);

  // GSAP setup - avoid animations that cause layout shifts
  useGSAP(() => {
    ScrollTrigger.config({
      autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load,resize'
    });
    
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  // Intersection Observer for lazy loading the footer
  useEffect(() => {
    // Create observer to detect when we approach the footer placeholder
    const footerObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShowFooter(true);
          footerObserver.disconnect();
        }
      },
      { rootMargin: '200px' } // Start loading when within 200px
    );

    // Start observing the footer placeholder
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
      footerObserver.observe(footerPlaceholder);
    }

    return () => {
      footerObserver.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col relative text-gray-100">
      <Header />
      
      <main
        className={`flex-grow w-full ${isHomePage ? 'p-0' : 'pt-16 px-4'}`}
      >
        <Suspense fallback={<Loader progress={50} />}>
          <Outlet />
        </Suspense>
      </main>
      
      {/* Footer placeholder with reserved space */}
      <div 
        id="footer-placeholder" 
        className="footer-placeholder"
        style={{ display: showFooter ? 'none' : 'block' }}
      />
      
      {/* Actual footer that loads on demand */}
      {showFooter && (
        <Suspense fallback={<div className="footer-placeholder" />}>
          <Footer />
        </Suspense>
      )}

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        initialView={initialView}
      />
      
      <CookieConsent />
    </div>
  );
};

export default Layout;