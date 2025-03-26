import { useCallback, useMemo, useState } from 'react';

// Internal hooks
import { useGeolocation } from '../../hooks/useGeolocation';

// Internal components
import { DealCard } from '../DealCard';
import DealMap from '../DealMap';

// Types
import { Deal } from '../../types/deals';

// Mock data (should eventually be moved to a separate file)
const NEARBY_DEALS: Deal[] = [
  {
    id: '1',
    title: 'Organic Cotton T-Shirt',
    description: 'Sustainably made cotton t-shirt from local manufacturer',
    price: 24.99,
    originalPrice: 49.99,
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&auto=format&fit=crop&q=80',
    distance: 1.2,
    sustainabilityScore: 9.2,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
    category: 'Clothing',
    dealType: 'second-hand',
    location: {
      latitude: 51.5074,
      longitude: -0.1278,
    },
    merchant: {
      id: '1',
      name: 'EcoFashion',
      rating: 4.8,
    },
  },
  {
    id: '2',
    title: 'Local Organic Produce Box',
    description: 'Fresh seasonal vegetables from local farmers',
    price: 29.99,
    originalPrice: 39.99,
    imageUrl: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=800&auto=format&fit=crop&q=80',
    distance: 0.8,
    sustainabilityScore: 9.8,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 48).toISOString(),
    category: 'Food',
    dealType: 'flash',
    location: {
      latitude: 51.5124,
      longitude: -0.1300,
    },
    merchant: {
      id: '2',
      name: 'Farm Fresh',
      rating: 4.9,
    },
  },
];

const LoadingView = () => (
  <section className="py-20" id="near-me">
    <div className="container mx-auto px-4">
      <div className="text-center">
        <p className="text-neutral-400">Getting your location...</p>
      </div>
    </div>
  </section>
);

const LocationPermissionView = () => (
  <section className="py-20" id="near-me">
    <div className="container mx-auto px-4">
      <div className="text-center">
        <p className="text-neutral-400">Please enable location services to see deals near you.</p>
      </div>
    </div>
  </section>
);

const NearMeSection: React.FC = () => {
  const { latitude, longitude, loading } = useGeolocation();
  const [selectedDeal, setSelectedDeal] = useState<string | null>(null);

  // Use memoized handler for deal selection
  const handleDealSelect = useCallback((deal: Deal) => {
    setSelectedDeal(deal.id);
    const dealElement = document.getElementById(`deal-${deal.id}`);
    if (dealElement) {
      dealElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  if (loading) {
    return <LoadingView />;
  }

  if (!latitude || !longitude) {
    return <LocationPermissionView />;
  }

  return (
    <section className="py-20" id="near-me">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-display font-bold text-center bg-gradient-to-r from-primary-200 via-white to-accent-200 bg-clip-text text-transparent mb-12">
          Deals Near You
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {NEARBY_DEALS.map((deal) => (
            <DealCard
              key={deal.id}
              deal={deal}
              priority={deal.id === selectedDeal}
              className={
                deal.id === selectedDeal 
                  ? 'ring-2 ring-primary-500 ring-offset-4 ring-offset-neutral-950' 
                  : ''
              }
            />
          ))}
        </div>

        <DealMap
          deals={NEARBY_DEALS}
          height="500px"
          className="rounded-2xl overflow-hidden shadow-xl"
          onDealSelect={handleDealSelect}
        />
      </div>
    </section>
  );
};

export default NearMeSection;