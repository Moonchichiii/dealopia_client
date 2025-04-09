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
 * Integrates with Django backend roles and permissions
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

  // Check user roles and permissions
  const checkUserPermissions = () => {
    if (!user || !requiredRoles.length) return true;

    // Check if user has any of the required roles
    const userRoles = [
      // Default role from Django backend
      user.notification_preferences?.role,
      // Additional roles if user is staff or superuser
      user.is_staff && 'staff',
      user.is_superuser && 'admin'
    ].filter(Boolean) as string[];

    return requiredRoles.some(role => userRoles.includes(role));
  };

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

  // Handle authentication requirement
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

  // Redirect authenticated users away from auth pages
  if (isAuthenticated && !requireAuth) {
    return <Navigate to="/dashboard" replace />;
  }

  // Check role-based access
  if (isAuthenticated && requireAuth && requiredRoles.length > 0) {
    const hasPermission = checkUserPermissions();

    if (!hasPermission) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-950 p-4">
          <div className="bg-neutral-900/50 backdrop-blur-sm rounded-xl p-8 max-w-md w-full">
            <h2 className="text-xl font-display font-bold text-white mb-3">Access Denied</h2>
            <p className="text-neutral-400 mb-6">
              You don't have the required permissions to access this page.
              {user?.notification_preferences?.role && (
                <span className="block mt-2">
                  Current role: {user.notification_preferences.role}
                </span>
              )}
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