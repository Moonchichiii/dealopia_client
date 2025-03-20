import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Leaf, ShieldCheck, Globe2, Users } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const About: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero section animation
      gsap.from('.hero-content > *', {
        y: 30,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out'
      });

      // Features section animation
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
    <div ref={containerRef} className="pt-16">
      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="hero-content max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-display font-bold bg-gradient-to-r from-primary-200 via-white to-accent-200 bg-clip-text text-transparent mb-6">
              Revolutionizing Local Shopping
            </h1>
            <p className="text-xl text-stone-300 mb-8 max-w-2xl mx-auto">
              DealOpia connects conscious shoppers with sustainable local deals, making eco-friendly shopping accessible and affordable for everyone.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-3 rounded-full font-medium transition-colors">
                Get Started
              </button>
              <button className="bg-stone-800 hover:bg-stone-700 text-white px-8 py-3 rounded-full font-medium transition-colors">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 features-section">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="feature-card bg-stone-900/50 backdrop-blur-sm rounded-2xl p-6 border border-stone-800/50">
              <div className="bg-primary-500/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <Leaf className="w-6 h-6 text-primary-400" />
              </div>
              <h3 className="text-xl font-display font-semibold text-white mb-3">Sustainable Shopping</h3>
              <p className="text-stone-400">Support eco-friendly businesses and reduce environmental impact through mindful consumption.</p>
            </div>

            <div className="feature-card bg-stone-900/50 backdrop-blur-sm rounded-2xl p-6 border border-stone-800/50">
              <div className="bg-primary-500/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <Globe2 className="w-6 h-6 text-primary-400" />
              </div>
              <h3 className="text-xl font-display font-semibold text-white mb-3">Local Focus</h3>
              <p className="text-stone-400">Discover amazing deals from businesses in your community, supporting local economy.</p>
            </div>

            <div className="feature-card bg-stone-900/50 backdrop-blur-sm rounded-2xl p-6 border border-stone-800/50">
              <div className="bg-primary-500/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6 text-primary-400" />
              </div>
              <h3 className="text-xl font-display font-semibold text-white mb-3">Verified Deals</h3>
              <p className="text-stone-400">All deals are carefully verified to ensure quality and authenticity for our users.</p>
            </div>

            <div className="feature-card bg-stone-900/50 backdrop-blur-sm rounded-2xl p-6 border border-stone-800/50">
              <div className="bg-primary-500/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-primary-400" />
              </div>
              <h3 className="text-xl font-display font-semibold text-white mb-3">Community Driven</h3>
              <p className="text-stone-400">Join a community of conscious consumers making sustainable choices together.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;