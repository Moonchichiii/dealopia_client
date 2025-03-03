import React from 'react';
import { Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

interface ProtectedRouteProps {
    children: JSX.Element;
}

// Protected Route Component
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    // Use TanStack Query to check authentication status
    const { data: user, isLoading } = useQuery({
        queryKey: ['auth', 'currentUser'],
        // This assumes you have an endpoint to verify the user's authentication status
        // The HTTP-only cookie will be sent automatically with this request
        queryFn: async () => {
            const response = await fetch('/api/auth/me');
            if (!response.ok) throw new Error('Not authenticated');
            return response.json();
        },
        // Don't retry on 401/403 errors
        retry: (failureCount, error: any) => {
            if (error.message === 'Not authenticated') return false;
            return failureCount < 3;
        },
    });

    // Show loading state or spinner while checking authentication
    if (isLoading) {
        return <div>Loading...</div>; // Consider using a proper loading component
    }

    // If we don't have a user, they're not authenticated
    if (!user) {
        return <Navigate to="/" replace />;
    }
    
    return children;
};

export default ProtectedRoute;
  