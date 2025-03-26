// src/components/layout/Layout.tsx
import { lazy, Suspense, useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import { ScrollTrigger } from '@/utils/useGsap';
import { useGSAP } from '@/utils/useGsap';

import CookieConsent from '@/components/CookieConsent';
import Header from '@/components/layout/Header';
import Loader from '@/components/Loader';

const Footer = lazy(() => import('@/components/layout/Footer'));

const Layout = () => {
  const location = useLocation();  
  
  const isHomePage = location.pathname === '/';
  const [showFooter, setShowFooter] = useState(false);
  
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

  useGSAP(() => {
    ScrollTrigger.config({
      autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load,resize'
    });
    
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  useEffect(() => {
    const footerObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShowFooter(true);
          footerObserver.disconnect();
        }
      },
      { rootMargin: '200px' }
    );

    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
      footerObserver.observe(footerPlaceholder);
    }

    return () => footerObserver.disconnect();
  }, []);

  return (
    <div className="min-h-screen flex flex-col relative text-gray-100">
      <Header />
      
      <main className={`flex-grow w-full ${isHomePage ? 'p-0' : 'pt-16 px-4'}`}>
        <Suspense fallback={<Loader progress={50} />}>
          <Outlet />
        </Suspense>
      </main>
      
      <div 
        id="footer-placeholder" 
        className="footer-placeholder"
        style={{ display: showFooter ? 'none' : 'block' }}
      />
      
      {showFooter && (
        <Suspense fallback={<div className="footer-placeholder" />}>
          <Footer />
        </Suspense>
      )}      
      <CookieConsent />
    </div>
  );
};

export default Layout;