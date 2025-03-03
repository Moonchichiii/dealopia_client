import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';

// Import sections
import ShopDetailSection from '@/sections/shops/ShopDetailSection';

// Import types
import { Shop } from '@/types/shops';

// In a real app, import your API services
// import { shopsApi } from '@/services/api/shops';

const ShopDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Fetch shop data
  const { data: shop, isLoading, error } = useQuery({
    queryKey: ['shop', id],
    queryFn: async () => {
      // In a real app, call your API
      // return shopsApi.getShopById(id);
      
      // Mock data for demonstration
      if (!id) throw new Error('Shop ID is required');
      
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Generate mock shop data
      return {
        id,
        name: `Shop ${id}`,
        owner: 1,
        description: 'This is a detailed description of the shop that would explain what they offer, their unique selling propositions, their history, and what makes them special. Local shops often have interesting stories about how they were founded and their connection to the community.',
        short_description: 'A great local shop with amazing deals.',
        logo: '',
        banner_image: '',
        website: 'https://example.com',
        phone: '+1234567890',
        email: 'contact@example.com',
        categories: [1, 2],
        category_names: ['Retail', 'Fashion'],
        location: 1,
        is_verified: Math.random() > 0.5,
        is_featured: Math.random() > 0.7,
        rating: 3.5 + (Math.random() * 1.5),
        opening_hours: {
          monday: '9:00 AM - 5:00 PM',
          tuesday: '9:00 AM - 5:00 PM',
          wednesday: '9:00 AM - 5:00 PM',
          thursday: '9:00 AM - 5:00 PM',
          friday: '9:00 AM - 5:00 PM',
          saturday: '10:00 AM - 4:00 PM',
          sunday: 'Closed'
        },
        deal_count: Math.floor(Math.random() * 10) + 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      } as Shop;
    },
    enabled: !!id,
  });

  // Handle favorite toggle
  const handleFavoriteToggle = (shopId: string) => {
    toast.success('Shop added to favorites');
    console.log(`Toggle favorite for shop ${shopId}`);
  };

  // Handle share
  const handleShare = (shopId: string) => {
    if (navigator.share) {
      navigator.share({
        title: shop?.name || 'Amazing Shop',
        text: shop?.short_description || 'Check out this amazing shop!',
        url: window.location.href,
      }).catch(console.error);
    } else {
      // Fallback if Web Share API is not available
      navigator.clipboard.writeText(window.location.href)
        .then(() => toast.success('Link copied to clipboard'))
        .catch(() => toast.error('Failed to copy link'));
    }
  };

  // Handle navigation errors
  useEffect(() => {
    if (error) {
      toast.error('Shop not found');
      navigate('/shops', { replace: true });
    }
  }, [error, navigate]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center pt-20">
        <div className="animate-pulse">
          <div className="h-8 w-32 bg-white/10 rounded mb-4"></div>
          <div className="h-4 w-64 bg-white/10 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <main>
      <ShopDetailSection 
        shop={shop} 
        onFavoriteToggle={handleFavoriteToggle}
        onShare={handleShare}
      />
    </main>
  );
};

export default ShopDetailPage;