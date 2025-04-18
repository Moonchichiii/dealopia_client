import { useState, useEffect, useRef, useCallback } from 'react';
import { useNearbyDeals } from '@/hooks/useDeals';
import { useGeolocation } from '@/hooks/useGeolocation';
import { DealCard } from '@/components/ui/DealCard';
import { MapPin, Navigation, Compass, List, Grid, ArrowUpRight, AlertTriangle, Leaf } from 'lucide-react';
import { Deal } from '@/types/deals';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import  dealService  from '@/api/deals/dealService';

// Register GSAP plugin
gsap.registerPlugin(ScrollTrigger);

// SVG background component for NearMe section
const NearMeBackground = () => (
  <div className="absolute inset-0 -z-10 w-full h-full overflow-hidden opacity-60">
    <svg viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
      {/* Gradient background */}
      <defs>
        <linearGradient id="mapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0a1a24" />
          <stop offset="100%" stopColor="#071520" />
        </linearGradient>
        
        {/* Location pin pattern */}
        <pattern id="pinPattern" patternUnits="userSpaceOnUse" width="100" height="100" patternTransform="rotate(10)">
          <path d="M50,20 C65,20 75,35 75,50 C75,65 60,85 50,95 C40,85 25,65 25,50 C25,35 35,20 50,20 Z" fill="none" stroke="#3a6a9f" strokeWidth="1" opacity="0.15" />
          <circle cx="50" cy="45" r="5" fill="none" stroke="#3a6a9f" strokeWidth="1" opacity="0.15" />
        </pattern>
        
        {/* Coordinate grid pattern */}
        <pattern id="gridPattern" patternUnits="userSpaceOnUse" width="200" height="200">
          <path d="M0,0 L200,0 M0,50 L200,50 M0,100 L200,100 M0,150 L200,150 M0,200 L200,200" stroke="#2b5a8a" strokeWidth="0.5" opacity="0.1" />
          <path d="M0,0 L0,200 M50,0 L50,200 M100,0 L100,200 M150,0 L150,200 M200,0 L200,200" stroke="#2b5a8a" strokeWidth="0.5" opacity="0.1" />
        </pattern>
        
        {/* Compass pattern */}
        <pattern id="compassPattern" patternUnits="userSpaceOnUse" width="200" height="200" patternTransform="scale(0.5) rotate(5)">
          <circle cx="100" cy="100" r="80" fill="none" stroke="#3a6a9f" strokeWidth="1" opacity="0.08" />
          <circle cx="100" cy="100" r="60" fill="none" stroke="#3a6a9f" strokeWidth="1" opacity="0.08" />
          <path d="M100,10 L100,50 M100,150 L100,190 M10,100 L50,100 M150,100 L190,100" stroke="#3a6a9f" strokeWidth="1" opacity="0.08" />
          <path d="M100,20 L95,30 L105,30 Z" fill="#3a6a9f" opacity="0.1" />
          <path d="M100,180 L95,170 L105,170 Z" fill="#3a6a9f" opacity="0.1" />
          <path d="M20,100 L30,95 L30,105 Z" fill="#3a6a9f" opacity="0.1" />
          <path d="M180,100 L170,95 L170,105 Z" fill="#3a6a9f" opacity="0.1" />
        </pattern>
      </defs>
      
      {/* Base background */}
      <rect width="100%" height="100%" fill="url(#mapGradient)" />
      
      {/* Pattern layers */}
      <rect width="100%" height="100%" fill="url(#pinPattern)" />
      <rect width="100%" height="100%" fill="url(#gridPattern)" opacity="0.7" />
      <rect width="100%" height="100%" fill="url(#compassPattern)" />
      
      {/* Large corner elements */}
      <circle cx="100" cy="100" r="300" fill="#1a3a55" opacity="0.04" />
      <circle cx="1100" cy="500" r="350" fill="#1a3a55" opacity="0.04" />
      
      {/* Abstract map elements */}
      <g opacity="0.1">
        {/* Stylized roads/paths */}
        <path d="M0,300 C200,320 400,250 600,300 C800,350 1000,280 1200,300" fill="none" stroke="#3a6a9f" strokeWidth="5" />
        <path d="M300,0 C320,200 250,400 300,600" fill="none" stroke="#3a6a9f" strokeWidth="5" />
        <path d="M900,0 C880,200 950,400 900,600" fill="none" stroke="#3a6a9f" strokeWidth="5" />
        
        {/* Location markers */}
        <circle cx="300" cy="300" r="20" fill="#3a6a9f" />
        <circle cx="600" cy="350" r="15" fill="#3a6a9f" />
        <circle cx="900" cy="250" r="25" fill="#3a6a9f" />
      </g>
      
      {/* Subtle compass in the corner */}
      <g transform="translate(1100, 100)" opacity="0.15">
        <circle cx="0" cy="0" r="60" fill="none" stroke="#5a8aB7" strokeWidth="1" />
        <path d="M0,-50 L0,50 M-50,0 L50,0" stroke="#5a8aB7" strokeWidth="1" />
        <path d="M0,-40 L-5,-30 L5,-30 Z" fill="#5a8aB7" />
        <text x="0" y="-55" fill="#5a8aB7" textAnchor="middle" fontSize="10">N</text>
        <text x="55" y="0" fill="#5a8aB7" textAnchor="middle" fontSize="10" dominantBaseline="middle">E</text>
        <text x="0" y="55" fill="#5a8aB7" textAnchor="middle" fontSize="10">S</text>
        <text x="-55" y="0" fill="#5a8aB7" textAnchor="middle" fontSize="10" dominantBaseline="middle">W</text>
      </g>
    </svg>
  </div>
);

