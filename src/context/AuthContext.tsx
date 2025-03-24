import { createContext, ReactNode, useMemo, useContext, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import apiServices, { SocialLoginParams } from '@/api/services';
import { UserProfile, LoginCredentials, RegisterData } from '@/types';
import { formatAuthError } from '@/utils/authUtils';

// Context type definition
interface AuthContextType {
    user: UserProfile | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    error: string | null;
    login: (credentials: LoginCredentials | SocialLoginParams) => Promise<void>;
    register: (userData: RegisterData) => Promise<void>;
    logout: () => Promise<void>;
    updateProfile: (data: Partial<UserProfile>) => Promise<void>;
    clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
    const queryClient = useQueryClient();
    const [error, setError] = useState<string | null>(null);

    const {
        data: user,
        isLoading: isUserLoading,
        refetch: refetchUser,
    } = useQuery({
        queryKey: ['auth', 'user'],
        queryFn: () => apiServices.auth.getProfile(),
        retry: 1,
        staleTime: 1000 * 60 * 5, // 5 minutes
        refetchOnWindowFocus: false,
        refetchOnMount: true,
        onError: () => {
            // Silently fail, we'll handle auth state based on user being null
        }
    });

    const loginMutation = useMutation({
        mutationFn: (credentials: LoginCredentials) => apiServices.auth.login(credentials),
        onSuccess: () => {
            refetchUser();
            setError(null);
            toast.success('Login successful!');
        },
        onError: (err: any) => {
            const errorMessage = formatAuthError(err);
            setError(errorMessage);
            toast.error(errorMessage);
        },
    });

    const socialLoginMutation = useMutation({
        mutationFn: (params: SocialLoginParams) => apiServices.auth.socialLogin(params),
        onSuccess: () => {
            refetchUser();
            setError(null);
            toast.success('Login successful!');
        },
        onError: (err: any) => {
            const errorMessage = formatAuthError(err);
            setError(errorMessage);
            toast.error(errorMessage);
        },
    });

    const registerMutation = useMutation({
        mutationFn: (userData: RegisterData) => apiServices.auth.register(userData),
        onSuccess: () => {
            setError(null);
            toast.success('Registration successful! Please verify your email.');
        },
        onError: (err: any) => {
            const errorMessage = formatAuthError(err);
            setError(errorMessage);
            toast.error(errorMessage);
        },
    });

    const logoutMutation = useMutation({
        mutationFn: () => apiServices.auth.logout(),
        onSuccess: () => {
            queryClient.setQueryData(['auth', 'user'], null);
            queryClient.invalidateQueries({ queryKey: ['auth'] });
            toast.info('You have been logged out.');
        },
    });

    const updateProfileMutation = useMutation({
        mutationFn: (data: Partial<UserProfile>) => apiServices.auth.updateProfile(data),
        onSuccess: (updatedUser) => {
            queryClient.setQueryData(['auth', 'user'], updatedUser);
            toast.success('Profile updated successfully!');
        },
        onError: (err: any) => {
            const errorMessage = formatAuthError(err);
            toast.error(errorMessage || 'Failed to update profile.');
        },
    });

    const login = async (credentials: LoginCredentials | SocialLoginParams) => {
        if ('provider' in credentials) {
            await socialLoginMutation.mutateAsync(credentials);
        } else {
            await loginMutation.mutateAsync(credentials);
        }
    };

    const register = async (userData: RegisterData) => {
        await registerMutation.mutateAsync(userData);
    };

    const logout = async () => {
        await logoutMutation.mutateAsync();
    };

    const updateProfile = async (data: Partial<UserProfile>) => {
        await updateProfileMutation.mutateAsync(data);
    };

    const clearError = () => {
        setError(null);
    };

    const isAuthenticated = !!user;

    const isLoading =
        isUserLoading ||
        loginMutation.isPending ||
        socialLoginMutation.isPending ||
        registerMutation.isPending ||
        logoutMutation.isPending;

    const value = useMemo(() => ({
        user,
        isLoading,
        isAuthenticated,
        error,
        login,
        register,
        logout,
        updateProfile,
        clearError,
    }), [
        user,
        isLoading,
        isAuthenticated,
        error
    ]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

// Auth hook
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
