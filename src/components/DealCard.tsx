import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Leaf, Clock } from 'lucide-react';
import { Deal } from '../types/deals';
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

  // Calculate discount percentage outside of render
  const discountPercentage = Math.round((1 - deal.price / deal.originalPrice) * 100);
  
  // Use low-res placeholder initially to reserve space
  const placeholderUrl = `https://images.unsplash.com/photo-${deal.imageUrl.split('photo-')[1]}&w=20&blur=50`;

  return (
    <div
      ref={cardRef}
      className={cn(
        'group relative bg-white dark:bg-neutral-900 rounded-xl overflow-hidden shadow-card hover:shadow-elevation transition-shadow duration-300',
        className
      )}
      id={`deal-${deal.id}`}
      role="article"
      aria-labelledby={`deal-title-${deal.id}`}
      // Remove the motion animation to prevent layout shifts
    >
      {/* Reserve space with a specific aspect ratio */}
      <div 
        className="aspect-w-16 aspect-h-9 bg-neutral-100 dark:bg-neutral-800"
        style={{ 
          aspectRatio: "16/9", 
          width: "100%",
          position: "relative"
        }}
      >
        {/* Use a background color while loading */}
        <div 
          style={{ 
            position: "absolute", 
            top: 0, 
            left: 0, 
            width: "100%", 
            height: "100%", 
            backgroundColor: "#1f1f1f" 
          }} 
        />
        
        {/* Image with explicit width and height */}
        <img
          ref={imgRef}
          src={placeholderUrl} // Start with low-res placeholder
          alt={deal.title}
          width="800"
          height="450"
          className="object-cover w-full h-full transition-opacity duration-300"
          loading={priority ? 'eager' : 'lazy'}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          srcSet={`
            ${deal.imageUrl}&w=400 400w,
            ${deal.imageUrl}&w=800 800w,
            ${deal.imageUrl}&w=1200 1200w
          `}
          style={{ position: "absolute", top: 0, left: 0 }}
        />
        
        {/* Fixed position for the discount badge */}
        <div 
          className="absolute top-2 right-2 bg-accent-500 text-white px-3 py-1 rounded-full text-sm font-semibold"
          aria-label={`${discountPercentage}% discount`}
        >
          {discountPercentage}% off
        </div>
      </div>

      {/* Content has fixed height to prevent shifts */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 
            id={`deal-title-${deal.id}`}
            className="text-lg font-display font-semibold text-neutral-900 dark:text-neutral-100 line-clamp-2"
            style={{ minHeight: "3.5rem" }} // Reserve space for two lines of text
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

        <p 
          className="text-neutral-600 dark:text-neutral-400 text-sm line-clamp-2 mb-3"
          style={{ minHeight: "2.5rem" }} // Reserve space for description
        >
          {deal.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-baseline space-x-2">
            <span className="text-xl font-display font-semibold text-primary-600 dark:text-primary-400">
              ${deal.price}
            </span>
            <span className="text-sm text-neutral-500 dark:text-neutral-500 line-through">
              ${deal.originalPrice}
            </span>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-sm">
          <div 
            className="flex items-center text-neutral-500 dark:text-neutral-400"
            aria-label={`${deal.distance.toFixed(1)} kilometers away`}
          >
            <MapPin size={14} className="mr-1" aria-hidden="true" />
            <span>{deal.distance.toFixed(1)}km away</span>
          </div>
          <div 
            className="flex items-center text-neutral-500 dark:text-neutral-400"
            aria-label={`Expires ${formatDistanceToNow(new Date(deal.expiresAt))}`}
          >
            <Clock size={14} className="mr-1" aria-hidden="true" />
            <span>{formatDistanceToNow(new Date(deal.expiresAt))}</span>
          </div>
        </div>
      </div>
    </div>
  );
};