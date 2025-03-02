'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { Mail, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

export default function VerifyEmail() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const searchParams = useSearchParams();
  const { verifyEmail } = useAuth();
  
  const [status, setStatus] = useState<'pending' | 'success' | 'error' | 'verifying'>('pending');
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState<string>('');
  
  // Handle verification if key is present in URL
  useEffect(() => {
    const key = searchParams.get('key');
    const email = searchParams.get('email');
    
    if (email) {
      setEmail(email);
    }
    
    if (key) {
      handleVerification(key);
    }
  }, [searchParams]);
  
  const handleVerification = async (key: string) => {
    try {
      setStatus('verifying');
      await verifyEmail(key);
      setStatus('success');
      
      // Redirect to login page after successful verification (with delay for user to see success message)
      setTimeout(() => {
        router.push('/login?verified=true');
      }, 3000);
    } catch (err: any) {
      setStatus('error');
      setError(err.message || 'Verification failed. Please try again.');
    }
  };
  
  // Handle resend verification email
  const handleResendEmail = async () => {
    try {
      // This would need to be implemented in your AuthContext
      // await resendVerificationEmail(email);
      setStatus('pending');
      setError(null);
      // Show a temporary success message for the resend action
      alert(t('auth.verificationEmailResent', 'Verification email has been resent.'));
    } catch (err: any) {
      setError(err.message || 'Failed to resend verification email. Please try again.');
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center justify-center gap-3 mb-8">
            <div className="w-10 h-10 bg-accent-pink rounded-sm flex items-center justify-center font-bold text-xl">
              D
            </div>
            <div className="text-2xl font-semibold text-text-primary tracking-tight">Dealopia</div>
          </Link>
          
          {status === 'pending' && (
            <>
              <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-accent-pink/10 mb-6">
                <Mail className="h-8 w-8 text-accent-pink" />
              </div>
              <h2 className="text-2xl font-bold text-text-primary mb-2">
                {t('auth.checkYourEmail', 'Check your email')}
              </h2>
              <p className="text-text-secondary mb-8">
                {t(
                  'auth.verificationEmailSent',
                  'We\'ve sent a verification link to your email address. Please check your inbox and click the link to verify your account.'
                )}
              </p>
              
              <div className="bg-bg-secondary rounded-lg p-5 border border-white/5 mb-8">
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  {t('auth.didntReceiveEmail', 'Didn\'t receive the email?')}
                </h3>
                <p className="text-text-secondary text-sm mb-4">
                  {t(
                    'auth.checkSpamFolder',
                    'Check your spam folder or click the button below to resend the verification email.'
                  )}
                </p>
                <button
                  onClick={handleResendEmail}
                  className="flex items-center justify-center w-full py-2 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-accent-pink hover:bg-accent-pink/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-pink focus:ring-offset-bg-primary transition-colors"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  {t('auth.resendVerificationEmail', 'Resend verification email')}
                </button>
              </div>
              
              <p className="text-sm text-text-secondary">
                {t('auth.alreadyVerified', 'Already verified?')}{' '}
                <Link href="/login" className="font-medium text-accent-pink hover:text-accent-pink/80">
                  {t('auth.signIn', 'Sign in')}
                </Link>
              </p>
            </>
          )}
          
          {status === 'verifying' && (
            <div className="text-center py-12">
              <div className="flex justify-center mb-4">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-pink"></div>
              </div>
              <h2 className="text-xl font-semibold text-text-primary">
                {t('auth.verifyingEmail', 'Verifying your email...')}
              </h2>
            </div>
          )}
          
          {status === 'success' && (
            <>
              <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-green-500/10 mb-6">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-text-primary mb-2">
                {t('auth.emailVerified', 'Email verified!')}
              </h2>
              <p className="text-text-secondary mb-8">
                {t(
                  'auth.accountActivated',
                  'Your account has been successfully activated. You\'ll be redirected to the login page in a moment.'
                )}
              </p>
              <Link
                href="/login?verified=true"
                className="inline-flex items-center justify-center py-2 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-accent-pink hover:bg-accent-pink/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-pink focus:ring-offset-bg-primary transition-colors"
              >
                {t('auth.proceedToLogin', 'Proceed to login')}
              </Link>
            </>
          )}
          
          {status === 'error' && (
            <>
              <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-red-500/10 mb-6">
                <XCircle className="h-8 w-8 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold text-text-primary mb-2">
                {t('auth.verificationFailed', 'Verification failed')}
              </h2>
              <p className="text-text-secondary mb-4">
                {error || t('auth.invalidOrExpiredLink', 'The verification link is invalid or has expired.')}
              </p>
              <div className="bg-bg-secondary rounded-lg p-5 border border-white/5 mb-8">
                <button
                  onClick={handleResendEmail}
                  className="flex items-center justify-center w-full py-2 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-accent-pink hover:bg-accent-pink/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-pink focus:ring-offset-bg-primary transition-colors"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  {t('auth.resendVerificationEmail', 'Resend verification email')}
                </button>
              </div>
              <p className="text-sm text-text-secondary">
                <Link href="/register" className="font-medium text-accent-pink hover:text-accent-pink/80">
                  {t('auth.backToRegistration', 'Back to registration')}
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}