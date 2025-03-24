import { createContext, ReactNode, useContext, useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import apiServices from '@/api/services';
import { useAuth } from './AuthContext';
import { UserProfile } from '@/types';

interface ProfileContextType {
    profile: UserProfile | null;
    isLoading: boolean;
    updateProfile: (data: Partial<UserProfile>) => Promise<void>;
    updatePreferences: (preferences: Record<string, any>) => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
    const queryClient = useQueryClient();
    const { user, isAuthenticated } = useAuth();

    const profile = user;

    const updateProfileMutation = useMutation({
        mutationFn: apiServices.auth.updateProfile,
        onSuccess: (updatedProfile) => {
            queryClient.setQueryData(['auth', 'user'], updatedProfile);
            toast.success('Profile updated successfully!');
        },
        onError: () => {
            toast.error('Failed to update profile.');
        },
    });

    const updatePreferencesMutation = useMutation({
        mutationFn: (preferences: Record<string, any>) => 
            apiServices.auth.updateProfile({ notification_preferences: preferences }),
        onSuccess: () => {
            toast.success('Preferences updated successfully!');
        },
        onError: () => {
            toast.error('Failed to update preferences.');
        },
    });

    const updateProfile = async (data: Partial<UserProfile>) => {
        await updateProfileMutation.mutateAsync(data);
    };

    const updatePreferences = async (preferences: Record<string, any>) => {
        await updatePreferencesMutation.mutateAsync(preferences);
    };

    const value = useMemo(() => ({
        profile,
        isLoading: updateProfileMutation.isPending || updatePreferencesMutation.isPending,
        updateProfile,
        updatePreferences,
    }), [
        profile,
        updateProfileMutation.isPending,
        updatePreferencesMutation.isPending
    ]);

    if (!isAuthenticated) {
        return <>{children}</>;
    }

    return (
        <ProfileContext.Provider value={value}>
            {children}
        </ProfileContext.Provider>
    );
}

export function useProfile() {
    const context = useContext(ProfileContext);
    if (context === undefined) {
        throw new Error('useProfile must be used within a ProfileProvider');
    }
    return context;
}
