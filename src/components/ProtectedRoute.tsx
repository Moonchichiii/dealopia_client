import { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import apiClient, { updateAuthStatus } from '@/api/client';
import Loader from './common/Loader';

const ProtectedRoute = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if auth cookies exist first to avoid unnecessary requests
        const cookies = document.cookie.split(';');
        const hasAuthCookie = cookies.some(cookie => 
          cookie.trim().startsWith('auth-token=')
        );
        
        if (!hasAuthCookie) {
          setIsAuthenticated(false);
          updateAuthStatus(false);
          setIsLoading(false);
          return;
        }
        
        // Only make the API call if we have an auth cookie
        const response = await apiClient.get('/auth/me/');
        setIsAuthenticated(true);
        updateAuthStatus(true);
      } catch (error) {
        console.error('Authentication check failed:', error);
        setIsAuthenticated(false);
        updateAuthStatus(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return <Loader size="lg" message="Verifying authentication..." />;
  }

  if (!isAuthenticated) {
    // Redirect to login with a return path
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
};

export default ProtectedRoute;