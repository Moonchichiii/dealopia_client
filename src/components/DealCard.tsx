import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Leaf, Clock } from 'lucide-react';
import { Deal } from '../types/deal';
import { formatDistanceToNow } from '../utils/date';
import { cn } from '../utils/cn';

interface DealCardProps {
  deal: Deal;
  priority?: boolean;
  className?: string;
}

export const DealCard: React.FC<DealCardProps> = ({ deal, priority = false, className }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!imgRef.current) return;

    // Load high-quality image after component mounts
    const img = new Image();
    img.src = deal.imageUrl;
    img.onload = () => {
      if (imgRef.current) {
        imgRef.current.src = deal.imageUrl;
      }
    };
  }, [deal.imageUrl]);

  const discountPercentage = Math.round((1 - deal.price / deal.originalPrice) * 100);

  // Generate blur hash placeholder URL
  const placeholderUrl = `https://images.unsplash.com/photo-${deal.imageUrl.split('photo-')[1]}&w=20&blur=50`;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={cn(
        'group relative bg-white dark:bg-stone-900 rounded-xl overflow-hidden shadow-card hover:shadow-elevation transition-shadow duration-300',
        className
      )}
      id={`deal-${deal.id}`}
      role="article"
      aria-labelledby={`deal-title-${deal.id}`}
    >
      <div className="aspect-w-16 aspect-h-9 bg-stone-100 dark:bg-stone-800">
        <img
          ref={imgRef}
          src={placeholderUrl}
          alt={deal.title}
          className="object-cover w-full h-full transition-opacity duration-300"
          loading={priority ? 'eager' : 'lazy'}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          srcSet={`
            ${deal.imageUrl}&w=400 400w,
            ${deal.imageUrl}&w=800 800w,
            ${deal.imageUrl}&w=1200 1200w
          `}
        />
        <div 
          className="absolute top-2 right-2 bg-accent-500 text-white px-3 py-1 rounded-full text-sm font-semibold"
          aria-label={`${discountPercentage}% discount`}
        >
          {discountPercentage}% off
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 
            id={`deal-title-${deal.id}`}
            className="text-lg font-display font-semibold text-stone-900 dark:text-stone-100 line-clamp-2"
          >
            {deal.title}
          </h3>
          <div 
            className="flex items-center space-x-1 text-leaf-500"
            aria-label={`Sustainability score: ${deal.sustainabilityScore}`}
          >
            <Leaf size={16} aria-hidden="true" />
            <span className="text-sm font-medium">{deal.sustainabilityScore}</span>
          </div>
        </div>

        <p className="text-stone-600 dark:text-stone-400 text-sm line-clamp-2 mb-3">
          {deal.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-baseline space-x-2">
            <span className="text-xl font-display font-semibold text-primary-600 dark:text-primary-400">
              ${deal.price}
            </span>
            <span className="text-sm text-stone-500 dark:text-stone-500 line-through">
              ${deal.originalPrice}
            </span>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-sm">
          <div 
            className="flex items-center text-stone-500 dark:text-stone-400"
            aria-label={`${deal.distance.toFixed(1)} kilometers away`}
          >
            <MapPin size={14} className="mr-1" aria-hidden="true" />
            <span>{deal.distance.toFixed(1)}km away</span>
          </div>
          <div 
            className="flex items-center text-stone-500 dark:text-stone-400"
            aria-label={`Expires ${formatDistanceToNow(new Date(deal.expiresAt))}`}
          >
            <Clock size={14} className="mr-1" aria-hidden="true" />
            <span>{formatDistanceToNow(new Date(deal.expiresAt))}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};