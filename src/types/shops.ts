export interface Shop {
    id: number;
    name: string;
    owner: number | User;
    description: string;
    short_description: string;
    logo: string;
    banner_image?: string;
    website?: string;
    phone?: string;
    email: string;
    categories: number[] | Category[];
    location: number | Location;
    is_verified: boolean;
    is_featured: boolean;
    rating: number;
    opening_hours: Record<string, string>;
    created_at: string;
    updated_at: string;
    carbon_neutral?: boolean;
    sustainability_initiatives?: any[];
    verified_sustainable?: boolean;
    distance?: number;
    deal_count?: number;
    location_details?: LocationDetails;
    active_deals?: Deal[];
}

export interface ShopFilters {
    categories?: number[];
    is_verified?: boolean;
    is_featured?: boolean;
    lat?: number;
    lng?: number;
    radius?: number;
    search?: string;
    page?: number;
    page_size?: number;
    ordering?: string;
}