// src/hooks/useAuth.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import apiClient from '@/api/client';
import { LoginCredentials, RegisterData, UserProfile } from '@/types';

// Format error messages from API responses
export function formatAuthError(error: any): string {
  let errorMessage = 'An error occurred. Please try again.';
  const errorData = error.response?.data;
 
  if (errorData) {
    if (typeof errorData === 'string') {
      errorMessage = errorData;
    } else if (errorData.detail) {
      errorMessage = errorData.detail;
    } else if (errorData.non_field_errors) {
      errorMessage = Array.isArray(errorData.non_field_errors)
        ? errorData.non_field_errors.join(', ')
        : errorData.non_field_errors;
    } else if (errorData.error) {
      errorMessage = errorData.error;
    } else {
      // Handle field-specific errors
      const fieldErrors = Object.entries(errorData)
        .filter(([field]) => field !== 'status' && field !== 'code')
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
 
  return errorMessage;
}

// API functions
async function getProfile(): Promise<UserProfile> {
  const response = await apiClient.get('/auth/me/');
  return response.data;
}

async function login(credentials: LoginCredentials): Promise<any> {
  const response = await apiClient.post('/auth/login/', credentials);
  return response.data;
}

async function socialLogin(params: any): Promise<any> {
  const response = await apiClient.post('/auth/social-login/', params);
  return response.data;
}

async function register(userData: RegisterData): Promise<any> {
  const response = await apiClient.post('/auth/registration/', userData);
  return response.data;
}

async function logoutRequest(): Promise<void> {
  try {
    // Make sure to include credentials to send cookies
    await apiClient.post('/auth/logout/', {}, {
      withCredentials: true
    });
  } catch (error) {
    console.error('Server logout failed:', error);
    // We'll continue with client-side logout even if server logout fails
  }
}

async function verifyTwoFactor(params: { userId: string; token: string }): Promise<any> {
  const response = await apiClient.post('/auth/2fa/verify/', {
    user_id: params.userId,
    token: params.token
  });
  return response.data;
}

// User query key
export const USER_QUERY_KEY = ['auth', 'user'];

// Hook to fetch and manage the current user
export function useUser() {
  return useQuery({
    queryKey: USER_QUERY_KEY,
    queryFn: getProfile,
    retry: 1,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Hook for login functionality
export function useLogin() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (credentials: any) => {
      if ('provider' in credentials) {
        return socialLogin(credentials);
      } else {
        return login(credentials);
      }
    },
    onSuccess: (data) => {
      // Check if it's a 2FA response
      if (data.requires_2fa) {
        return data;
      }
      
      // Invalidate user query to refetch
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
      toast.success('Login successful!');
      return data;
    },
    onError: (error: any) => {
      const errorMessage = formatAuthError(error);
      toast.error(errorMessage);
      throw error;
    }
  });

  return {
    login: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error
  };
}

// Hook for registration
export function useRegister() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: register,
    onSuccess: (response) => {
      if (!response.requiresVerification) {
        queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
      }
      return response;
    },
    onError: (error: any) => {
      const errorMessage = formatAuthError(error);
      toast.error(errorMessage);
      throw error;
    }
  });

  return {
    register: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error
  };
}

// Hook for logout - IMPROVED VERSION
export function useLogout() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
  
    const mutation = useMutation({
      mutationFn: async () => {
        try {
          // First attempt server-side logout
          await apiClient.post('/auth/logout/', {}, {
            withCredentials: true
          });
        } catch (error) {
          console.error('Server logout failed:', error);
        }
        
        // Even if server fails, ensure client-side cleanup
        return hardLogout();
      },
      onSettled: () => {
        // Navigate to homepage
        navigate('/', { replace: true });
      }
    });
  
    return {
      logout: mutation.mutateAsync,
      isLoading: mutation.isPending
    };
  }
  
  // Add this hardLogout function to ensure all auth state is cleared
  function hardLogout() {
    // Clear all query cache
    const queryClient = new QueryClient();
    queryClient.clear();
    
    // Clear all cookies with various approaches to ensure they're gone
    document.cookie.split(";").forEach(function(c) {
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    
    // Double-check specific cookies we know are important
    ["sessionid", "csrftoken", "refresh_token", "access_token", "auth-token", "refresh-token"].forEach(cookieName => {
      document.cookie = `${cookieName}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;`;
    });
    
    // Clear any local storage (just to be safe)
    localStorage.clear();
    sessionStorage.clear();
    
    // Display logout message
    toast.info('You have been logged out');
    
    return true;
  }

// Hook for two-factor authentication
export function useVerifyTwoFactor() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: verifyTwoFactor,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
      return response;
    },
    onError: (err: any) => {
      const errorMessage = formatAuthError(err);
      toast.error(errorMessage);
      throw err;
    }
  });

  return {
    verifyTwoFactor: mutation.mutateAsync,
    isLoading: mutation.isPending
  };
}

// Check if user is authenticated - with cookies this will rely on the ME endpoint
export function checkIsAuthenticated() {
  // This will rely on the /auth/me/ endpoint - if it returns 200, user is authenticated
  // Otherwise, they are not authenticated
  return false; // Default to false and let the query determine auth status
}

// Export all hooks
export function useAuth() {
  const { data: user, isLoading: isLoadingUser } = useUser();
  const { login: loginFn, isLoading: isLoadingLogin } = useLogin();
  const { register: registerFn, isLoading: isLoadingRegister } = useRegister();
  const { logout: logoutFn, isLoading: isLoadingLogout } = useLogout();
  const { verifyTwoFactor } = useVerifyTwoFactor();

  return {
    user,
    isAuthenticated: !!user,
    isLoading: isLoadingUser || isLoadingLogin || isLoadingRegister || isLoadingLogout,
    login: loginFn,
    register: registerFn,
    logout: logoutFn,
    verifyTwoFactor
  };
}