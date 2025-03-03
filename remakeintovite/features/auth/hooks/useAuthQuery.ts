import { useQuery } from '@tanstack/react-query';
import { authApi } from '../api/authApi';

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: authApi.getCurrentUser,
    retry: false,
    // Only run if we're authenticated
    enabled: typeof window !== 'undefined' && !!localStorage.getItem('isAuthenticated'),
  });
};