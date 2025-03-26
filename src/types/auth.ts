export interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  avatar?: string;
  preferred_language?: string;
  location?: number | Location;
  favorite_categories?: number[] | Category[];
  notification_preferences?: Record<string, any>;
  has_2fa_enabled?: boolean;
  date_joined?: string;
  last_login?: string;
  sustainability_preference?: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
  remember?: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  password_confirm: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  preferred_language?: string;
  provider?: 'google' | 'facebook' | 'github'; // For social registrations
}

export interface AuthState {
  isAuthenticated: boolean;
  user: UserProfile | null;
  error: string | null;
  isLoading: boolean;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface TwoFactorAuthResponse {
  requires_2fa: boolean;
  user_id: string;
  message: string;
}

export interface TwoFactorSetupResponse {
  qr_code: string;
  secret: string;
  instructions: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  token: string;
  new_password1: string;
  new_password2: string;
}

export interface EmailChangeRequest {
  new_email: string;
  password: string;
}