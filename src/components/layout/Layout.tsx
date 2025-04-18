import { lazy, Suspense, useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { ScrollTrigger, useGSAP } from '@/utils/useGsap';
import CookieConsent from '@/components/utils/CookieConsent';
import Header from '@/components/layout/Header';
import Loader from '@/components/ui/Loader';
import { ScrollToTopButton } from '@/components/utils/ScrollToTop';
import { useTheme } from '@/context/ThemeContext';
const Footer = lazy(() => import('@/components/layout/Footer'));

const Layout = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const [showFooter, setShowFooter] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === 'dark';

  useEffect(() => {
    if (isHomePage) {
      document.body.classList.add('home-page');
      if (isDarkMode) {
        document.body.style.background = 'linear-gradient(135deg, rgba(76, 29, 149, 0.3) 0%, #0a0a0a 50%, rgba(22, 78, 99, 0.3) 100%)';
      } else {
        document.body.style.background = 'linear-gradient(135deg, rgba(167, 139, 250, 0.1) 0%, #f5f7fa 50%, rgba(103, 232, 249, 0.1) 100%)';
      }
    } else {
      document.body.classList.remove('home-page');
      document.body.style.backgroundColor = isDarkMode ? '#0a0a0a' : '#f5f7fa';
      // Reset background for non-home pages
      document.body.style.background = '';
    }
    return () => {
      document.body.classList.remove('home-page');
      document.body.style.background = '';
      document.body.style.backgroundColor = '';
    };
  }, [isHomePage, isDarkMode]);

  useGSAP(() => {
    ScrollTrigger.config({
      autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load,resize'
    });
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  useEffect(() => {
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (!footerPlaceholder) return; // Guard clause if placeholder not found

    const footerObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShowFooter(true);
          footerObserver.unobserve(footerPlaceholder); // More specific than disconnect
        }
      },
      { rootMargin: '200px' }
    );

    footerObserver.observe(footerPlaceholder);

    return () => {
        // Check if the observer is still observing the element before unobserving
        if (footerPlaceholder) {
            footerObserver.unobserve(footerPlaceholder);
        }
        // Disconnect might still be useful if observing multiple elements, but unobserve is safer here
        footerObserver.disconnect();
    };
  }, []); // No dependencies needed if it only runs once on mount

  return (
    <div className={`min-h-screen flex flex-col relative ${isDarkMode ? 'dark text-gray-100' : 'light text-gray-900'}`}>
      <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      {/* Apply responsive padding using Tailwind classes */}
      <main className={`flex-grow w-full ${isHomePage ? 'p-0' : 'pt-16 px-4 md:px-8'} relative z-10`}>
        <Suspense fallback={<Loader progress={50} />}>
          <Outlet />
        </Suspense>
      </main>
      <div id="footer-placeholder" className="footer-placeholder relative z-10" style={{ display: showFooter ? 'none' : 'block', height: '1px' }} /> {/* Added height for observer */}
      {showFooter && (
        <Suspense fallback={<div className="footer-placeholder relative z-10" style={{ height: '1px' }} />}> {/* Added height for consistency */}
          <Footer />
        </Suspense>
      )}
      <CookieConsent />
      <ScrollToTopButton />
    </div>
  );
};

export default Layout;