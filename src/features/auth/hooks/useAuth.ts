import { useContext } from 'react';
import { AuthContext, AuthContextType } from '@/features/auth/context/AuthContext';

/**
 * Custom hook to use the auth context
 * 
 * @example
 * const { user, isAuthenticated, login, logout } = useAuth();
 * 
 * @returns {AuthContextType} The auth context value
 * @throws {Error} If used outside of AuthProvider
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};