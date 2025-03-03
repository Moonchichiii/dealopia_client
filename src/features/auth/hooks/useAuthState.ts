import { useCallback, useMemo } from 'react';
import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { authApi } from '@/api/services/auth';
import { UserProfile, LoginCredentials, RegisterData, AuthError } from '@/types/auth';
import { useLoginMutation, useRegisterMutation } from './useAuthMutations';

/**
 * Hook to manage authentication state
 * This hook is meant to be used inside the AuthProvider
 */
export const useAuthState = () => {
  const queryClient = useQueryClient();

  // Query for fetching the current user profile
  const {
    data: user,
    isLoading: isUserLoading,
    refetch: refetchUser,
  } = useQuery({
    queryKey: ['auth', 'user'],
    queryFn: authApi.getProfile,
    retry: false,
    staleTime: Infinity,
    useErrorBoundary: false,
  });

  // Get login and register mutations from dedicated hook
  const { 
    loginMutation, 
    registerMutation,
    isLoginLoading,
    isRegisterLoading
  } = useLoginMutation(refetchUser);

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSettled: () => {
      // Clear user data from cache regardless of success or error
      queryClient.setQueryData(['auth', 'user'], null);
      // Invalidate all queries to refetch data after logout
      queryClient.invalidateQueries();
      // Show toast notification
      toast.info('You have been logged out.');
    }
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: authApi.updateProfile,
    onSuccess: (updatedUser) => {
      // Update user data in cache
      queryClient.setQueryData(['auth', 'user'], updatedUser);
      // Show success notification
      toast.success('Profile updated successfully!');
    },
    onError: (error: any) => {
      // Show error notification
      toast.error('Failed to update profile. Please try again.');
    }
  });

  // Clear any authentication errors
  const clearError = useCallback(() => {
    queryClient.removeQueries({ queryKey: ['auth', 'error'] });
  }, [queryClient]);

  // Login handler
  const login = useCallback(async (email: string, password: string) => {
    await loginMutation.mutateAsync({ email, password });
  }, [loginMutation]);

  // Register handler
  const register = useCallback(async (userData: RegisterData) => {
    await registerMutation.mutateAsync(userData);
  }, [registerMutation]);

  // Logout handler
  const logout = useCallback(async () => {
    await logoutMutation.mutateAsync();
  }, [logoutMutation]);

  // Update profile handler
  const updateProfile = useCallback(async (profileData: Partial<UserProfile>) => {
    return await updateProfileMutation.mutateAsync(profileData);
  }, [updateProfileMutation]);

  // Get current error from query cache
  const error = queryClient.getQueryData<AuthError>(['auth', 'error']) || null;

  // Determine if the user is authenticated - memoize this value
  const isAuthenticated = useMemo(() => !!user, [user]);

  // Combine loading states - memoize this value
  const isLoading = useMemo(() => 
    isUserLoading || 
    isLoginLoading || 
    isRegisterLoading || 
    logoutMutation.isPending, 
    [isUserLoading, isLoginLoading, isRegisterLoading, logoutMutation.isPending]
  );

  // Return the auth state and methods
  return {
    user,
    isLoading,
    isAuthenticated,
    error,
    login,
    register,
    logout,
    updateProfile,
    clearError
  };
};