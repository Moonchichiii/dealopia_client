import { useState, lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, ShoppingBag, Leaf } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { DealCard } from '@/components/ui/DealCard';
import SearchBar from '@/components/search/SearchBar';
import SearchSection from '@/components/sections/SearchSection';
import { useFeaturedDeals } from '@/hooks/useDeals';
import { useCategories } from '@/hooks/useCategories';
import { useSearch } from '@/hooks/useSearch';

const AboutSection = lazy(() => import('@/components/sections/AboutSection'));
const ShopsSection = lazy(() => import('@/components/sections/ShopsSection'));
const NearMeSection = lazy(() => import('@/components/sections/NearMeSection'));

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

const Home = () => {
  const { t } = useTranslation();
  const [selectedDeal, setSelectedDeal] = useState<number | null>(null);
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.8]);

  const { searchQuery, handleSearch, results, totalResults, isLoading: isLoadingSearch } = useSearch();
  const { data: featuredDeals, isLoading: isLoadingDeals } = useFeaturedDeals();
  const { data: categoriesData } = useCategories();

  const processedCategories = (() => {
    if (!categoriesData) return [];
    if (Array.isArray(categoriesData)) {
      return categoriesData.map(cat => ({ id: cat.id, name: cat.name }));
    }
    if (categoriesData.results && Array.isArray(categoriesData.results)) {
      return categoriesData.results.map(cat => ({ id: cat.id, name: cat.name }));
    }
    return [];
  })();

  const scrollToContent = () => {
    const contentSection = document.getElementById('main-content');
    contentSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* HERO SECTION */}
      <motion.section
        style={{ opacity, scale }}
        className="relative h-screen w-full overflow-hidden"
        role="banner"
        aria-label="Welcome to DealOpia"
      >
        <div className="absolute inset-0 w-full h-full">
          <img
            src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80"
            alt=""
            className="object-cover w-full h-full absolute inset-0"
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/25 to-black" />
        </div>
        <div className="relative h-full flex flex-col items-center justify-center px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center max-w-4xl mx-auto mt-16"
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
              Sustainable shopping, <span className="gradient-text">Better Future</span>
            </h1>
            <p className="hidden md:block text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
              Join our community of conscious shoppers and discover amazing local deals while making a positive impact on the environment.
            </p>
            <SearchBar
              onSearch={(query, filters) => {
                handleSearch(query, filters);
                // When the "Near Me" button is used (i.e. filters include location),
                // scroll to the Near Me section.
                if (filters.latitude && filters.longitude) {
                  const nearMeSection = document.getElementById('near-me');
                  nearMeSection?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="max-w-2xl mx-auto"
              categories={processedCategories}
            />
            <div className="max-w-4xl mx-auto">
              <SearchSection
                query={searchQuery}
                results={results}
                totalResults={totalResults}
                isLoading={isLoadingSearch}
                onFilterClick={() => {}}
              />
            </div>
          </motion.div>
          <motion.button
            onClick={scrollToContent}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="md:absolute bottom-8 flex flex-col items-center text-white group cursor-pointer mt-12"
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

      <main id="main-content">
        {/* FEATURED DEALS SECTION */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
              <div>
                <span className="text-primary-400 text-sm font-semibold tracking-wider mb-2 block">DISCOVER</span>
                <h2 className="text-3xl font-display font-bold text-white">Featured Deals</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                <button className="px-4 py-2 rounded-full bg-primary-500 hover:bg-primary-600 text-white font-medium transition-all">
                  View All
                </button>
                <button className="px-4 py-2 rounded-full bg-primary-500/10 hover:bg-primary-500/20 text-primary-400 font-medium border border-primary-500/20 transition-all">
                  Most Popular
                </button>
              </div>
            </div>
            {isLoadingDeals ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="bg-neutral-900/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-neutral-800/50 animate-pulse">
                    <div className="w-full aspect-video bg-neutral-800"></div>
                    <div className="p-4">
                      <div className="h-5 bg-neutral-800 rounded w-3/4 mb-3"></div>
                      <div className="h-4 bg-neutral-800 rounded w-1/3 mb-3"></div>
                      <div className="h-3 bg-neutral-800 rounded w-full"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : featuredDeals && featuredDeals.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredDeals.map((deal) => (
                  <DealCard
                    key={deal.id}
                    deal={deal}
                    priority={deal.id === selectedDeal}
                    className={deal.id === selectedDeal ? 'ring-2 ring-primary-500 ring-offset-4 ring-offset-black' : ''}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-neutral-400">No featured deals available at the moment.</p>
              </div>
            )}
          </div>
        </section>

        {/* NEAR ME SECTION */}
        <Suspense fallback={<SectionPlaceholder text="Loading nearby deals..." />}>
          <NearMeSection />
        </Suspense>

        <Suspense fallback={<SectionPlaceholder text="Loading shops..." />}>
          <ShopsSection />
        </Suspense>
        <Suspense fallback={<SectionPlaceholder text="Loading about section..." />}>
          <AboutSection />
        </Suspense>
      </main>
    </>
  );
};

export default Home;
