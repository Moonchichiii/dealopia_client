import { Deal } from './deals';
import { Shop } from './shops';

// Types for the Hero Section
export interface TrendingDeal {
  id: string;
  icon: string;
  iconType: 'food' | 'fashion' | 'wellness' | 'coffee' | 'yoga' | 'book';
  title: string;
  subtitle: string;
  discount: string;
}

// Types for Featured Shops
export interface FeaturedShop extends Omit<Shop, 'initialsColor'> {
  initials: string;
  initialsColor: 'pink' | 'green' | 'blue' | 'yellow';
  category: string;
  activeDeals: number;
}

// Newsletter Form State
export interface NewsletterState {
  email: string;
  isSubmitting: boolean;
  isSuccess: boolean;
  error: string;
}

// Common Section Props
export interface SectionProps {
  className?: string;
}

// Icon Style Helper Types
export interface IconStyle {
  bg: string;
  text: string;
}