export interface Deal {
    id: string;
    title: string;
    description: string;
    shopName: string;
    shopId: string;
    originalPrice?: number;
    currentPrice?: number;
    discountPercentage?: number;
    type?: string;
    category?: string;
    tag?: string;
    icon?: string;
    imageUrl?: string;
    expiryDate?: string;
    url?: string;
    isExclusive?: boolean;
    isFeatured?: boolean;
  }