import { Location } from './locations';
import { Category } from './categories';

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  avatar: string | null;
  preferred_language: string;
  location: Location | null;
  favorite_categories: Category[];
  notification_preferences: Record<string, boolean>;
}

export interface LoginCredentials {
  username?: string;
  email?: string;
  password: string;
}

export interface RegisterData {
  username?: string;
  email: string;
  password: string;
  password_confirm: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: UserProfile | null;
  isLoading: boolean;
  error: AuthError | null;
}

export interface AuthError {
  message: string;
  code?: string;
  fieldErrors?: Record<string, string[]>;
}

export interface ResetPasswordData {
  uid: string;
  token: string;
  new_password1: string;
  new_password2: string;
}

export interface ForgotPasswordData {
  email: string;
}