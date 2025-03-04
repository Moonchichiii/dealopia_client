import { lazy, useState, useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// Components
import Layout from '@/components/layout/Layout';
import Loader from '@/components/common/Loader';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import ProtectedRoute from '@/components/ProtectedRoute';

// Lazy-loaded pages with Suspense wrappers
const Home = lazy(() => import('@/pages/home/Home'));
const Deals = lazy(() => import('@/pages/deals/Deals'));
const DealDetail = lazy(() => import('@/pages/deals/DealDetail'));
const Shops = lazy(() => import('@/pages/shops/shops'));
const ShopDetail = lazy(() => import('@/pages/shops/ShopDetail'));
const Dashboard = lazy(() => import('@/pages/dashboard/Dashboard'));
const NotFound = lazy(() => import('@/pages/notfound/NotFound'));



function App() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  // More efficient loading simulation
  useEffect(() => {
    if (loading) {
      // Faster loading simulation
      const interval = setInterval(() => {
        setProgress(prev => {
          const increment = Math.random() * 25; // Larger increments
          const newProgress = prev + increment;
          
          if (newProgress >= 99) {
            clearInterval(interval);
            setTimeout(() => {
              setProgress(100);
              setTimeout(() => setLoading(false), 300); // Shorter delay
            }, 200); // Shorter delay
            return 99;
          }
          
          return newProgress;
        });
      }, 200); // Faster interval
      
      return () => clearInterval(interval);
    }
  }, [loading]);

  // Show loader while initial loading
  if (loading) {
    return <Loader progress={progress} />;
  }

  // Create the router configuration
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      errorElement: <ErrorBoundary />,
      children: [
        { index: true, element: <Home /> },
        { path: "deals", element: <Deals /> },
        { path: "deals/:id", element: <DealDetail /> },
        { path: "shops", element: <Shops /> },
        { path: "shops/:id", element: <ShopDetail /> },
        {
          path: "dashboard/*",
          element: <ProtectedRoute><Dashboard /></ProtectedRoute>
        },
        { path: "*", element: <NotFound /> }
      ]
    }
  ]);

  return <RouterProvider router={router} />;
}

export default App;
