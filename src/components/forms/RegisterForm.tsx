import React from 'react';
import { Loader2 } from 'lucide-react';

interface RegisterFormData {
  email: string;
  password: string;
  password_confirm: string;
  first_name: string;
  last_name: string;
}

interface RegisterFormProps {
  formData: RegisterFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  onGoogleSignup: () => void;
  isLoading: boolean;
  onSwitchToLogin: () => void;
  className?: string;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  formData,
  handleChange,
  handleSubmit,
  onGoogleSignup,
  isLoading,
  onSwitchToLogin,
  className = ''
}) => {
  return (
    <div className={`max-w-md mx-auto p-6 rounded-2xl shadow-lg bg-white dark:bg-gray-800 ${className}`}>
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800 dark:text-white">Join Dealopia</h2>
      
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              First Name
            </label>
            <input
              id="first_name"
              name="first_name"
              type="text"
              autoComplete="given-name"
              required
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border-none focus:ring-2 focus:ring-[#FF38B4] transition-all"
              placeholder="John"
              value={formData.first_name}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Last Name
            </label>
            <input
              id="last_name"
              name="last_name"
              type="text"
              autoComplete="family-name"
              required
              className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border-none focus:ring-2 focus:ring-[#FF38B4] transition-all"
              placeholder="Doe"
              value={formData.last_name}
              onChange={handleChange}
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border-none focus:ring-2 focus:ring-[#FF38B4] transition-all"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border-none focus:ring-2 focus:ring-[#FF38B4] transition-all"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="password_confirm" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Confirm Password
          </label>
          <input
            id="password_confirm"
            name="password_confirm"
            type="password"
            autoComplete="new-password"
            required
            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border-none focus:ring-2 focus:ring-[#FF38B4] transition-all"
            placeholder="••••••••"
            value={formData.password_confirm}
            onChange={handleChange}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 px-4 mt-3 rounded-xl text-white font-semibold bg-[#FF38B4] hover:bg-[#ff41bd] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF38B4] disabled:opacity-70 disabled:cursor-not-allowed shadow-md hover:shadow-xl transition-all duration-300"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <Loader2 className="animate-spin h-5 w-5 mr-3" />
              Creating account...
            </div>
          ) : (
            'Create account'
          )}
        </button>
        
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200 dark:border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
              or continue with
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onGoogleSignup}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 transition-all text-gray-700 dark:text-white font-medium"
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Sign up with Google
        </button>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="font-medium text-[#FF38B4] hover:text-[#ff41bd] focus:outline-none"
          >
            Sign in
          </button>
        </p>
      </form>
    </div>
  );
};

export default RegisterForm;
