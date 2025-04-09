import { useState } from 'react';
import { useNearbyDeals } from '@/hooks/useDeals';
import { useGeolocation } from '@/hooks/useGeolocation';
import { DealCard } from '@/components/DealCard';
import LocationTracker from '@/components/LocationTracker';
import { MapPin, Navigation } from 'lucide-react';
import { Deal } from '@/types/deals';

const NearMeSection = () => {
  const [selectedDeal, setSelectedDeal] = useState<number | null>(null);
  const { latitude, longitude, loading: locationLoading, error: locationError, getLocation } =
    useGeolocation({ autoDetect: true });

  // Fetch nearby deals when location is available
  const { data: nearbyDealsData, isLoading: dealsLoading } = useNearbyDeals(latitude, longitude, 10);

  // Process the deals data into an array
  const nearbyDeals: Deal[] = (() => {
    if (!nearbyDealsData) return [];
    if (Array.isArray(nearbyDealsData)) return nearbyDealsData;
    if (nearbyDealsData.results && Array.isArray(nearbyDealsData.results))
      return nearbyDealsData.results;
    return [];
  })();

  const handleDealSelect = (deal: Deal) => {
    setSelectedDeal(deal.id);
    const dealCard = document.getElementById(`deal-${deal.id}`);
    if (dealCard) {
      dealCard.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="near-me" className="py-20 bg-gradient-to-b from-neutral-900 to-neutral-950">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-primary-400 text-sm font-semibold tracking-wider mb-2 block">
              NEAR YOU
            </span>
            <h2 className="text-3xl font-display font-bold text-white">Deals in Your Area</h2>
            <p className="text-gray-400 mt-2 max-w-2xl">
              Discover sustainable shopping options just around the corner.
            </p>
          </div>
          {locationError && (
            <button
              onClick={getLocation}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-full transition-colors"
            >
              <Navigation size={18} />
              <span>Enable Location</span>
            </button>
          )}
        </div>

        {locationLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : locationError ? (
          <div className="bg-neutral-900/30 backdrop-blur-sm rounded-xl border border-neutral-800/50 p-8 text-center">
            <MapPin size={48} className="text-primary-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Location Access Required</h3>
            <p className="text-neutral-400 mb-6 max-w-md mx-auto">
              To show you deals near you, please enable location services.
            </p>
            <button
              onClick={getLocation}
              className="px-6 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-full transition-colors"
            >
              Enable Location
            </button>
          </div>
        ) : dealsLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            <span className="ml-3 text-neutral-400">Finding deals near you...</span>
          </div>
        ) : nearbyDeals.length > 0 ? (
          <>
            {/* Map Section */}
            <div className="mb-12">
              <LocationTracker />
            </div>
            {/* Deals Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {nearbyDeals.map((deal: Deal) => (
                <DealCard
                  key={deal.id}
                  deal={deal}
                  id={`deal-${deal.id}`}
                  priority={deal.id === selectedDeal}
                  className={
                    deal.id === selectedDeal
                      ? 'ring-2 ring-primary-500 ring-offset-4 ring-offset-black'
                      : ''
                  }
                  onClick={() => handleDealSelect(deal)}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="bg-neutral-900/30 backdrop-blur-sm rounded-xl border border-neutral-800/50 p-8 text-center">
            <h3 className="text-xl font-semibold text-white mb-2">No Deals Found Nearby</h3>
            <p className="text-neutral-400 mb-4 max-w-md mx-auto">
              We couldn't find any deals in your area. Try expanding your search radius.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-full transition-colors"
            >
              Refresh
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default NearMeSection;
