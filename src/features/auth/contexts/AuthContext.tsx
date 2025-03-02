'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

// Use Next.js App Router navigation
import { useRouter, usePathname } from 'next/navigation';

interface User {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  // Add other user fields as needed
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: Error | null;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  googleLogin: () => void;
  verifyEmail: (key: string) => Promise<void>;
  refreshToken: () => Promise<void>;
}

interface RegisterData {
  email: string;
  password: string;
  password_confirm: string;
  first_name?: string;
  last_name?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    error: null,
  });

  // Fetch current user
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      try {
        const response = await api.get('/api/v1/auth/me/');
        return response.data;
      } catch (error) {
        return null;
      }
    },
    // Only run this query if we think the user is authenticated
    enabled: typeof window !== 'undefined' && !!localStorage.getItem('isAuthenticated'),
    retry: false,
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const response = await api.post('/api/v1/auth/login/', { email, password });
      return response.data;
    },
    onSuccess: async (data) => {
      // Store tokens if not using HTTP-only cookies
      // For HTTP-only cookies, they'll be handled automatically
      localStorage.setItem('isAuthenticated', 'true');
      
      // Refetch the current user
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
      
      router.push('/dashboard');
    },
    onError: (error: any) => {
      setAuthState(prev => ({
        ...prev,
        error: new Error(error.response?.data?.detail || 'Login failed'),
      }));
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: async (userData: RegisterData) => {
      const response = await api.post('/api/v1/auth/registration/', userData);
      return response.data;
    },
    onSuccess: (data) => {
      router.push('/verify-email');
    },
    onError: (error: any) => {
      setAuthState(prev => ({
        ...prev,
        error: new Error(error.response?.data?.detail || 'Registration failed'),
      }));
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post('/api/v1/auth/logout/');
      return response.data;
    },
    onSuccess: () => {
      localStorage.removeItem('isAuthenticated');
      queryClient.clear();
      router.push('/login');
    },
  });

  // Email verification mutation
  const verifyEmailMutation = useMutation({
    mutationFn: async (key: string) => {
      const response = await api.post('/api/v1/auth/registration/verify-email/', {
        key,
      });
      return response.data;
    },
    onSuccess: () => {
      router.push('/login?verified=true');
    },
  });

  // Token refresh mutation
  const refreshTokenMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post('/api/v1/auth/token/refresh/');
      return response.data;
    },
  });

  // Google login
  const googleLogin = () => {
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=${process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI}&prompt=consent&response_type=code&client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}&scope=openid%20email%20profile&access_type=offline`;
    window.location.href = googleAuthUrl;
  };

  // Update auth state when user data changes
  useEffect(() => {
    setAuthState({
      user,
      isLoading,
      isAuthenticated: !!user,
      error: error as Error | null,
    });
  }, [user, isLoading, error]);

  // Set up token refresh interval
  useEffect(() => {
    if (authState.isAuthenticated) {
      const intervalId = setInterval(() => {
        refreshTokenMutation.mutate();
      }, 25 * 60 * 1000); // Refresh token every 25 minutes

      return () => clearInterval(intervalId);
    }
  }, [authState.isAuthenticated]);

  const value = {
    ...authState,
    login: (email, password) => loginMutation.mutateAsync({ email, password }),
    register: (userData) => registerMutation.mutateAsync(userData),
    logout: () => logoutMutation.mutateAsync(),
    googleLogin,
    verifyEmail: (key) => verifyEmailMutation.mutateAsync(key),
    refreshToken: () => refreshTokenMutation.mutateAsync(),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};