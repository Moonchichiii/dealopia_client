import { useRef, useState, useEffect } from 'react';
import { Star, MapPin, Clock } from 'lucide-react';
import { useGeolocation } from '@/hooks/useGeolocation';
import { motion } from 'framer-motion';

interface Shop {
  id: string;
  name: string;
  description: string;
  rating: number;
  distance: number;
  openUntil: string;
  imageUrl: string;
  category: string;
}

const exampleShops: Shop[] = [
  {
    id: '1',
    name: 'Green Earth Market',
    description: 'Organic and sustainable products from local suppliers',
    rating: 4.8,
    distance: 0.8,
    openUntil: '21:00',
    imageUrl: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=800&auto=format&fit=crop&q=80',
    category: 'Grocery',
  },
  {
    id: '2',
    name: 'EcoFashion Boutique',
    description: 'Sustainable and ethical fashion for conscious shoppers',
    rating: 4.7,
    distance: 1.2,
    openUntil: '20:00',
    imageUrl: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=800&auto=format&fit=crop&q=80',
    category: 'Fashion',
  },
  {
    id: '3',
    name: 'Zero Waste Store',
    description: 'Package-free shopping for everyday essentials',
    rating: 4.9,
    distance: 1.5,
    openUntil: '19:00',
    imageUrl: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=800&auto=format&fit=crop&q=80',
    category: 'Home & Living',
  },
];

const ShopsSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { latitude, longitude } = useGeolocation();
  const [imagesLoaded, setImagesLoaded] = useState<Record<string, boolean>>({});

  // Preload images
  useEffect(() => {
    const loadedMap: Record<string, boolean> = {};
    
    exampleShops.forEach(shop => {
      loadedMap[shop.id] = false;
      
      const img = new Image();
      img.src = shop.imageUrl;
      img.onload = () => {
        setImagesLoaded(prev => ({
          ...prev,
          [shop.id]: true
        }));
      };
    });
    
    setImagesLoaded(loadedMap);
  }, []);

  return (
    <section className="py-20" id="shops" ref={containerRef}>
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-display font-bold text-center inline-block w-full bg-gradient-to-r from-primary-200 via-white to-accent-200 bg-clip-text text-transparent mb-12">
          Featured Shops
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {exampleShops.map((shop) => (
            <div
              key={shop.id}
              className="bg-neutral-900/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-neutral-800/50"
              style={{ 
                transform: 'translateZ(0)', // Force GPU acceleration
                willChange: 'transform' // Hint to browser about properties that will animate
              }}
            >
              {/* Use div with explicit dimensions instead of aspect ratio classes */}
              <div 
                className="relative w-full"
                style={{ 
                  height: '0',
                  paddingBottom: '56.25%', // 16:9 aspect ratio (9/16 = 0.5625 = 56.25%)
                  backgroundColor: '#1a1a1a',
                  overflow: 'hidden'
                }}
              >
                {/* Placeholder background */}
                <div 
                  className="absolute inset-0 bg-neutral-800"
                  aria-hidden="true"
                ></div>
                
                {/* Image with opacity transition */}
                <img
                  src={shop.imageUrl}
                  alt={shop.name}
                  width="800"
                  height="450"
                  className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
                  loading="lazy"
                  style={{ 
                    opacity: imagesLoaded[shop.id] ? 1 : 0
                  }}
                />
                
                {/* Category label */}
                <div className="absolute top-4 right-4 bg-neutral-900/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm text-white">
                  {shop.category}
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 
                    className="text-xl font-display font-semibold text-white"
                    style={{ minHeight: '1.75rem' }} // Reserve space for title
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
                  style={{ minHeight: '2.5rem' }} // Reserve space for description
                >
                  {shop.description}
                </p>

                <div className="flex items-center justify-between text-sm text-neutral-400">
                  <div className="flex items-center">
                    <MapPin size={14} className="mr-1" />
                    <span>{shop.distance}km away</span>
                  </div>
                  <div className="flex items-center">
                    <Clock size={14} className="mr-1" />
                    <span>Open until {shop.openUntil}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopsSection;