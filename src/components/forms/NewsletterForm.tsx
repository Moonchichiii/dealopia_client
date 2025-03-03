import React, { useState, FormEvent } from 'react';
import { Loader2 } from 'lucide-react';
import { NewsletterState } from '@/types/home';

interface NewsletterFormProps {
  onSubmit?: (email: string) => Promise<void>;
  className?: string;
}

export const NewsletterForm: React.FC<NewsletterFormProps> = ({ 
  onSubmit,
  className = ''
}) => {
  const [formState, setFormState] = useState<NewsletterState>({
    email: '',
    isSubmitting: false,
    isSuccess: false,
    error: ''
  });

  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setFormState(prev => ({ ...prev, error: '' }));

    // Validate email
    if (!formState.email || !validateEmail(formState.email)) {
      setFormState(prev => ({ ...prev, error: 'Please enter a valid email address.' }));
      return;
    }

    setFormState(prev => ({ ...prev, isSubmitting: true }));

    try {
      // If a custom onSubmit handler is provided, use it
      if (onSubmit) {
        await onSubmit(formState.email);
      } else {
        // Default implementation - simulate API call with a delay
        await new Promise(resolve => setTimeout(resolve, 1500));
      }

      // Show success state
      setFormState({
        email: '',
        isSubmitting: false,
        isSuccess: true,
        error: ''
      });
    } catch (error) {
      console.error('Newsletter submission error:', error);
      setFormState(prev => ({
        ...prev,
        error: 'Something went wrong. Please try again.',
        isSubmitting: false
      }));
    }
  };

  if (formState.isSuccess) {
    return (
      <div className="bg-white/5 border border-accent-pink/20 rounded-lg p-6 animate-fadeIn">
        <h3 className="text-xl font-semibold mb-2 text-accent-pink">
          Thank you for subscribing!
        </h3>
        <p className="text-text-secondary">
          We've sent a confirmation email to your inbox. Check your email and confirm your subscription to start receiving the best local deals.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex flex-col sm:flex-row gap-3 ${className}`}
    >
      <div className="flex-1 relative">
        <input
          type="email"
          placeholder="Your email address"
          value={formState.email}
          onChange={(e) => setFormState(prev => ({ ...prev, email: e.target.value }))}
          className={`w-full px-6 py-4 rounded-full bg-bg-primary border ${
            formState.error ? 'border-red-500' : 'border-white/10'
          } text-text-primary focus:outline-none focus:border-accent-pink transition-colors`}
          disabled={formState.isSubmitting}
        />
        {formState.error && (
          <p className="text-red-500 text-sm absolute left-0 -bottom-6">
            {formState.error}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={formState.isSubmitting}
        className="bg-accent-pink text-white px-8 py-4 rounded-full font-semibold hover:shadow-lg hover:shadow-accent-pink/20 hover:-translate-y-0.5 transition-all whitespace-nowrap flex items-center justify-center"
      >
        {formState.isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Subscribing...
          </>
        ) : (
          'Subscribe Now'
        )}
      </button>
    </form>
  );
};

export default NewsletterForm;