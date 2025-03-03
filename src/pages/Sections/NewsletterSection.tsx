'use client';

import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';

const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate email
    if (!email || !validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call with a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Show success state
      setIsSuccess(true);
      setEmail('');
    } catch (error) {
      console.error('Newsletter submission error:', error);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-20 relative overflow-hidden" 
      style={{
        backgroundImage: 'linear-gradient(135deg, rgba(255, 56, 180, 0.1), rgba(112, 188, 255, 0.1))',
        backgroundSize: '200% 200%',
        backgroundPosition: '0% 0%',
      }}
    >
      {/* Abstract shapes in the background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] left-[10%] w-64 h-64 rounded-full bg-accent-pink/5 blur-3xl"></div>
        <div className="absolute bottom-[10%] right-[15%] w-80 h-80 rounded-full bg-accent-blue/5 blur-3xl"></div>
      </div>
      
      <div className="container relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Never Miss a Deal Again!
          </h2>
          
          <p className="text-text-secondary text-lg mb-8">
            Subscribe to our newsletter and get personalized deals based on your preferences.
          </p>
          
          {!isSuccess ? (
            <form 
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3"
            >
              <div className="flex-1 relative">
                <input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-6 py-4 rounded-full bg-bg-primary border ${
                    error ? 'border-red-500' : 'border-white/10'
                  } text-text-primary focus:outline-none focus:border-accent-pink transition-colors`}
                  disabled={isSubmitting}
                />
                {error && (
                  <p className="text-red-500 text-sm absolute left-0 -bottom-6">
                    {error}
                  </p>
                )}
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-accent-pink text-white px-8 py-4 rounded-full font-semibold hover:shadow-lg hover:shadow-accent-pink/20 hover:-translate-y-0.5 transition-all whitespace-nowrap flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Subscribing...
                  </>
                ) : (
                  'Subscribe Now'
                )}
              </button>
            </form>
          ) : (
            <div className="bg-white/5 border border-accent-pink/20 rounded-lg p-6 animate-fadeIn">
              <h3 className="text-xl font-semibold mb-2 text-accent-pink">
                Thank you for subscribing!
              </h3>
              <p className="text-text-secondary">
                We've sent a confirmation email to your inbox. Check your email and confirm your subscription to start receiving the best local deals.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;