import { Suspense, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '@/components/layout/header/index';
import Footer from '@/components/layout/footer/Footer';
import Loader from '@/components/common/Loader';
import DealopiaCanvas from '@/pages/landing/Landing';

const Layout = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  
  // Ensure proper background color
  useEffect(() => {
    document.body.style.backgroundColor = isHomePage ? '#080420' : '';
    
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, [isHomePage]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className={`flex-grow ${isHomePage ? '' : 'container mx-auto p-4'}`}>
        <Suspense fallback={<Loader progress={50} />}>
          {isHomePage ? (
            <DealopiaCanvas onExploreClick={() => {
              document.querySelector('.trending-section')?.scrollIntoView({ 
                behavior: 'smooth' 
              });
            }} />
          ) : null}
          <Outlet />
        </Suspense>
      </main>
      
      <Footer />
    </div>
  );
};

export default Layout;