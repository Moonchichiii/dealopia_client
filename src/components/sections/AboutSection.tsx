import { useEffect, useRef } from 'react';

import gsap from 'gsap';
import { Globe2, Leaf, ShieldCheck, Users } from 'lucide-react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugin
gsap.registerPlugin(ScrollTrigger);

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => (
  <div className="feature-card bg-neutral-900/50 backdrop-blur-sm rounded-2xl p-6 border border-neutral-800/50">
    <div className="bg-primary-500/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-display font-semibold text-white mb-3">{title}</h3>
    <p className="text-neutral-400">{description}</p>
  </div>
);

const AboutSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.feature-card', {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        scrollTrigger: {
          trigger: '.features-section',
          start: 'top center+=100',
          toggleActions: 'play none none reverse'
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const features = [
    {
      icon: <Leaf className="w-6 h-6 text-primary-400" />,
      title: "Sustainable Shopping",
      description: "Support eco-friendly businesses and reduce environmental impact through mindful consumption."
    },
    {
      icon: <Globe2 className="w-6 h-6 text-primary-400" />,
      title: "Local Focus",
      description: "Discover amazing deals from businesses in your community, supporting local economy."
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-primary-400" />,
      title: "Verified Deals",
      description: "All deals are carefully verified to ensure quality and authenticity for our users."
    },
    {
      icon: <Users className="w-6 h-6 text-primary-400" />,
      title: "Community Driven",
      description: "Join a community of conscious consumers making sustainable choices together."
    }
  ];

  return (
    <section ref={containerRef} className="py-20 features-section" id="about">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-display font-bold text-center bg-gradient-to-r from-primary-200 via-white to-accent-200 bg-clip-text text-transparent mb-12">
          About DealOpia
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;