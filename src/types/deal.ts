export interface Deal {
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
  dealType: 'flash' | 'clearance' | 'second-hand';
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

export interface DealFilters {
  category?: string;
  dealType?: Deal['dealType'];
  minSustainabilityScore?: number;
  maxDistance?: number;
  priceRange?: [number, number];
}