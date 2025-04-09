import { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';

import { queryClient } from '@/lib/queryClient';
import Layout from '@/components/layout/Layout';
import Loader from '@/components/Loader';
import ProtectedRoute from '@/components/ProtectedRoute';

import 'react-toastify/dist/ReactToastify.css';
import '@/globals.css';

// Lazy loaded pages
const Home = lazy(() => import('@/pages/Home'));
const SignIn = lazy(() => import('@/components/auth/SignIn'));
const SignUp = lazy(() => import('@/components/auth/SignUp'));
const Dashboard = lazy(() => import('@/pages/dashboard/Dashboard'));
const About = lazy(() => import('@/pages/About'));
const NotFound = lazy(() => import('@/pages/NotFound'));

const useModalRoot = (): void => {
  useEffect(() => {
    if (!document.getElementById('modal-root')) {
      const modalRoot = document.createElement('div');
      modalRoot.id = 'modal-root';
      document.body.appendChild(modalRoot);
    }
  }, []);
};

function App(): JSX.Element {
  useModalRoot();

  return (
    <QueryClientProvider client={queryClient}>
        <Router>
          <Suspense fallback={<Loader progress={50} />}>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="about" element={<About />} />
                <Route
                  path="signin"
                  element={
                    <ProtectedRoute requireAuth={false}>
                      <SignIn />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="signup"
                  element={
                    <ProtectedRoute requireAuth={false}>
                      <SignUp />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="dashboard/*"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </Suspense>
        </Router>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </QueryClientProvider>
  );
}

export default App;