import { Shop } from './shops';
import { Category } from './categories';

export interface Deal {
  id: number;
  title: string;
  shop: number;
  shop_name: string;
  description: string;
  original_price: number;
  discounted_price: number;
  discount_percentage: number;
  categories: number[];
  category_names: string[];
  image: string;
  start_date: string;
  end_date: string;
  is_featured: boolean;
  is_exclusive: boolean;
  is_verified: boolean;
  terms_and_conditions: string;
  coupon_code: string;
  redemption_link: string;
  views_count: number;
  clicks_count: number;
  created_at: string;
  updated_at: string;
}

export interface DealFilters {
  shop?: number;
  categories?: number | number[];
  is_featured?: boolean;
  is_exclusive?: boolean;
  search?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
}

export interface DealState {
  deals: Deal[];
  featuredDeals: Deal[];
  endingSoonDeals: Deal[];
  currentDeal: Deal | null;
  isLoading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
}