// Leaflet map component
const LeafletMap = ({ deals = [], selectedDeal, onDealSelect }) => {
  const mapRef = useRef(null);
  const { latitude, longitude } = useGeolocation({ autoDetect: true });
  const mapContainerRef = useRef(null);
  
  useEffect(() => {
    if (!mapRef.current && mapContainerRef.current && latitude && longitude) {
      // Dynamically import Leaflet only on the client side
      import('leaflet').then(L => {
        // Initialize map
        const map = L.map(mapContainerRef.current).setView([latitude, longitude], 13);
        
        // Add tile layer (OpenStreetMap)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19
        }).addTo(map);
        
        // Add user marker
        const userIcon = L.divIcon({
          html: `<div class="w-6 h-6 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center">
                  <div class="w-2 h-2 bg-white rounded-full"></div>
                </div>`,
          className: 'user-location-marker',
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });
        
        L.marker([latitude, longitude], { icon: userIcon }).addTo(map)
          .bindPopup('You are here')
          .openPopup();
        
        // Add deal markers
        deals.forEach(deal => {
          const dealIcon = L.divIcon({
            html: `<div class="w-8 h-8 ${selectedDeal === deal.id ? 'bg-primary-500' : 'bg-accent-500'} rounded-full border-2 border-white flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 hover:scale-110">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M12 2 L12 6"></path>
                      <path d="M12 18 L12 22"></path>
                      <path d="M4.93 4.93 L7.76 7.76"></path>
                      <path d="M16.24 16.24 L19.07 19.07"></path>
                      <path d="M2 12 L6 12"></path>
                      <path d="M18 12 L22 12"></path>
                      <path d="M4.93 19.07 L7.76 16.24"></path>
                      <path d="M16.24 7.76 L19.07 4.93"></path>
                    </svg>
                  </div>`,
            className: 'deal-location-marker',
            iconSize: [32, 32],
            iconAnchor: [16, 16]
          });
          
          const marker = L.marker([deal.latitude, deal.longitude], { icon: dealIcon }).addTo(map);
          
          marker.on('click', () => {
            onDealSelect(deal);
          });
          
          const popupContent = `
            <div class="p-2">
              <h3 class="font-bold">${deal.title}</h3>
              <p class="text-sm text-gray-600">${deal.business_name}</p>
              <p class="text-sm mt-1">${deal.description.substring(0, 50)}...</p>
              <div class="mt-2 text-primary-500 cursor-pointer view-deal">View Deal →</div>
            </div>
          `;
          
          const popup = L.popup({
            closeButton: false,
            className: 'custom-popup'
          }).setContent(popupContent);
          
          marker.bindPopup(popup);
          
          marker.on('mouseover', function() {
            this.openPopup();
          });
          
          // Add click event to "View Deal" in popup
          marker.on('popupopen', () => {
            setTimeout(() => {
              const viewDealBtn = document.querySelector('.view-deal');
              if (viewDealBtn) {
                viewDealBtn.addEventListener('click', () => {
                  onDealSelect(deal);
                });
              }
            }, 0);
          });
        });
        
        // Focus on selected deal
        if (selectedDeal) {
          const selectedDealData = deals.find(deal => deal.id === selectedDeal);
          if (selectedDealData) {
            map.setView([selectedDealData.latitude, selectedDealData.longitude], 15, {
              animate: true,
              duration: 1
            });
          }
        }
        
        mapRef.current = map;
        
        // Clean up on unmount
        return () => {
          if (map) {
            map.remove();
            mapRef.current = null;
          }
        };
      });
    }
    
    // Update map when selected deal changes
    if (mapRef.current && selectedDeal) {
      const selectedDealData = deals.find(deal => deal.id === selectedDeal);
      if (selectedDealData) {
        mapRef.current.setView([selectedDealData.latitude, selectedDealData.longitude], 15, {
          animate: true,
          duration: 1
        });
      }
    }
    
  }, [latitude, longitude, deals, selectedDeal, onDealSelect]);
  
  return (
    <div className="w-full h-[500px] rounded-xl overflow-hidden shadow-lg shadow-primary-900/20 border border-neutral-800/50">
      <div ref={mapContainerRef} className="w-full h-full bg-neutral-900/50" />
    </div>
  );
};

