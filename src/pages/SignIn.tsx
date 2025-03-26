// src/pages/SignIn.tsx
import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { LogIn, AlertTriangle, Loader, Facebook, Github } from 'lucide-react';
import gsap from 'gsap';

// Form validation schema
const signInSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  remember: z.boolean().optional(),
});

type SignInFormData = z.infer<typeof signInSchema>;

type Message = {
  type: 'error' | 'success';
  text: string;
};

const SignIn: React.FC<{ isModal?: boolean; onToggleView?: () => void }> = ({
  isModal = false,
  onToggleView
}) => {
  const formRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, isLoading: isLoginLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<Message | null>(null);
 
  // Get the return path from location state or default to dashboard
  const from = (location.state as any)?.from || '/dashboard';

  // Initialize form with react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<SignInFormData>();

  // Submit handler
  const onSubmit = async (data: SignInFormData) => {
    try {
      setError(null);
      await login({ email: data.email, password: data.password });
      // The auth context will handle loading state and errors
    } catch (error: any) {
      setError(error.message || 'Failed to sign in. Please try again.');
    }
  };

  // Social login handlers
  const handleGoogleLogin = () => {
    // Google login logic
  };

  const handleFacebookLogin = () => {
    // Facebook login logic
  };

  const handleGithubLogin = () => {
    // Github login logic
  };

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  // GSAP animation
  useEffect(() => {
    if (!formRef.current) return;
   
    const ctx = gsap.context(() => {
      gsap.from('.form-element', {
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out'
      });
    }, formRef);

    return () => ctx.revert();
  }, []);

  // Render content function
  const renderContent = () => (
    <>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-display font-bold bg-gradient-to-r from-primary-200 via-white to-accent-200 bg-clip-text text-transparent">
          Welcome Back
        </h2>
        <p className="mt-2 text-neutral-400">
          Sign in to access your account
        </p>
      </div>

      <div ref={formRef} className="bg-neutral-900/50 backdrop-blur-sm rounded-2xl p-8 border border-neutral-800/50">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {message && (
            <div className={`${message.type === 'error' ? 'bg-red-900/50 border-red-800' : 'bg-green-900/50 border-green-800'} border text-white px-4 py-3 rounded-lg form-element flex items-start gap-3`}>
              {message.type === 'error' ? <AlertTriangle size={18} /> : null}
              {message.text}
            </div>
          )}
         
          {error && (
            <div className="bg-red-900/50 border border-red-800 text-white px-4 py-3 rounded-lg form-element flex items-start gap-3">
              <AlertTriangle size={18} />
              {error}
            </div>
          )}
         
          <div className="form-element">
            <label htmlFor="email" className="block text-sm font-medium text-neutral-300 mb-1">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              className="w-full bg-neutral-800/50 border border-neutral-700 rounded-lg px-4 py-2 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50"
              placeholder="you@example.com"
              {...register('email')}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
            )}
          </div>

          <div className="form-element">
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="password" className="block text-sm font-medium text-neutral-300">
                Password
              </label>
              <Link to="/forgot-password" className="text-sm text-primary-400 hover:text-primary-300">
                Forgot password?
              </Link>
            </div>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              className="w-full bg-neutral-800/50 border border-neutral-700 rounded-lg px-4 py-2 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50"
              placeholder="••••••••"
              {...register('password')}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>
            )}
          </div>

          <div className="flex items-center form-element">
            <input
              id="remember"
              type="checkbox"
              className="h-4 w-4 bg-neutral-800 border-neutral-700 rounded text-primary-500 focus:ring-primary-500/50"
              {...register('remember')}
            />
            <label htmlFor="remember" className="ml-2 block text-sm text-neutral-300">
              Remember me
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || isLoginLoading}
            className="form-element w-full bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            {isSubmitting || isLoginLoading ? (
              <>
                <Loader className="animate-spin h-4 w-4" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <LogIn size={18} />
                <span>Sign In</span>
              </>
            )}
          </button>
         
          <div className="relative form-element">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-neutral-900/50 text-neutral-400">Or continue with</span>
            </div>
          </div>
         
          <div className="grid grid-cols-3 gap-3 form-element">
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="flex justify-center items-center py-2 px-4 border border-neutral-700 rounded-lg bg-neutral-800/50 hover:bg-neutral-700/50 transition-colors"
            >
              <img src="/images/google.svg" alt="Google" className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={handleFacebookLogin}
              className="flex justify-center items-center py-2 px-4 border border-neutral-700 rounded-lg bg-neutral-800/50 hover:bg-neutral-700/50 transition-colors"
            >
              <Facebook size={18} className="text-blue-500" />
            </button>
            <button
              type="button"
              onClick={handleGithubLogin}
              className="flex justify-center items-center py-2 px-4 border border-neutral-700 rounded-lg bg-neutral-800/50 hover:bg-neutral-700/50 transition-colors"
            >
              <Github size={18} className="text-white" />
            </button>
          </div>
        </form>
      </div>

      <p className="mt-4 text-center text-sm text-neutral-400">
        Don't have an account?{' '}
        {isModal ? (
          <button
            onClick={onToggleView}
            className="text-primary-400 hover:text-primary-300 font-medium"
          >
            Sign up now
          </button>
        ) : (
          <Link to="/signup" className="text-primary-400 hover:text-primary-300 font-medium">
            Sign up now
          </Link>
        )}
      </p>
    </>
  );

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {renderContent()}
      </div>
    </div>
  );
};

export default SignIn;