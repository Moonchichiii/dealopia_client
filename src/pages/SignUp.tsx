import React, { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import gsap from 'gsap';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useSupabaseClient } from '@supabase/auth-helpers-react';

const SignUp: React.FC = () => {
  const formRef = useRef<HTMLDivElement>(null);
  const supabase = useSupabaseClient();
  const navigate = useNavigate();

  useEffect(() => {
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

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-display font-bold bg-gradient-to-r from-primary-200 via-white to-accent-200 bg-clip-text text-transparent">
            Create Account
          </h2>
          <p className="mt-2 text-stone-400">
            Join our community of conscious shoppers
          </p>
        </div>

        <div ref={formRef} className="bg-stone-900/50 backdrop-blur-sm rounded-2xl p-8 border border-stone-800/50">
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#843dff',
                    brandAccent: '#7916ff',
                  },
                },
              },
              className: {
                container: 'form-element',
                button: 'w-full bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2',
                input: 'w-full bg-stone-800/50 border border-stone-700 rounded-lg px-4 py-2 text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50',
              },
            }}
            providers={['google', 'facebook']}
            redirectTo={`${window.location.origin}/dashboard`}
            view="sign_up"
          />
        </div>

        <p className="mt-4 text-center text-sm text-stone-400">
          Already have an account?{' '}
          <Link to="/signin" className="text-primary-400 hover:text-primary-300 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;