const NearMeSection = () => {
  const [selectedDeal, setSelectedDeal] = useState<number | null>(null);
  const [nearbyDeals, setNearbyDeals] = useState<Deal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid');
  const sectionRef = useRef<HTMLDivElement>(null);

  // Use the geolocation hook with auto-detection
  const { 
    latitude, 
    longitude, 
    loading: locationLoading, 
    error: locationError, 
    getLocation,
    addressString 
  } = useGeolocation({ 
    autoDetect: true,
    onLocationSuccess: (coords) => {
      fetchNearbyDeals(coords.latitude, coords.longitude);
    }
  });

  // Fetch nearby deals when location is available
  const fetchNearbyDeals = useCallback(async (lat: number, lng: number) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const deals = await dealService.getNearbyDeals(lat, lng, 10);
      setNearbyDeals(Array.isArray(deals) ? deals : []);
    } catch (err) {
      console.error('Error fetching nearby deals:', err);
      setError('Failed to load deals near you. Please try again.');
      
      // Add sample data for demonstration if API fails
      setNearbyDeals([
        {
          id: 1,
          title: "50% Off Organic Groceries",
          business_name: "GreenMart",
          description: "Get 50% off your first purchase of organic, locally-sourced produce.",
          image: "/api/placeholder/400/300",
          latitude: lat ? lat + 0.01 : 37.7749,
          longitude: lng ? lng + 0.01 : -122.4194,
          distance: 0.8,
          deal_type: "discount",
          sustainability_score: 92
        },
        {
          id: 2,
          title: "Buy One Get One Free Sustainable Fashion",
          business_name: "EcoStyle",
          description: "BOGO on all recycled fabric clothing items, this weekend only!",
          image: "/api/placeholder/400/300",
          latitude: lat ? lat - 0.005 : 37.7699,
          longitude: lng ? lng - 0.008 : -122.4294,
          distance: 1.2,
          deal_type: "bogo",
          sustainability_score: 85
        },
        {
          id: 3,
          title: "Free Reusable Container with Purchase",
          business_name: "Zero Waste Shop",
          description: "Get a free bamboo container with any purchase over $25.",
          image: "/api/placeholder/400/300",
          latitude: lat ? lat + 0.008 : 37.7839,
          longitude: lng ? lng - 0.002 : -122.4094,
          distance: 0.5,
          deal_type: "gift",
          sustainability_score: 98
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Listen for location events from other components
  useEffect(() => {
    const handleLocationEvent = (event: Event) => {
      const customEvent = event as CustomEvent<{latitude: number, longitude: number}>;
      if (customEvent.detail) {
        const { latitude, longitude } = customEvent.detail;
        fetchNearbyDeals(latitude, longitude);
      }
    };
    
    document.addEventListener('dealopiaLocationAvailable', handleLocationEvent);
    
    return () => {
      document.removeEventListener('dealopiaLocationAvailable', handleLocationEvent);
    };
  }, [fetchNearbyDeals]);
  
  // Manually fetch deals when location changes
  useEffect(() => {
    if (latitude && longitude && !locationLoading) {
      fetchNearbyDeals(latitude, longitude);
    }
  }, [latitude, longitude, locationLoading, fetchNearbyDeals]);
  
  // GSAP animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate title and description
      gsap.from('.near-me-title', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        scrollTrigger: {
          trigger: '.near-me-section',
          start: 'top center+=100',
          toggleActions: 'play none none reverse'
        }
      });
      
      // Animate map
      gsap.from('.map-container', {
        y: 50,
        opacity: 0,
        duration: 1,
        delay: 0.3,
        scrollTrigger: {
          trigger: '.near-me-section',
          start: 'top center',
          toggleActions: 'play none none reverse'
        }
      });
      
      // Animate deals
      gsap.from('.deal-card', {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
        scrollTrigger: {
          trigger: '.deals-container',
          start: 'top center+=150',
          toggleActions: 'play none none reverse'
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [nearbyDeals]);

  const handleDealSelect = useCallback((deal: Deal) => {
    setSelectedDeal(deal.id);
    
    if (viewMode !== 'map') {
      const dealElement = document.getElementById(`deal-${deal.id}`);
      if (dealElement) {
        dealElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [viewMode]);

  return (
    <section 
      ref={sectionRef}
      id="near-me" 
      className="py-20 relative near-me-section bg-gradient-to-b from-neutral-900 to-neutral-950"
    >
      {/* Background */}
      <NearMeBackground />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 near-me-title">
          <div>
            <span className="text-primary-400 text-sm font-semibold tracking-wider mb-2 block">
              DISCOVER NEARBY
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white bg-gradient-to-r from-primary-300 via-white to-accent-300 bg-clip-text text-transparent">
              Sustainable Deals Near You
            </h2>
            {addressString && (
              <p className="text-gray-400 mt-2 flex items-center">
                <MapPin size={16} className="inline mr-2 text-primary-400" />
                {addressString}
              </p>
            )}
            <p className="text-neutral-300 mt-2 max-w-2xl">
              Find eco-friendly businesses and exclusive offers in your neighborhood.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* View toggle */}
            {nearbyDeals.length > 0 && !isLoading && (
              <div className="bg-neutral-800 rounded-full p-1 flex">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${
                    viewMode === 'grid'
                      ? "bg-primary-500 text-white"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  <Grid size={18} />
                  <span>Grid</span>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${
                    viewMode === 'list'
                      ? "bg-primary-500 text-white"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  <List size={18} />
                  <span>List</span>
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${
                    viewMode === 'map'
                      ? "bg-primary-500 text-white"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  <MapPin size={18} />
                  <span>Map</span>
                </button>
              </div>
            )}
            
            {/* Get location button */}
            {(locationError || !latitude) && (
              <button
                onClick={getLocation}
                className="flex items-center gap-2 px-5 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-full transition-colors"
              >
                <Navigation size={18} />
                <span>Enable Location</span>
              </button>
            )}
            
            {latitude && longitude && (
              <button
                onClick={() => setSelectedDeal(null)}
                className="flex items-center gap-2 px-4 py-2 bg-neutral-900/60 backdrop-blur-sm hover:bg-neutral-800 text-white rounded-full transition-colors border border-neutral-800/50"
              >
                <Compass size={16} />
                <span>Reset View</span>
              </button>
            )}
          </div>
        </div>

        {locationError && (
          <div className="bg-red-900/20 border border-red-800/40 rounded-lg p-6 mb-8">
            <div className="flex items-start">
              <AlertTriangle className="w-6 h-6 text-red-400 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-lg font-medium text-red-300 mb-2">Location Error</h3>
                <p className="text-red-200">{locationError}</p>
                <button
                  onClick={getLocation}
                  className="mt-4 px-4 py-2 bg-red-800 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {(isLoading || locationLoading) ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            <span className="ml-3 text-neutral-400">{locationLoading ? 'Getting your location...' : 'Finding deals near you...'}</span>
          </div>
        ) : nearbyDeals.length > 0 ? (
          <>
            {/* Map view */}
            {viewMode === 'map' && (
              <div className="mb-8 rounded-xl overflow-hidden border border-neutral-800/50 map-container">
                <LeafletMap 
                  deals={nearbyDeals} 
                  selectedDeal={selectedDeal} 
                  onDealSelect={handleDealSelect} 
                />
              </div>
            )}
            
            {/* Grid view */}
            {viewMode === 'grid' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 deals-container">
                {nearbyDeals.map((deal) => (
                  <div 
                    key={deal.id}
                    id={`deal-${deal.id}`}
                    className={`deal-card transition-all duration-300 ${
                      deal.id === selectedDeal
                        ? 'ring-2 ring-primary-500 ring-offset-4 ring-offset-neutral-950 shadow-xl shadow-primary-500/20'
                        : 'hover:shadow-lg hover:shadow-primary-900/10'
                    }`}
                    onClick={() => handleDealSelect(deal)}
                  >
                    <DealCard
                      deal={deal}
                      priority={deal.id === selectedDeal}
                      className=""
                    />
                  </div>
                ))}
              </div>
            )}
            
            {/* List view */}
            {viewMode === 'list' && (
              <div className="space-y-4 deals-container">
                {nearbyDeals.map((deal) => (
                  <div 
                    key={deal.id}
                    id={`deal-${deal.id}`}
                    className={`deal-card transition-all duration-300 bg-neutral-900/60 backdrop-blur-sm rounded-xl overflow-hidden border border-neutral-800/50 hover:border-primary-500/30 ${
                      deal.id === selectedDeal
                        ? 'ring-2 ring-primary-500 ring-offset-4 ring-offset-neutral-950 shadow-xl shadow-primary-500/20'
                        : 'hover:shadow-lg hover:shadow-primary-900/10'
                    }`}
                    onClick={() => handleDealSelect(deal)}
                  >
                    <div className="flex flex-col md:flex-row cursor-pointer">
                      <div className="md:w-1/3 relative">
                        <img 
                          src={deal.image || "/api/placeholder/400/300"} 
                          alt={deal.title} 
                          className="w-full h-48 md:h-full object-cover"
                        />
                        <div className="absolute top-3 left-3 bg-accent-500 text-white text-xs font-semibold px-2 py-1 rounded">
                          {deal.deal_type === 'discount' ? 'DISCOUNT' : 
                           deal.deal_type === 'bogo' ? 'BOGO' : 'GIFT'}
                        </div>
                      </div>
                      <div className="p-5 md:w-2/3 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                            <h3 className="text-xl font-display font-semibold text-white mb-1">{deal.title}</h3>
                            <span className="bg-primary-500/10 text-primary-400 text-xs px-2 py-1 rounded flex items-center">
                              <Leaf size={12} className="mr-1" />
                              <span className="font-bold">{deal.sustainability_score}%</span>
                            </span>
                          </div>
                          <p className="text-sm text-primary-400 mb-3">{deal.business_name}</p>
                          <p className="text-neutral-300">{deal.description}</p>
                        </div>
                        <div className="flex justify-between items-center mt-4">
                          <div className="flex items-center text-neutral-400 text-sm">
                            <MapPin size={14} className="mr-1" />
                            <span>{deal.distance ? `${deal.distance} miles away` : 'Nearby'}</span>
                          </div>
                          <button className="text-primary-400 hover:text-primary-300 flex items-center">
                            <span className="mr-1">View Deal</span>
                            <ArrowUpRight size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="bg-neutral-900/60 backdrop-blur-sm rounded-xl border border-neutral-800/50 p-8 text-center">
            <h3 className="text-xl font-semibold text-white mb-2">No Sustainable Deals Found Nearby</h3>
            <p className="text-neutral-300 mb-4 max-w-md mx-auto">
              We couldn't find any eco-friendly deals in your area. Try expanding your search radius or check back later.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-full transition-colors shadow-lg shadow-primary-500/20"
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