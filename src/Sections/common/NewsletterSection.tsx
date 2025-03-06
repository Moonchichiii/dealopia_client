import React, { useState } from 'react';
import { SectionProps } from '@/types/home';
import { Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';

interface NewsletterSectionProps extends SectionProps {
  onSubmit?: (email: string) => Promise<void>;
}

export const NewsletterSection: React.FC<NewsletterSectionProps> = ({
  className = '',
  onSubmit,
}) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // Custom API submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email
    if (!email || !validateEmail(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    try {
      if (onSubmit) {
        await onSubmit(email);
      } else {
        // Default implementation if no custom handler provided
        console.log(`Subscribing email: ${email}`);
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
      
      setIsSuccess(true);
      toast.success('You have successfully subscribed to our newsletter!');
      setEmail('');
    } catch (error) {
      toast.error('Failed to subscribe. Please try again later.');
      console.error('Newsletter subscription error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  
  return (
    <section 
    className={`py-16 relative overflow-hidden isolate bg-secondary-800 ${className}`}
  >
    {/* Gradient overlay */}
    <div 
      className="absolute inset-0 -z-10 opacity-20"
      style={{
        background: 'linear-gradient(135deg, var(--accent-pink), var(--accent-blue))'
      }}
    ></div>
        {/* Abstract shapes in the background */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[20%] left-[10%] w-64 h-64 rounded-full bg-accent-pink/5 blur-3xl"></div>
          <div className="absolute bottom-[10%] right-[15%] w-80 h-80 rounded-full bg-accent-blue/5 blur-3xl"></div>
        </div>
  
        <div className="container relative z-10 mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Never Miss a Deal Again!
            </h2>
            
            <p className="text-lg text-gray-300 mb-8 max-w-xl mx-auto">
              Subscribe to our newsletter and get personalized deals based on your preferences.
            </p>
  
            {isSuccess ? (
              <div className="bg-white/5 border border-[#FF38B4]/20 rounded-lg p-6 animate-fadeIn">
                <h3 className="text-xl font-semibold mb-2 text-[#FF38B4]">
                  Thank you for subscribing!
                </h3>
                <p className="text-gray-300">
                  We've sent a confirmation email to your inbox. Check your email and confirm your subscription to start receiving the best local deals.
                </p>
              </div>
            ) : (
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
                    disabled={isSubmitting}
                    className="w-full px-6 py-4 rounded-full bg-black/20 backdrop-blur-sm border border-white/10 text-white focus:outline-none focus:border-[#FF38B4] transition-colors"
                  />
                </div>
  
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#FF38B4] text-white px-8 py-4 rounded-full font-semibold hover:shadow-lg hover:shadow-[#FF38B4]/30 hover:-translate-y-0.5 transition-all whitespace-nowrap flex items-center justify-center disabled:opacity-70 disabled:hover:translate-y-0"
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
            )}
          </div>
        </div>
      </section>
    );
  };

export default NewsletterSection;
