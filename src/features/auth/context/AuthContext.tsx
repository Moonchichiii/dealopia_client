import React, { createContext, ReactNode, useMemo } from 'react';
import { UserProfile, AuthError } from '@/types/auth';
import { useAuthState } from '../hooks/useAuthState';

// Define the shape of the Auth Context
export interface AuthContextType {
  // State
  user: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: AuthError | null;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (profileData: Partial<UserProfile>) => Promise<UserProfile>;
  clearError: () => void;
}

// Create the context with an undefined initial value
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Use the custom hook for all auth state and operations
  const auth = useAuthState();
  
  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => auth, [
    auth.user,
    auth.isLoading,
    auth.isAuthenticated,
    auth.error
  ]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};