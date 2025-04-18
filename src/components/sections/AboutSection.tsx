import { useEffect, useRef, useState } from 'react';

import gsap from 'gsap';
import { Globe2, Leaf, ShieldCheck, Users, Recycle, Heart, Award, Zap } from 'lucide-react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugin
gsap.registerPlugin(ScrollTrigger);

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
}

const FeatureCard = ({ icon, title, description, index }: FeatureCardProps) => {
  return (
    <div 
      className={`feature-card bg-neutral-900/60 backdrop-blur-sm rounded-2xl p-6 border border-neutral-800/50 hover:border-primary-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/10 h-full`}
      data-aos-delay={index * 100}
    >
      <div className="bg-primary-500/15 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-display font-semibold text-white mb-3">{title}</h3>
      <p className="text-neutral-300">{description}</p>
    </div>
  );
};

// Enhanced SVG background component
const SustainabilityBackground = () => (
  <div className="absolute inset-0 -z-10 w-full h-full overflow-hidden">
    <svg viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Gradient background */}
      <defs>
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0a1f1a" />
          <stop offset="100%" stopColor="#071a15" />
        </linearGradient>
        
        {/* Leaf pattern */}
        <pattern id="leafPattern" patternUnits="userSpaceOnUse" width="120" height="120" patternTransform="rotate(10)">
          <path d="M40,60 Q65,20 90,60 Q65,100 40,60 Z" fill="none" stroke="#26755a" strokeWidth="1.5" opacity="0.25" />
        </pattern>
        
        {/* More visible wave pattern */}
        <pattern id="wavePattern" patternUnits="userSpaceOnUse" width="200" height="100">
          <path d="M0,50 Q50,0 100,50 Q150,100 200,50" fill="none" stroke="#39a388" strokeWidth="1.5" opacity="0.2" />
        </pattern>
        
        {/* Hexagon pattern */}
        <pattern id="hexPattern" patternUnits="userSpaceOnUse" width="150" height="170" patternTransform="scale(0.7) rotate(5)">
          <path d="M75,25 L125,60 L125,110 L75,145 L25,110 L25,60 Z" fill="none" stroke="#3ab795" strokeWidth="1.5" opacity="0.15" />
        </pattern>
      </defs>
      
      {/* Base background */}
      <rect width="100%" height="100%" fill="url(#bgGradient)" />
      
      {/* Pattern layers */}
      <rect width="100%" height="100%" fill="url(#leafPattern)" />
      <rect width="100%" height="100%" fill="url(#wavePattern)" opacity="0.8" />
      <rect width="100%" height="100%" fill="url(#hexPattern)" />
      
      {/* Large corner leaf element - top left */}
      <path d="M-50,100 Q100,-50 250,50 Q150,150 100,300 Q0,200 -50,100 Z" fill="#26755a" opacity="0.15" />
      
      {/* Large corner leaf element - bottom right */}
      <path d="M1000,400 Q1150,350 1300,500 Q1100,650 950,550 Q950,450 1000,400 Z" fill="#26755a" opacity="0.15" />
      
      {/* Abstract eco elements with better visibility */}
      <g opacity="0.15">
        {/* Larger leaf silhouettes */}
        <path d="M100,300 C200,200 300,350 150,450 C50,400 50,350 100,300 Z" fill="#3ab795" />
        <path d="M1000,150 C1100,50 1150,200 1050,250 C950,200 950,200 1000,150 Z" fill="#3ab795" />
        
        {/* Rounded eco shapes */}
        <circle cx="250" cy="150" r="100" fill="#3ab795" opacity="0.2" />
        <circle cx="950" cy="480" r="120" fill="#26755a" opacity="0.2" />
        
        {/* Wave patterns */}
        <path d="M0,400 Q150,350 300,400 Q450,450 600,400 Q750,350 900,400 Q1050,450 1200,400" fill="none" stroke="#3ab795" strokeWidth="3" />
        <path d="M0,440 Q150,390 300,440 Q450,490 600,440 Q750,390 900,440 Q1050,490 1200,440" fill="none" stroke="#26755a" strokeWidth="2" />
        
        {/* Additional wave patterns for expanded height */}
        <path d="M0,600 Q150,550 300,600 Q450,650 600,600 Q750,550 900,600 Q1050,650 1200,600" fill="none" stroke="#3ab795" strokeWidth="3" />
        <path d="M0,640 Q150,590 300,640 Q450,690 600,640 Q750,590 900,640 Q1050,690 1200,640" fill="none" stroke="#26755a" strokeWidth="2" />
      </g>
      
      {/* More pronounced recycle symbol in the background */}
      <g transform="translate(600, 400) scale(2)" opacity="0.07">
        <path d="M0,-30 L10,-10 L-10,-10 Z" fill="#3ab795" />
        <path d="M0,-30 L10,-10 L-10,-10 Z" fill="#3ab795" transform="rotate(120)" />
        <path d="M0,-30 L10,-10 L-10,-10 Z" fill="#3ab795" transform="rotate(240)" />
        <path d="M0,-35 A35,35 0 1,1 -30.31,-17.5 L-25.98,-15 A30,30 0 1,0 0,-30 Z" fill="#3ab795" />
        <path d="M0,-35 A35,35 0 1,1 -30.31,-17.5 L-25.98,-15 A30,30 0 1,0 0,-30 Z" fill="#3ab795" transform="rotate(120)" />
        <path d="M0,-35 A35,35 0 1,1 -30.31,-17.5 L-25.98,-15 A30,30 0 1,0 0,-30 Z" fill="#3ab795" transform="rotate(240)" />
      </g>
      
      {/* More visible subtle particle dots */}
      <g opacity="0.3">
        <circle cx="200" cy="100" r="1.5" fill="#5ab795" />
        <circle cx="350" cy="200" r="1.5" fill="#5ab795" />
        <circle cx="500" cy="150" r="1.5" fill="#5ab795" />
        <circle cx="700" cy="250" r="1.5" fill="#5ab795" />
        <circle cx="850" cy="100" r="1.5" fill="#5ab795" />
        <circle cx="950" cy="300" r="1.5" fill="#5ab795" />
        <circle cx="300" cy="400" r="1.5" fill="#5ab795" />
        <circle cx="600" cy="350" r="1.5" fill="#5ab795" />
        <circle cx="800" cy="450" r="1.5" fill="#5ab795" />
        <circle cx="1100" cy="200" r="1.5" fill="#5ab795" />
        <circle cx="150" cy="150" r="1.5" fill="#5ab795" />
        <circle cx="450" cy="250" r="1.5" fill="#5ab795" />
        <circle cx="750" cy="300" r="1.5" fill="#5ab795" />
        <circle cx="900" cy="150" r="1.5" fill="#5ab795" />
        <circle cx="250" cy="350" r="1.5" fill="#5ab795" />
        <circle cx="400" cy="500" r="1.5" fill="#5ab795" />
        <circle cx="650" cy="550" r="1.5" fill="#5ab795" />
        <circle cx="900" cy="500" r="1.5" fill="#5ab795" />
        <circle cx="1050" cy="550" r="1.5" fill="#5ab795" />
        <circle cx="200" cy="600" r="1.5" fill="#5ab795" />
        <circle cx="500" cy="650" r="1.5" fill="#5ab795" />
        <circle cx="800" cy="600" r="1.5" fill="#5ab795" />
      </g>
    </svg>
  </div>
);

