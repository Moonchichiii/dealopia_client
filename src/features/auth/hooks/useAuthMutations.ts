import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { authApi } from '@/api/services/auth';
import { LoginCredentials, RegisterData } from '@/types/auth';

/**
 * Hook for login and registration mutations
 * This separates these related mutations to keep the main state hook cleaner
 */
export const useLoginMutation = (
  // Function to refetch user profile after successful login
  onLoginSuccess: () => void
) => {
  const queryClient = useQueryClient();

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
    onSuccess: () => {
      // Refetch user data after successful login
      onLoginSuccess();
      // Clear any previous auth errors
      queryClient.removeQueries({ queryKey: ['auth', 'error'] });
    },
    onError: (error: any) => {
      // Set error in the query cache
      queryClient.setQueryData(['auth', 'error'], {
        message: error.response?.data?.detail || 'Login failed. Please check your credentials and try again.'
      });
      // Show a toast notification
      toast.error('Login failed. Please check your credentials and try again.');
    }
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: (userData: RegisterData) => authApi.register(userData),
    onSuccess: () => {
      // Show success notification
      toast.success('Registration successful! Please check your email to verify your account.');
      // Clear any previous auth errors
      queryClient.removeQueries({ queryKey: ['auth', 'error'] });
    },
    onError: (error: any) => {
      // Format error message
      let errorMessage = 'Registration failed. Please try again.';
      const errorData = error.response?.data;
      
      if (errorData) {
        if (typeof errorData === 'string') {
          errorMessage = errorData;
        } else if (errorData.detail) {
          errorMessage = errorData.detail;
        } else {
          // Handle field-specific errors (e.g., email: ["This email is already in use"])
          const fieldErrors = Object.entries(errorData)
            .map(([field, errors]) => {
              if (Array.isArray(errors)) {
                return `${field}: ${errors.join(', ')}`;
              }
              return `${field}: ${errors}`;
            })
            .join('; ');
          
          if (fieldErrors) {
            errorMessage = fieldErrors;
          }
        }
      }
      
      // Set error in the query cache
      queryClient.setQueryData(['auth', 'error'], { message: errorMessage });
      // Show a toast notification
      toast.error(errorMessage);
    }
  });

  return {
    loginMutation,
    registerMutation,
    isLoginLoading: loginMutation.isPending,
    isRegisterLoading: registerMutation.isPending
  };
};