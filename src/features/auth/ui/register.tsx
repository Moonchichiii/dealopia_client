'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { useTranslation } from 'react-i18next';

export default function Register() {
  const { t } = useTranslation('common');
  const { register, isLoading, error } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    password_confirm: '',
    first_name: '',
    last_name: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(formData);
      // Redirect happens in the auth context
    } catch (error) {
      // Error handling is done in the auth context
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <Link href="/" className="flex items-center justify-center gap-3 mb-8">
            <div className="w-10 h-10 bg-accent-pink rounded-sm flex items-center justify-center font-bold text-xl">
              D
            </div>
            <div className="text-2xl font-semibold text-text-primary tracking-tight">Dealopia</div>
          </Link>
          
          <h2 className="mt-6 text-center text-3xl font-extrabold text-text-primary">
            {t('auth.createAccount', 'Create an account')}
          </h2>
          <p className="mt-2 text-center text-sm text-text-secondary">
            {t('auth.alreadyHaveAccount', 'Already have an account?')}{' '}
            <Link href="/login" className="font-medium text-accent-pink hover:text-accent-pink/80">
              {t('auth.signIn', 'Sign in')}
            </Link>
          </p>
        </div>
        
        {error && (
          <div className="rounded-md bg-red-500/10 p-4 border border-red-500/20">
            <div className="text-sm text-red-400">{error.message}</div>
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email-address" className="block text-sm font-medium text-text-secondary mb-1">
                {t('auth.emailAddress', 'Email address')}
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-white/10 rounded-md bg-bg-secondary placeholder-text-secondary/50 text-text-primary focus:outline-none focus:ring-accent-pink focus:border-accent-pink focus:z-10 sm:text-sm"
                placeholder={t('auth.emailPlaceholder', 'you@example.com')}
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="first-name" className="block text-sm font-medium text-text-secondary mb-1">
                  {t('auth.firstName', 'First name')}
                </label>
                <input
                  id="first-name"
                  name="first_name"
                  type="text"
                  autoComplete="given-name"
                  className="appearance-none relative block w-full px-3 py-2 border border-white/10 rounded-md bg-bg-secondary placeholder-text-secondary/50 text-text-primary focus:outline-none focus:ring-accent-pink focus:border-accent-pink focus:z-10 sm:text-sm"
                  placeholder={t('auth.firstNamePlaceholder', 'First name')}
                  value={formData.first_name}
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <label htmlFor="last-name" className="block text-sm font-medium text-text-secondary mb-1">
                  {t('auth.lastName', 'Last name')}
                </label>
                <input
                  id="last-name"
                  name="last_name"
                  type="text"
                  autoComplete="family-name"
                  className="appearance-none relative block w-full px-3 py-2 border border-white/10 rounded-md bg-bg-secondary placeholder-text-secondary/50 text-text-primary focus:outline-none focus:ring-accent-pink focus:border-accent-pink focus:z-10 sm:text-sm"
                  placeholder={t('auth.lastNamePlaceholder', 'Last name')}
                  value={formData.last_name}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text-secondary mb-1">
                {t('auth.password', 'Password')}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-white/10 rounded-md bg-bg-secondary placeholder-text-secondary/50 text-text-primary focus:outline-none focus:ring-accent-pink focus:border-accent-pink focus:z-10 sm:text-sm"
                placeholder={t('auth.passwordPlaceholder', 'Create a password')}
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label htmlFor="password-confirm" className="block text-sm font-medium text-text-secondary mb-1">
                {t('auth.confirmPassword', 'Confirm password')}
              </label>
              <input
                id="password-confirm"
                name="password_confirm"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-white/10 rounded-md bg-bg-secondary placeholder-text-secondary/50 text-text-primary focus:outline-none focus:ring-accent-pink focus:border-accent-pink focus:z-10 sm:text-sm"
                placeholder={t('auth.confirmPasswordPlaceholder', 'Confirm your password')}
                value={formData.password_confirm}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-semibold rounded-full text-white bg-accent-pink hover:bg-accent-pink/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-pink focus:ring-offset-bg-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t('auth.creatingAccount', 'Creating account...')}
                </span>
              ) : (
                t('auth.createAccount', 'Create account')
              )}
            </button>
          </div>
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-bg-primary text-text-secondary">{t('auth.orContinueWith', 'Or continue with')}</span>
              </div>
            </div>
            
            <div className="mt-6">
              <button
                type="button"
                onClick={() => window.location.href='/api/v1/auth/google/'}
                className="w-full flex justify-center items-center py-2 px-4 border border-white/10 rounded-full shadow-sm bg-bg-secondary text-sm font-medium text-text-primary hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-pink focus:ring-offset-bg-primary transition-colors"
              >
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                    <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z" />
                    <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z" />
                    <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z" />
                    <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z" />
                  </g>
                </svg>
                {t('auth.signInWithGoogle', 'Sign in with Google')}
              </button>
            </div>
          </div>
          
          <p className="text-center text-xs text-text-secondary mt-6">
            {t('auth.byCreatingAccount', 'By creating an account, you agree to our')}{' '}
            <Link href="/terms" className="text-accent-pink hover:text-accent-pink/80">
              {t('auth.termsOfService', 'Terms of Service')}
            </Link>{' '}
            {t('auth.and', 'and')}{' '}
            <Link href="/privacy" className="text-accent-pink hover:text-accent-pink/80">
              {t('auth.privacyPolicy', 'Privacy Policy')}
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}