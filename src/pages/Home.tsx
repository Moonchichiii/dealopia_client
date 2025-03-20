import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, MapPin } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { DealCard } from '../components/DealCard';
import SearchBar from '../components/SearchBar';
import AboutSection from '../components/AboutSection';
import ShopsSection from '../components/ShopsSection';
import NearMeSection from '../components/NearMeSection';

const exampleDeals = [{
  id: '1',
  title: 'Organic Cotton T-Shirt',
  description: 'Sustainably made cotton t-shirt from local manufacturer',
  price: 24.99,
  originalPrice: 49.99,
  imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&auto=format&fit=crop&q=80',
  distance: 1.2,
  sustainabilityScore: 9.2,
  expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
  category: 'Clothing',
  dealType: 'second-hand' as const,
  location: {
    latitude: 51.5074,
    longitude: -0.1278,
  },
  merchant: {
    id: '1',
    name: 'EcoFashion',
    rating: 4.8,
  },
}, {
  id: '2',
  title: 'Local Organic Produce Box',
  description: 'Fresh seasonal vegetables from local farmers',
  price: 29.99,
  originalPrice: 39.99,
  imageUrl: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=800&auto=format&fit=crop&q=80',
  distance: 0.8,
  sustainabilityScore: 9.8,
  expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 48).toISOString(),
  category: 'Food',
  dealType: 'flash' as const,
  location: {
    latitude: 51.5124,
    longitude: -0.1300,
  },
  merchant: {
    id: '2',
    name: 'Farm Fresh',
    rating: 4.9,
  },
}];

const Home: React.FC = () => {
  const { t } = useTranslation();
  const [selectedDeal, setSelectedDeal] = useState<string | null>(null);
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.8]);

  const handleSearch = (query: string, filters?: Record<string, any>) => {
    console.log('Search:', query, filters);
  };

  const scrollToContent = () => {
    const contentSection = document.getElementById('main-content');
    if (contentSection) {
      contentSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Hero Section with Video Background */}
      <motion.section 
        style={{ opacity, scale }}
        className="relative h-screen w-full overflow-hidden -mt-16"
        role="banner"
        aria-label="Welcome to DealOpia"
      >
        <div className="absolute inset-0 w-full h-full">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="object-cover w-full h-full"
            poster="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80"
            aria-hidden="true"
          >
            <source
              src="https://player.vimeo.com/external/517629306.hd.mp4?s=b0bbd1903e49d414e15c0ec07001a0e6f667c69c&profile_id=175"
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-stone-950/50 via-stone-950/25 to-stone-950"></div>
        </div>

        <div className="relative h-full flex flex-col items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-white mb-6">
              Sustainable Shopping,{' '}
              <span className="bg-gradient-to-r from-primary-400 to-accent-400 text-transparent bg-clip-text">
                Better Future
              </span>
            </h1>
            <p className="text-lg md:text-xl text-stone-200 mb-8 max-w-2xl mx-auto">
              Join our community of conscious shoppers and discover amazing local deals while making a positive impact on the environment.
            </p>
            <SearchBar 
              onSearch={handleSearch}
              className="max-w-2xl mx-auto"
            />
          </motion.div>

          <motion.button
            onClick={scrollToContent}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="absolute bottom-12 flex flex-col items-center text-white group cursor-pointer"
            aria-label="Scroll to discover deals"
          >
            <span className="text-lg font-semibold mb-3 bg-stone-900/50 backdrop-blur-sm px-6 py-2 rounded-full border border-stone-800/50 group-hover:bg-stone-800/50 transition-colors">
              Discover More
            </span>
            <ChevronDown className="w-8 h-8 animate-bounce text-primary-400" />
          </motion.button>
        </div>
      </motion.section>

      {/* Main Content */}
      <main id="main-content">
        {/* Featured Deals Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-display font-bold text-white mb-8">
              Featured Deals
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {exampleDeals.map((deal) => (
                <DealCard
                  key={deal.id}
                  deal={deal}
                  priority={deal.id === selectedDeal}
                  className={deal.id === selectedDeal ? 'ring-2 ring-primary-500 ring-offset-4 ring-offset-stone-950' : ''}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Integrated Sections */}
        <ShopsSection />
        <AboutSection />
        <NearMeSection />
      </main>
    </>
  );
};

export default Home;