// Stats component
const SustainabilityStats = () => {
  const statsRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    
    if (statsRef.current) {
      observer.observe(statsRef.current);
    }
    
    return () => observer.disconnect();
  }, []);
  
  return (
    <div ref={statsRef} className="stats-container py-12 md:py-16">
      <div className="max-w-3xl mx-auto bg-neutral-900/60 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-neutral-800/50">
        <h3 className="text-2xl font-display font-bold text-center text-white mb-8">Our Impact</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <div className="text-center">
            <div className="text-primary-400 font-display font-bold text-3xl md:text-4xl lg:text-5xl mb-2">
              {isVisible ? <CountUp end={45} duration={2} /> : '0'}%
            </div>
            <p className="text-neutral-300 text-sm">Carbon Footprint Reduction</p>
          </div>
          <div className="text-center">
            <div className="text-primary-400 font-display font-bold text-3xl md:text-4xl lg:text-5xl mb-2">
              {isVisible ? <CountUp end={120} duration={2} /> : '0'}+
            </div>
            <p className="text-neutral-300 text-sm">Local Businesses</p>
          </div>
          <div className="text-center">
            <div className="text-primary-400 font-display font-bold text-3xl md:text-4xl lg:text-5xl mb-2">
              {isVisible ? <CountUp end={5.2} decimals={1} duration={2} /> : '0'}K
            </div>
            <p className="text-neutral-300 text-sm">Eco-Conscious Users</p>
          </div>
          <div className="text-center">
            <div className="text-primary-400 font-display font-bold text-3xl md:text-4xl lg:text-5xl mb-2">
              {isVisible ? <CountUp end={87} duration={2} /> : '0'}%
            </div>
            <p className="text-neutral-300 text-sm">Product Sustainability Score</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Simple count-up component
const CountUp = ({ end, duration = 2, decimals = 0 }) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let startTime: number | null = null;
    let animationFrame: number;
    
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      
      setCount(progress * end);
      
      if (progress < 1) {
        animationFrame = window.requestAnimationFrame(step);
      }
    };
    
    animationFrame = window.requestAnimationFrame(step);
    
    return () => window.cancelAnimationFrame(animationFrame);
  }, [end, duration]);
  
  return <>{count.toFixed(decimals)}</>;
};

