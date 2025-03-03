import { lazy, Suspense } from 'react'
import { 
  createBrowserRouter, 
  RouterProvider, 
  useRouteError, 
  Outlet
} from 'react-router-dom'

import ProtectedRoute from '@/components/ProtectedRoute'
import Layout from '@/components/layout/Layout'

// Error Boundary component
function ErrorBoundary() {
  const error = useRouteError();
  return (
    <div className="error-container">
      <h2>Oops! Something went wrong</h2>
      <p>{error.message || 'An unexpected error occurred'}</p>
    </div>
  );
}

// Lazy-loaded pages with Suspense wrappers
const Home = lazy(() => import('./pages/home/Home'))
const Deals = lazy(() => import('./pages/deals/Deals'))
const DealDetail = lazy(() => import('./pages/deals/DealDetail'))
const Shops = lazy(() => import('./pages/shops/Shops'))
const ShopDetail = lazy(() => import('./pages/shops/ShopDetail'))
const Dashboard = lazy(() => import('./pages/dashboard/Dashboard'))
const NotFound = lazy(() => import('./pages/NotFound'))

// Create the router configuration
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Layout>
        <Suspense fallback={<div>Loading...</div>}>
          <Outlet />
        </Suspense>
      </Layout>
    ),
    errorElement: <ErrorBoundary />,
    children: [
      { index: true, element: <Home /> },
      { path: "deals", element: <Deals /> },
      { path: "deals/:id", element: <DealDetail /> },
      { path: "shops", element: <Shops /> },
      { path: "shops/:id", element: <ShopDetail /> },
      { 
        path: "dashboard/*", 
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        )
      },
      { path: "*", element: <NotFound /> }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App