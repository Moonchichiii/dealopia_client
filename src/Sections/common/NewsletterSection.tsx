import React from 'react';
import { SectionProps } from '@/types/home';
import NewsletterForm from '@/components/forms/NewsletterForm';
import SectionHeading from '@/components/ui/SectionHeading';

interface NewsletterSectionProps extends SectionProps {
  onSubmit?: (email: string) => Promise<void>;
}

export const NewsletterSection: React.FC<NewsletterSectionProps> = ({
  className = '',
  onSubmit,
}) => {
  // Custom API submission handler
  const handleSubmit = async (email: string): Promise<void> => {
    if (onSubmit) {
      return onSubmit(email);
    }
    
    // Default implementation if no custom handler provided
    console.log(`Subscribing email: ${email}`);
    await new Promise(resolve => setTimeout(resolve, 1500));
  };

  return (
    <section 
      className={`py-20 relative overflow-hidden ${className}`}
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

      <div className="container relative z-10 mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <SectionHeading
            title="Never Miss a Deal Again!"
            description="Subscribe to our newsletter and get personalized deals based on your preferences."
            centered
          />

          <NewsletterForm onSubmit={handleSubmit} />
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;