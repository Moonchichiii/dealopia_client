import { useRef, useState, useEffect } from 'react';
import { Star, MapPin, Clock } from 'lucide-react';
import { useFeaturedShops } from '@/hooks/useShops';

const ShopsSection = () => {
  const containerRef = useRef(null);
  const [imagesLoaded, setImagesLoaded] = useState({});
  
  // Use the hook from useShops.ts
  const { data: featuredShops, isLoading } = useFeaturedShops();

  // Preload images when we get the data
  useEffect(() => {
    if (!featuredShops || !Array.isArray(featuredShops)) return;
    
    const loadedMap = {};
    
    featuredShops.forEach(shop => {
      loadedMap[shop.id] = false;
      
      if (shop.logo) {
        const img = new Image();
        img.src = shop.logo;
        img.onload = () => {
          setImagesLoaded(prev => ({
            ...prev,
            [shop.id]: true
          }));
        };
      }
    });
    
    setImagesLoaded(loadedMap);
  }, [featuredShops]);

  return (
    <section className="py-20" id="shops" ref={containerRef}>
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-display font-bold text-center inline-block w-full bg-gradient-to-r from-primary-200 via-white to-accent-200 bg-clip-text text-transparent mb-12">
          Featured Shops
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            // Loading skeleton
            [...Array(3)].map((_, index) => (
              <div key={index} className="bg-neutral-900/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-neutral-800/50 animate-pulse">
                <div className="w-full aspect-video bg-neutral-800"></div>
                <div className="p-6">
                  <div className="h-6 bg-neutral-800 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-neutral-800 rounded w-full mb-2"></div>
                  <div className="h-4 bg-neutral-800 rounded w-2/3"></div>
                </div>
              </div>
            ))
          ) : featuredShops && Array.isArray(featuredShops) && featuredShops.length > 0 ? (
            // Actual shop cards
            featuredShops.map((shop) => (
              <div
                key={shop.id}
                className="bg-neutral-900/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-neutral-800/50"
                style={{
                  transform: 'translateZ(0)',
                  willChange: 'transform'
                }}
              >
                <div
                  className="relative w-full"
                  style={{
                    height: '0',
                    paddingBottom: '56.25%',
                    backgroundColor: '#1a1a1a',
                    overflow: 'hidden'
                  }}
                >
                  <div
                    className="absolute inset-0 bg-neutral-800"
                    aria-hidden="true"
                  ></div>
                  
                  <img
                    src={shop.logo || '/assets/images/shop-default.jpg'}
                    alt={shop.name}
                    width="800"
                    height="450"
                    className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
                    loading="lazy"
                    style={{
                      opacity: imagesLoaded[shop.id] ? 1 : 0
                    }}
                  />
                  
                  {shop.category_names && shop.category_names.length > 0 && (
                    <div className="absolute top-4 right-4 bg-neutral-900/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm text-white">
                      {shop.category_names[0]}
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3
                      className="text-xl font-display font-semibold text-white"
                      style={{ minHeight: '1.75rem' }}
                    >
                      {shop.name}
                    </h3>
                    <div className="flex items-center text-yellow-400">
                      <Star size={16} className="fill-current" />
                      <span className="ml-1 text-sm text-white">{shop.rating}</span>
                    </div>
                  </div>

                  <p
                    className="text-neutral-400 text-sm mb-4"
                    style={{ minHeight: '2.5rem' }}
                  >
                    {shop.short_description}
                  </p>

                  <div className="flex items-center justify-between text-sm text-neutral-400">
                    <div className="flex items-center">
                      <MapPin size={14} className="mr-1" />
                      <span>{shop.distance ? `${shop.distance}km away` : 'Location unavailable'}</span>
                    </div>
                    
                    {shop.opening_hours && (
                      <div className="flex items-center">
                        <Clock size={14} className="mr-1" />
                        <span>Open until {getClosingTime(shop.opening_hours)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-10">
              <p className="text-neutral-400">No featured shops available at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

// Helper function to get the closing time for today
const getClosingTime = (openingHours) => {
  if (!openingHours) return 'N/A';
  
  try {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const today = days[new Date().getDay()];
    
    if (openingHours[today]) {
      const hours = openingHours[today].split('-');
      if (hours.length > 1) {
        return hours[1].trim();
      }
    }
    
    return 'N/A';
  } catch (error) {
    return 'N/A';
  }
};

export default ShopsSection;