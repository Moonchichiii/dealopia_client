import { Suspense, useEffect, useState, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '@/components/layout/header/index';
import Footer from '@/components/layout/footer/Footer';
import Loader from '@/components/common/Loader';
import LandingPage from '@/pages/landing/Landing';

const Layout = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const [showContent, setShowContent] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Ensure proper background color
  useEffect(() => {
    document.body.style.backgroundColor = isHomePage ? '#080420' : '';
    
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, [isHomePage]);

  // Function to handle scroll down to content
  const handleExploreClick = () => {
    setShowContent(true);
    
    // Scroll to content section
    setTimeout(() => {
      if (contentRef.current) {
        contentRef.current.scrollIntoView({ 
          behavior: 'smooth'
        });
      }
    }, 100);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {isHomePage && !showContent ? (
        // Show landing page for homepage when content is not revealed
        <LandingPage onExploreClick={handleExploreClick} />
      ) : (
        // Regular site layout after user scrolls down or on other pages
        <>
          <Header />
          
          <main ref={contentRef} className={`flex-grow ${isHomePage ? '' : 'container mx-auto p-4'}`}>
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