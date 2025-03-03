import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '@/components/layout/header/index';
import Footer from '@/components/layout/Footer/Footer';
import Loader from '@/components/common/Loader';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto p-4">
        <Suspense fallback={<Loader progress={50} />}>
          <Outlet />
        </Suspense>
      </main>
      
      <Footer />
    </div>
  );
};

export default Layout;