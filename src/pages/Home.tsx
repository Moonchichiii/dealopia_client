import { useState, lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, ShoppingBag, Leaf } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { DealCard } from '@/components/DealCard';
import SearchBar from '@/components/SearchBar';

// Lazy load components
const AboutSection = lazy(() => import('@/components/sections/AboutSection'));
const ShopsSection = lazy(() => import('@/components/sections/ShopsSection'));
const NearMeSection = lazy(() => import('@/components/sections/NearMeSection'));

interface Deal {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice: number;
  imageUrl: string;
  distance: number;
  sustainabilityScore: number;
  expiresAt: string;
  category: string;
  dealType: 'second-hand' | 'flash';
  location: {
    latitude: number;
    longitude: number;
  };
  merchant: {
    id: string;
    name: string;
    rating: number;
  };
}

const exampleDeals: readonly Deal[] = [
  {
    id: '1',
    title: 'Organic Cotton T-Shirt',
    description: 'Sustainably made cotton t-shirt from local manufacturer',
    price: 24.99,
    originalPrice: 49.99,
    imageUrl:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&auto=format&fit=crop&q=80',
    distance: 1.2,
    sustainabilityScore: 9.2,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
    category: 'Clothing',
    dealType: 'second-hand',
    location: {
      latitude: 51.5074,
      longitude: -0.1278,
    },
    merchant: {
      id: '1',
      name: 'EcoFashion',
      rating: 4.8,
    },
  },
  {
    id: '2',
    title: 'Local Organic Produce Box',
    description: 'Fresh seasonal vegetables from local farmers',
    price: 29.99,
    originalPrice: 39.99,
    imageUrl:
      'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=800&auto=format&fit=crop&q=80',
    distance: 0.8,
    sustainabilityScore: 9.8,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 48).toISOString(),
    category: 'Food',
    dealType: 'flash',
    location: {
      latitude: 51.5124,
      longitude: -0.1300,
    },
    merchant: {
      id: '2',
      name: 'Farm Fresh',
      rating: 4.9,
    },
  },
];

interface SearchFilters {
  [key: string]: unknown;
}

// Loading placeholders with fixed heights to prevent CLS
const SectionPlaceholder = ({ text }: { text: string }) => (
  <div 
    className="h-96 flex items-center justify-center bg-neutral-900/50 backdrop-blur-sm rounded-2xl mx-4 my-8"
    aria-label={`Loading ${text}`}
  >
    <div className="flex flex-col items-center">
      <div className="w-8 h-8 border-4 border-primary-400 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-primary-400 font-medium">{text}</p>
    </div>
  </div>
);

const Home: React.FC = () => {
  const { t } = useTranslation();
  const [selectedDeal, setSelectedDeal] = useState<string | null>(null);
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.8]);

  const handleSearch = (query: string, filters?: SearchFilters): void => {
    console.log('Search:', query, filters);
  };

  const scrollToContent = (): void => {
    const contentSection = document.getElementById('main-content');
    contentSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* Hero Section with Video Background */}
      <motion.section
        style={{ opacity, scale }}
        className="relative h-screen w-full overflow-hidden gpu-accelerated"
        role="banner"
        aria-label="Welcome to DealOpia"
      > 
        <div className="absolute inset-0 w-full h-full">
  {/* Background image */}
  <img
    src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80"
    alt=""
    className="object-cover w-full h-full absolute inset-0"
    aria-hidden="true"
  />
  <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/25 to-black" />
</div>


        <div className="relative h-full flex flex-col items-center justify-center px-4 py-16 md:py-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center max-w-4xl mx-auto mt-16 md:mt-0"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="flex items-center justify-center gap-2 mb-4"
            >
              <span className="px-4 py-1.5 bg-black/30 backdrop-blur-sm rounded-full text-[#a78bfa] border border-[rgba(139,92,246,0.2)] flex items-center gap-2">
                <Leaf size={16} style={{ color: '#a78bfa' }} />
                <span className="text-sm font-medium">Eco-conscious deals</span>
              </span>
            </motion.div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-white mb-6">
              Sustainable Shopping,{' '}
              <span className="gradient-text">Better Future</span>
            </h1>
<p 
  className="hidden md:block text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto font-inter" 
>
  Join our community of conscious shoppers and discover amazing local deals while making a positive impact on the environment.
</p>


            <SearchBar 
              onSearch={handleSearch}
              className="max-w-2xl mx-auto"
              categories={[
                { id: 1, name: 'Food' },
                { id: 2, name: 'Clothing' },
                { id: 3, name: 'Home' },
                { id: 4, name: 'Beauty' },
                { id: 5, name: 'Electronics' }
              ]}
            />
          </motion.div>

          <motion.button
            onClick={scrollToContent}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="md:absolute bottom-8 flex flex-col items-center text-white group cursor-pointer mt-12 mb-4 md:mb-0 md:mt-0"
            aria-label="Scroll to discover deals"
          >
            <span className="text-lg font-semibold mb-3 bg-[rgba(139,92,246,0.1)] backdrop-blur-sm px-6 py-2 rounded-full border border-[rgba(139,92,246,0.2)] group-hover:bg-[rgba(139,92,246,0.2)] transition-colors flex items-center gap-2 text-[#a78bfa]">
              <ShoppingBag size={18} />
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
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
              <div>
                <span className="text-primary-400 text-sm font-semibold tracking-wider mb-2 block">DISCOVER</span>
                <h2 className="text-3xl font-display font-bold text-white">
                  Featured Deals
                </h2>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <button className="px-4 py-2 rounded-full bg-primary-500 hover:bg-primary-600 text-white font-medium hover:shadow-lg transition-all">
                  View All
                </button>
                <button className="px-4 py-2 rounded-full bg-primary-500/10 hover:bg-primary-500/20 text-primary-400 font-medium border border-primary-500/20 transition-all">
                  Most Popular
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {exampleDeals.map((deal) => (
                <DealCard
                  key={deal.id}
                  deal={deal}
                  priority={deal.id === selectedDeal}
                  className={
                    deal.id === selectedDeal
                      ? 'ring-2 ring-primary-500 ring-offset-4 ring-offset-black'
                      : ''
                  }
                />
              ))}
            </div>
          </div>
        </section>

        {/* Integrated Sections with Suspense and fixed-size placeholders */}
        <Suspense fallback={<SectionPlaceholder text="Loading shops..." />}>
          <ShopsSection />
        </Suspense>
        
        <Suspense fallback={<SectionPlaceholder text="Loading about section..." />}>
          <AboutSection />
        </Suspense>
        
        <Suspense fallback={<SectionPlaceholder text="Loading nearby deals..." />}>
          <NearMeSection />
        </Suspense>
      </main>
    </>
  );
};

export default Home;