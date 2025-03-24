import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

/**
 * Redirects to login if user is not authenticated
 */
const ProtectedRoute = ({ 
  children, 
  requireAuth = true 
}: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-950">
        <div className="bg-stone-900/50 backdrop-blur-sm rounded-xl p-8 flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mb-4"></div>
          <p className="text-stone-300">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated && requireAuth) {
    return <Navigate to="/signin" state={{ from: location.pathname }} replace />;
  }

  if (isAuthenticated && !requireAuth) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
