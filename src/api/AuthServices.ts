// src/api/AuthService.ts
import apiClient from '@/api/client';
import { UserProfile, LoginCredentials, RegisterData } from '@/types';

// Storage keys
const TOKEN_STORAGE_KEY = 'auth_tokens';
const USER_STORAGE_KEY = 'auth.user';

// Types
export interface SocialLoginParams {
    provider: 'google' | 'facebook' | 'github';
    token?: string;
    code?: string;
}

export interface Tokens {
    access: string;
    refresh: string;
}

class AuthService {
    // Token management methods
    public getTokensFromStorage(): Tokens | null {
        try {
            const tokensStr = localStorage.getItem(TOKEN_STORAGE_KEY);
            return tokensStr ? JSON.parse(tokensStr) : null;
        } catch (error) {
            console.error('Error retrieving tokens from storage:', error);
            return null;
        }
    }

    public saveTokensToStorage(tokens: Tokens): void {
        localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(tokens));
    }

    public saveUserToStorage(user: UserProfile): void {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    }

    public getUserFromStorage(): UserProfile | null {
        const userJson = localStorage.getItem(USER_STORAGE_KEY);
        return userJson ? JSON.parse(userJson) : null;
    }

    public clearAuthData(): void {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        localStorage.removeItem(USER_STORAGE_KEY);
    }

    public isAuthenticated(): boolean {
        const tokens = this.getTokensFromStorage();
        return !!tokens?.access;
    }

    // Auth API methods that manage tokens
    public async login(credentials: LoginCredentials): Promise<any> {
        const response = await apiClient.post('/api/v1/auth/login/', credentials);
        
        if (response.data.access && response.data.refresh) {
            this.saveTokensToStorage({
                access: response.data.access,
                refresh: response.data.refresh
            });
        }
        
        return response.data;
    }

    public async socialLogin(params: SocialLoginParams): Promise<any> {
        const response = await apiClient.post('/api/v1/auth/social-login/', params);
        
        if (response.data.access && response.data.refresh) {
            this.saveTokensToStorage({
                access: response.data.access,
                refresh: response.data.refresh
            });
        }
        
        return response.data;
    }

    public async register(userData: RegisterData): Promise<any> {
        const response = await apiClient.post('/api/v1/auth/registration/', userData);
        
        if (response.data.access && response.data.refresh) {
            this.saveTokensToStorage({
                access: response.data.access,
                refresh: response.data.refresh
            });
        }
        
        return response.data;
    }

    public async logout(): Promise<void> {
        try {
            await apiClient.post('/api/v1/auth/logout/');
        } catch (error) {
            console.error('Server logout failed:', error);
        } finally {
            this.clearAuthData();
        }
    }

    public async verifyTwoFactor(userId: string, token: string): Promise<any> {
        const response = await apiClient.post('/api/v1/auth/2fa/verify/', {
            user_id: userId,
            token
        });
        
        if (response.data.access && response.data.refresh) {
            this.saveTokensToStorage({
                access: response.data.access,
                refresh: response.data.refresh
            });
        }
        
        return response.data;
    }

    public async refreshToken(): Promise<any> {
        const tokens = this.getTokensFromStorage();
        
        if (!tokens?.refresh) {
            throw new Error('No refresh token available');
        }
        
        const response = await apiClient.post('/api/v1/auth/token/refresh/', {
            refresh: tokens.refresh
        });
        
        if (response.data.access) {
            this.saveTokensToStorage({
                access: response.data.access,
                refresh: tokens.refresh
            });
        }
        
        return response.data;
    }
}

// Export a singleton instance
export const authService = new AuthService();
