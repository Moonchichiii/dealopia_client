
import { Navigate, useLocation } from 'react-router-dom';
import { useUser, checkIsAuthenticated } from '@/hooks/useAuth';
import { Loader } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requiredRoles?: string[];
}

/**
 * Protected route with role-based access control
 */
const ProtectedRoute = ({
  children,
  requireAuth = true,
  requiredRoles = []
}: ProtectedRouteProps) => {
  const { data: user, isLoading, error } = useUser();
  const location = useLocation();
  
  // Fast initial check from local storage before query completes
  const isAuthenticated = user !== null || (!isLoading && !error && checkIsAuthenticated());

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950">
        <div className="bg-neutral-900/50 backdrop-blur-sm rounded-xl p-8 flex flex-col items-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Loader className="w-6 h-6 text-primary-400 animate-spin" />
            <span className="text-neutral-300 font-medium">Verifying authentication...</span>
          </div>
          <p className="text-neutral-500 text-sm">This will only take a moment</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated && requireAuth) {
    return (
      <Navigate
        to="/signin"
        state={{
          from: location.pathname,
          message: "Please sign in to access this page"
        }}
        replace
      />
    );
  }

  if (isAuthenticated && !requireAuth) {
    return <Navigate to="/dashboard" replace />;
  }

  if (isAuthenticated && requireAuth && requiredRoles.length > 0 && user) {
    const hasRequiredRole = user?.notification_preferences?.role
      ? requiredRoles.includes(user.notification_preferences.role)
      : false;

    if (!hasRequiredRole) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-950 p-4">
          <div className="bg-neutral-900/50 backdrop-blur-sm rounded-xl p-8 max-w-md w-full">
            <h2 className="text-xl font-display font-bold text-white mb-3">Access Denied</h2>
            <p className="text-neutral-400 mb-6">
              You don't have the required permissions to access this page.
            </p>
            <div className="flex justify-center">
              <button
                onClick={() => window.history.back()}
                className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;