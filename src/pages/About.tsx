import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Leaf, ShieldCheck, Globe2, Users, Heart, BadgeCheck, Sparkles } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// Timeline item component
interface TimelineItemProps {
  year: string;
  title: string;
  description: string;
  isLeft?: boolean;
}

const TimelineItem: React.FC<TimelineItemProps> = ({ year, title, description, isLeft = false }) => (
  <div className={`timeline-item relative ${isLeft ? 'md:text-right' : ''}`}>
    <div className={`md:flex items-center ${isLeft ? 'md:flex-row-reverse' : ''}`}>
      <div className="timeline-badge hidden md:flex items-center justify-center w-16 h-16 bg-primary-500/10 rounded-full border-4 border-neutral-900 z-10">
        <span className="text-primary-400 font-bold">{year}</span>
      </div>
      <div className={`timeline-content md:w-5/12 bg-neutral-900/50 backdrop-blur-sm rounded-2xl p-6 border border-neutral-800/50 ${isLeft ? 'md:mr-8' : 'md:ml-8'}`}>
        <span className="inline-block md:hidden text-primary-400 text-sm font-semibold mb-2">{year}</span>
        <h3 className="text-xl font-display font-semibold text-white mb-3">{title}</h3>
        <p className="text-neutral-300">{description}</p>
      </div>
    </div>
  </div>
);

