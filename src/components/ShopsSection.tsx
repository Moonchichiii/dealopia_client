import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin, Clock } from 'lucide-react';
import { useGeolocation } from '../hooks/useGeolocation';

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

  return (
    <section className="py-20" id="shops">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-display font-bold text-center bg-gradient-to-r from-primary-200 via-white to-accent-200 bg-clip-text text-transparent mb-12">
          Featured Shops
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {exampleShops.map((shop) => (
            <motion.div
              key={shop.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-stone-900/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-stone-800/50"
            >
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src={shop.imageUrl}
                  alt={shop.name}
                  className="object-cover w-full h-full"
                  loading="lazy"
                />
                <div className="absolute top-4 right-4 bg-stone-900/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm text-white">
                  {shop.category}
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-display font-semibold text-white">
                    {shop.name}
                  </h3>
                  <div className="flex items-center text-yellow-400">
                    <Star size={16} className="fill-current" />
                    <span className="ml-1 text-sm text-white">{shop.rating}</span>
                  </div>
                </div>

                <p className="text-stone-400 text-sm mb-4">
                  {shop.description}
                </p>

                <div className="flex items-center justify-between text-sm text-stone-400">
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
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopsSection;