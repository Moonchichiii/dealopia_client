import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Leaf, ShieldCheck, Globe2, Users } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const AboutSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Features animation
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

  return (
    <section ref={containerRef} className="py-20 features-section" id="about">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-display font-bold text-center bg-gradient-to-r from-primary-200 via-white to-accent-200 bg-clip-text text-transparent mb-12">
          About DealOpia
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="feature-card bg-neutral-900/50 backdrop-blur-sm rounded-2xl p-6 border border-neutral-800/50">
            <div className="bg-primary-500/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <Leaf className="w-6 h-6 text-primary-400" />
            </div>
            <h3 className="text-xl font-display font-semibold text-white mb-3">Sustainable Shopping</h3>
            <p className="text-neutral-400">Support eco-friendly businesses and reduce environmental impact through mindful consumption.</p>
          </div>

          <div className="feature-card bg-neutral-900/50 backdrop-blur-sm rounded-2xl p-6 border border-neutral-800/50">
            <div className="bg-primary-500/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <Globe2 className="w-6 h-6 text-primary-400" />
            </div>
            <h3 className="text-xl font-display font-semibold text-white mb-3">Local Focus</h3>
            <p className="text-neutral-400">Discover amazing deals from businesses in your community, supporting local economy.</p>
          </div>

          <div className="feature-card bg-neutral-900/50 backdrop-blur-sm rounded-2xl p-6 border border-neutral-800/50">
            <div className="bg-primary-500/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6 text-primary-400" />
            </div>
            <h3 className="text-xl font-display font-semibold text-white mb-3">Verified Deals</h3>
            <p className="text-neutral-400">All deals are carefully verified to ensure quality and authenticity for our users.</p>
          </div>

          <div className="feature-card bg-neutral-900/50 backdrop-blur-sm rounded-2xl p-6 border border-neutral-800/50">
            <div className="bg-primary-500/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-primary-400" />
            </div>
            <h3 className="text-xl font-display font-semibold text-white mb-3">Community Driven</h3>
            <p className="text-neutral-400">Join a community of conscious consumers making sustainable choices together.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;