// Quote component
const SustainabilityQuote = () => (
  <div className="quote-container py-12 md:py-16">
    <div className="max-w-4xl mx-auto text-center px-4">
      <svg className="w-12 h-12 mx-auto mb-4 text-primary-400 opacity-50" fill="currentColor" viewBox="0 0 24 24">
        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
      </svg>
      <p className="text-xl md:text-2xl lg:text-3xl font-display font-medium text-white mb-6 leading-relaxed">
        "The greatest threat to our planet is the belief that someone else will save it. By making conscious shopping choices today, we can create a sustainable tomorrow."
      </p>
      <div className="flex items-center justify-center">
        <div className="h-px w-12 bg-primary-500/30 mr-4"></div>
        <p className="text-primary-400 font-semibold">DealOpia Philosophy</p>
        <div className="h-px w-12 bg-primary-500/30 ml-4"></div>
      </div>
    </div>
  </div>
);

const AboutSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate feature cards
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
      
      // Animate the intro text
      gsap.from('.about-intro', {
        y: 30,
        opacity: 0,
        duration: 1,
        scrollTrigger: {
          trigger: '.about-intro',
          start: 'top center+=150',
          toggleActions: 'play none none reverse'
        }
      });
      
      // Animate stats
      gsap.from('.stats-container', {
        y: 40,
        opacity: 0,
        duration: 1,
        scrollTrigger: {
          trigger: '.stats-container',
          start: 'top bottom-=100',
          toggleActions: 'play none none reverse'
        }
      });
      
      // Animate quote
      gsap.from('.quote-container', {
        y: 40,
        opacity: 0,
        duration: 1,
        scrollTrigger: {
          trigger: '.quote-container',
          start: 'top bottom-=100',
          toggleActions: 'play none none reverse'
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const features = [
    {
      icon: <Leaf className="w-7 h-7 text-primary-400" />,
      title: "Sustainable Shopping",
      description: "Making conscious choices that consider environmental, social, and economic impacts of products we buy, reducing overall waste and environmental footprint."
    },
    {
      icon: <Globe2 className="w-7 h-7 text-primary-400" />,
      title: "Local Focus",
      description: "Supporting local producers reduces transportation emissions and strengthens community economies. Our deals prioritize businesses in your neighborhood."
    },
    {
      icon: <ShieldCheck className="w-7 h-7 text-primary-400" />,
      title: "Verified Deals",
      description: "We ensure each deal aligns with sustainable values by carefully verifying quality, authenticity, and the ethical practices of our partner businesses."
    },
    {
      icon: <Users className="w-7 h-7 text-primary-400" />,
      title: "Community Driven",
      description: "Together we create demand for eco-friendly options and transparent business practices, making sustainability the new normal in consumer culture."
    },
    {
      icon: <Recycle className="w-7 h-7 text-primary-400" />,
      title: "Circular Economy",
      description: "We promote products designed for durability and recyclability, helping reduce demand for new resources and minimizing what ends up in landfills."
    },
    {
      icon: <Heart className="w-7 h-7 text-primary-400" />,
      title: "Ethical Sourcing",
      description: "Our partners commit to fair labor practices and responsible sourcing, ensuring workers receive fair wages and safe working conditions."
    },
    {
      icon: <Award className="w-7 h-7 text-primary-400" />,
      title: "Quality Assurance",
      description: "Sustainable products aren't just better for the planet—they're often higher quality, lasting longer and providing better value over time."
    },
    {
      icon: <Zap className="w-7 h-7 text-primary-400" />,
      title: "Energy Efficiency",
      description: "We highlight businesses that prioritize renewable energy and reduced carbon emissions throughout their production and delivery processes."
    }
  ];

  return (
    <section ref={containerRef} className="py-20 md:py-24 lg:py-32 features-section relative min-h-[80vh]" id="about">
      {/* Add the SVG background */}
      <SustainabilityBackground />
      
      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-center bg-gradient-to-r from-primary-300 via-white to-accent-300 bg-clip-text text-transparent mb-6 animate-gradient-x">
          About DealOpia
        </h2>
        
        <div className="about-intro max-w-3xl mx-auto text-center mb-16">
          <p className="text-neutral-200 text-lg md:text-xl mb-6">
            DealOpia helps you make informed choices when purchasing goods and services, 
            considering the environmental, social, and economic impacts of the products we buy.
          </p>
          <p className="text-neutral-300 text-base md:text-lg">
            By choosing sustainable deals, we can reduce our carbon footprint, support ethical businesses, 
            and create a positive impact on our environment and communities. As consumers, 
            we have the power to make a difference with every purchase.
          </p>
        </div>
        
        {/* Statistics section */}
        <SustainabilityStats />
        
        {/* Features grid */}
        <div className="mt-16 md:mt-20">
          <h3 className="text-2xl md:text-3xl font-display font-bold text-center text-white mb-10">
            Our <span className="text-primary-400">Sustainability</span> Principles
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                index={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </div>
        
        {/* Quote section */}
        <SustainabilityQuote />
      </div>
    </section>
  );
};

export default AboutSection;