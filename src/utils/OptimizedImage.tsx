import React, { useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  width,
  height,
  loading = 'lazy',
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  
  // Format the image URL correctly
  const imgSrc = formatImageUrl(src);
  
  return (
    <>
      {!isLoaded && !error && (
        <div className={`animate-pulse bg-white/5 ${className}`} style={{ width, height }} />
      )}
      <img
        src={imgSrc}
        alt={alt}
        className={`${className} ${!isLoaded ? 'hidden' : ''}`}
        width={width}
        height={height}
        loading={loading}
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          setError(true);
          setIsLoaded(true);
        }}
      />
      {error && (
        <div className={`bg-white/5 flex items-center justify-center ${className}`} style={{ width, height }}>
          <span className="text-2xl">🖼️</span>
        </div>
      )}
    </>
  );
};

// Helper function to format image URLs correctly
function formatImageUrl(src: string): string {
  if (!src) return '';
  
  // If it's already a full URL, return it
  if (src.startsWith('http://') || src.startsWith('https://')) {
    return src;
  }
  
  // If it's a relative path, add the API base URL
  // Remove leading slash if present
  const cleanPath = src.startsWith('/') ? src.substring(1) : src;
  
  // Get the media URL from environment or default to /media
  const mediaUrl = import.meta.env.VITE_MEDIA_URL || '/media';
  
  return `${mediaUrl}/${cleanPath}`;
}

export default OptimizedImage;