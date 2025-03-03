export interface Shop {
    id: number;
    name: string;
    owner: number;
    description: string;
    short_description: string;
    logo: string;
    banner_image: string;
    website: string;
    phone: string;
    email: string;
    categories: number[];
    category_names: string[];
    location: number;
    is_verified: boolean;
    is_featured: boolean;
    rating: number;
    opening_hours: Record<string, string>;
    deal_count: number;
    created_at: string;
    updated_at: string;
  }
  
  export interface ShopFilters {
    categories?: number | number[];
    is_verified?: boolean;
    is_featured?: boolean;
    search?: string;
    ordering?: string;
    page?: number;
    page_size?: number;
  }
  
  export interface ShopState {
    shops: Shop[];
    featuredShops: Shop[];
    currentShop: Shop | null;
    isLoading: boolean;
    error: string | null;
    totalPages: number;
    currentPage: number;
  }