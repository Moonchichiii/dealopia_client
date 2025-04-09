import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authService } from '@/api/services/authService';
import { RegisterData } from '@/types';

// Helper function to format error messages
export function formatAuthError(error: unknown): string {
  let errorMessage = 'An error occurred. Please try again.';
  if (error && typeof error === 'object' && 'response' in error) {
    const errObj = error as { response?: { data?: unknown } };
    const errorData = errObj.response?.data;
    if (typeof errorData === 'string') {
      errorMessage = errorData;
    } else if (errorData && typeof errorData === 'object' && 'detail' in errorData) {
      errorMessage = String((errorData as { detail: string }).detail);
    } else if (
      errorData &&
      typeof errorData === 'object' &&
      'non_field_errors' in errorData
    ) {
      const nonFieldErrors = (errorData as { non_field_errors: unknown }).non_field_errors;
      errorMessage = Array.isArray(nonFieldErrors)
        ? nonFieldErrors.join(', ')
        : String(nonFieldErrors);
    } else if (errorData && typeof errorData === 'object' && 'error' in errorData) {
      errorMessage = String((errorData as { error: unknown }).error);
    } else if (errorData && typeof errorData === 'object') {
      errorMessage = Object.entries(errorData)
        .filter(([field]) => field !== 'status' && field !== 'code')
        .map(([field, errors]) =>
          Array.isArray(errors)
            ? `${field}: ${errors.join(', ')}`
            : `${field}: ${errors}`
        )
        .join('; ');
    }
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }
  return errorMessage;
}

export const USER_QUERY_KEY = ['auth', 'user'] as const;

export function useUser() {
  return useQuery({
    queryKey: USER_QUERY_KEY,
    queryFn: () => authService.getProfile(),
    retry: 1,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
    initialData: () => authService.getUserFromStorage(),
    enabled: authService.isAuthenticated(),
  });
}

export function useLogin() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (credentials: unknown) => {
      if (typeof credentials === 'object' && credentials !== null && 'provider' in credentials) {
        return authService.socialLogin(credentials as Record<string, unknown>);
      } else {
        return authService.login(credentials as Record<string, unknown>);
      }
    },
    onSuccess: (data) => {
      // Check if 2FA is required
      if ((data as { requires_2fa?: boolean }).requires_2fa) {
        return data;
      }
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
      toast.success('Login successful!');
      return data;
    },
    onError: (error: unknown) => {
      const errorMessage = formatAuthError(error);
      toast.error(errorMessage);
      throw error;
    },
  });

  return {
    login: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
}

export function useRegister() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (userData: RegisterData) => authService.register(userData),
    onSuccess: (response) => {
      if (!(response as { requiresVerification?: boolean }).requiresVerification) {
        queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
      }
      return response;
    },
    onError: (error: unknown) => {
      const errorMessage = formatAuthError(error);
      toast.error(errorMessage);
      throw error;
    },
  });

  return {
    register: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
}

export function useLogout() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const hardLogout = (): boolean => {
    queryClient.removeQueries({ queryKey: USER_QUERY_KEY });
    queryClient.clear();

    sessionStorage.removeItem('tanstack-query-state');

    document.cookie.split(';').forEach((c) => {
      document.cookie = c
        .replace(/^ +/, '')
        .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
    });

    ['sessionid', 'csrftoken', 'refresh_token', 'access_token', 'auth_token', 'refresh-token'].forEach(
      (cookieName) => {
        document.cookie = `${cookieName}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;`;
        document.cookie = `${cookieName}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname};`;
      }
    );

    authService.clearAuthData();
    localStorage.clear();
    sessionStorage.clear();

    toast.info('You have been logged out');
    return true;
  };

  const mutation = useMutation({
    mutationFn: async () => {
      try {
        await authService.logout();
      } catch (error) {
        console.error('Server logout failed:', error);
      }
      return hardLogout();
    },
    onSettled: () => {
      navigate('/', { replace: true });
    },
  });

  return {
    logout: mutation.mutateAsync,
    isLoading: mutation.isPending,
  };
}

export function useVerifyTwoFactor() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ userId, token }: { userId: string; token: string }) =>
      authService.verifyTwoFactor(userId, token),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
      return response;
    },
    onError: (err: unknown) => {
      const errorMessage = formatAuthError(err);
      toast.error(errorMessage);
      throw err;
    },
  });

  return {
    verifyTwoFactor: mutation.mutateAsync,
    isLoading: mutation.isPending,
  };
}

export function checkIsAuthenticated(): boolean {
  return authService.isAuthenticated();
}

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
    verifyTwoFactor,
  };
}