const About: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero animations
      gsap.from('.hero-content > *', {
        y: 30,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out'
      });

      // Our story animation
      gsap.from('.story-content', {
        y: 50,
        opacity: 0,
        duration: 0.8,
        scrollTrigger: {
          trigger: '.story-section',
          start: 'top center+=100',
          toggleActions: 'play none none reverse'
        }
      });

      // Timeline animations
      gsap.from('.timeline-item', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        scrollTrigger: {
          trigger: '.timeline-section',
          start: 'top center+=100',
          toggleActions: 'play none none reverse'
        }
      });

      // Values animations
      gsap.from('.value-card', {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        scrollTrigger: {
          trigger: '.values-section',
          start: 'top center+=100',
          toggleActions: 'play none none reverse'
        }
      });

      // Mission animation
      gsap.from('.mission-content', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        scrollTrigger: {
          trigger: '.mission-section',
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
      <section className="py-20 md:py-28 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="hero-content max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-display font-bold bg-gradient-to-r from-primary-300 via-white to-accent-300 bg-clip-text text-transparent mb-6">
              Our Journey to Revolutionize Shopping
            </h1>
            <p className="text-xl text-neutral-300 mb-8 max-w-3xl mx-auto">
              DealOpia was born from a simple yet powerful idea: what if finding sustainable, ethical deals was as easy as finding any other deal online?
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="#our-story" className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-3 rounded-full font-medium transition-colors">
                Our Story
              </a>
              <a href="#our-mission" className="bg-neutral-800 hover:bg-neutral-700 text-white px-8 py-3 rounded-full font-medium transition-colors">
                Our Mission
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section id="our-story" className="py-20 story-section bg-neutral-950">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto story-content">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-center text-white mb-8">The Story Behind DealOpia</h2>
            <div className="bg-neutral-900/40 backdrop-blur-sm rounded-2xl p-8 border border-neutral-800/50">
              <p className="text-neutral-300 mb-6">
                It all began when I noticed a disconnect between my values and my shopping habits. While I cared deeply about sustainability and ethical business practices, finding businesses that aligned with these values was time-consuming and often frustrating.
              </p>
              <p className="text-neutral-300 mb-6">
                In 2022, during a visit to a local farmers' market, I discovered several eco-conscious businesses offering incredible products at competitive prices. These were the exact kind of deals I wanted to support, but they lacked the visibility of mainstream retailers.
              </p>
              <p className="text-neutral-300">
                That's when the idea for DealOpia was born—a platform that would bridge this gap, making it effortless for conscious consumers to discover sustainable deals from verified ethical businesses, while helping those businesses reach their ideal customers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 timeline-section">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-center text-white mb-12">Our Journey</h2>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute hidden md:block left-1/2 transform -translate-x-1/2 h-full w-1 bg-primary-500/20"></div>
            
            <div className="space-y-12 md:space-y-24">
              <TimelineItem 
                year="2022"
                title="The Spark"
                description="The initial idea for DealOpia came from a personal frustration with finding sustainable shopping options. We began researching the market gap for eco-conscious deal platforms."
              />
              
              <TimelineItem 
                year="2023"
                title="Development & Testing"
                description="We built the first version of DealOpia and tested it with a small community of eco-conscious shoppers and sustainable businesses in select cities."
                isLeft={true}
              />
              
              <TimelineItem 
                year="2024"
                title="Official Launch"
                description="After incorporating user feedback and refining our platform, we officially launched DealOpia nationwide, connecting thousands of conscious consumers with sustainable businesses."
              />
              
              <TimelineItem 
                year="2025"
                title="Growing Impact"
                description="Today, DealOpia is rapidly expanding, with our community growing every day and our impact on sustainable shopping practices becoming increasingly significant."
                isLeft={true}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-20 values-section bg-neutral-950">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-center text-white mb-12">Our Core Values</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="value-card bg-neutral-900/40 backdrop-blur-sm rounded-2xl p-6 border border-neutral-800/50">
              <div className="bg-primary-500/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <Leaf className="w-6 h-6 text-primary-400" />
              </div>
              <h3 className="text-xl font-display font-semibold text-white mb-3">Environmental Consciousness</h3>
              <p className="text-neutral-300">We believe in making choices that protect and preserve our planet for future generations.</p>
            </div>

            <div className="value-card bg-neutral-900/40 backdrop-blur-sm rounded-2xl p-6 border border-neutral-800/50">
              <div className="bg-primary-500/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-primary-400" />
              </div>
              <h3 className="text-xl font-display font-semibold text-white mb-3">Community Empowerment</h3>
              <p className="text-neutral-300">We're dedicated to strengthening local economies and building resilient communities.</p>
            </div>

            <div className="value-card bg-neutral-900/40 backdrop-blur-sm rounded-2xl p-6 border border-neutral-800/50">
              <div className="bg-primary-500/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <BadgeCheck className="w-6 h-6 text-primary-400" />
              </div>
              <h3 className="text-xl font-display font-semibold text-white mb-3">Ethical Transparency</h3>
              <p className="text-neutral-300">We commit to honest, transparent practices in everything we do and expect the same from our partners.</p>
            </div>

            <div className="value-card bg-neutral-900/40 backdrop-blur-sm rounded-2xl p-6 border border-neutral-800/50">
              <div className="bg-primary-500/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-primary-400" />
              </div>
              <h3 className="text-xl font-display font-semibold text-white mb-3">Continuous Innovation</h3>
              <p className="text-neutral-300">We constantly seek better ways to serve our community and make sustainable shopping more accessible.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission Section */}
      <section id="our-mission" className="py-20 md:py-28 mission-section relative">
        <div className="container mx-auto px-4">
          <div className="mission-content max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-center text-white mb-8">Our Mission</h2>
            <div className="bg-neutral-900/40 backdrop-blur-sm rounded-2xl p-8 border border-neutral-800/50">
              <blockquote className="text-xl md:text-2xl text-center text-neutral-200 italic mb-8">
                "We're creating a world where making sustainable choices is the easiest choice."
              </blockquote>
              <p className="text-neutral-300 mb-6">
                DealOpia exists to transform how people shop by making sustainable, ethical, and local options not just accessible, but preferable. We believe that when conscious shopping becomes convenient and rewarding, it becomes the default choice.
              </p>
              <p className="text-neutral-300 mb-6">
                Our platform empowers both consumers and businesses in the sustainability ecosystem—providing shoppers with quality, vetted options that align with their values, while helping ethical businesses thrive by connecting them with their ideal customers.
              </p>
              <p className="text-neutral-300">
                Every deal on DealOpia represents more than just a transaction; it's a step toward a more sustainable future, a vote for ethical business practices, and an investment in local communities.
              </p>
            </div>
          </div>

          {/* Join Our Mission CTA */}
          <div className="mt-16 text-center">
            <h3 className="text-2xl font-display font-semibold text-white mb-6">Join Our Mission</h3>
            <p className="text-neutral-300 mb-8 max-w-2xl mx-auto">
              We're always looking for passionate individuals and businesses who want to be part of the sustainable shopping revolution.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="/contact" className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-3 rounded-full font-medium transition-colors">
                Contact Us
              </a>
              <a href="/partners" className="bg-neutral-800 hover:bg-neutral-700 text-white px-8 py-3 rounded-full font-medium transition-colors">
                Become a Partner
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;