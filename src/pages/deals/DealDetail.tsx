import React, { useEffect, useState, lazy, Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';

// Import essential sections
import DealDetailSection from '@/sections/deals/DealDetailSection';
import RelatedDealsSection from '@/sections/deals/RelatedDealsSection';

// Import types
import { Deal } from '@/types/deals';

// In a real app, import your API services
// import { dealsApi } from '@/services/api/deals';

const DealDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Fetch deal data
  const { data: deal, isLoading, error } = useQuery({
    queryKey: ['deal', id],
    queryFn: async () => {
      // In a real app, call your API
      // return dealsApi.getDealById(id);
      
      // Mock data for demonstration
      if (!id) throw new Error('Deal ID is required');
      
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Generate mock deal data
      return {
        id,
        title: `Amazing Deal ${id}`,
        shop: Math.floor(Math.random() * 5) + 1,
        shop_name: `Shop ${id}`,
        description: 'Enjoy this exclusive offer for a limited time! Our specially curated products are available at incredible discounts. Don\'t miss this opportunity to save while enjoying premium quality items.',
        original_price: 129.99,
        discounted_price: 89.99,
        discount_percentage: 30,
        categories: [1, 3],
        category_names: ['Food & Dining', 'Entertainment'],
        image: '',
        start_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        end_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        is_featured: true,
        is_exclusive: Math.random() > 0.5,
        is_verified: true,
        terms_and_conditions: 'Valid for in-store purchases only. Cannot be combined with other offers. Limited to one per customer. No cash value.',
        coupon_code: 'DEAL' + id + '2023',
        redemption_link: 'https://example.com/redeem?code=DEAL' + id,
        views_count: Math.floor(Math.random() * 1500) + 500,
        clicks_count: Math.floor(Math.random() * 800) + 200,
        created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        type: Math.random() > 0.5 ? 'food' : 'entertainment'
      } as unknown as Deal;
    },
    enabled: !!id,
  });

  // Track view (in a real app, this would call your API)
  useEffect(() => {
    if (deal && id) {
      // In a real app:
      // dealsApi.trackView(id).catch(console.error);
      console.log(`Tracking view for deal ${id}`);
    }
  }, [deal, id]);

  // Handle favorite toggle
  const handleFavoriteToggle = (dealId: string) => {
    // In a real app:
    // const isFavorite = ... (check if already favorited)
    // favoritesApi.toggleFavorite(dealId, !isFavorite)
    //   .then(() => {
    //     queryClient.invalidateQueries(['deal', dealId]);
    //     toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites');
    //   })
    //   .catch(() => {
    //     toast.error('Failed to update favorites');
    //   });
    
    toast.success('Added to favorites');
    console.log(`Toggle favorite for deal ${dealId}`);
  };

  // Handle share
  const handleShare = (dealId: string) => {
    if (navigator.share) {
      navigator.share({
        title: deal?.title || 'Amazing Deal',
        text: deal?.description || 'Check out this amazing deal!',
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
      toast.error('Deal not found or has expired');
      navigate('/deals', { replace: true });
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
      <DealDetailSection 
        deal={deal} 
        onFavoriteToggle={handleFavoriteToggle}
        onShare={handleShare}
      />
      
      <RelatedDealsSection 
        categoryId={deal?.categories?.[0]} 
        dealId={id}
      />
    </main>
  );
};

export default DealDetailPage;