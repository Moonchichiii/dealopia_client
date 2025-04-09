import React, {
  useEffect,
  useState,
  useMemo,
  useCallback,
  memo
} from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
  ZoomControl,
  AttributionControl,
  Tooltip
} from 'react-leaflet';
import { Icon, LatLngBounds, latLngBounds } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Deal } from '@/types/deals';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useFormatters } from '@/utils/formatters';
import { locationService } from '@/api/services';
import {
  MapPin,
  Leaf,
  AlertTriangle,
  Heart
} from 'lucide-react';
import { MapErrorBoundary } from '@/components/map/MapErrorBoundary';

// Marker clustering
import MarkerClusterGroup from 'react-leaflet-markercluster';
// (Optional: remove the import of old CustomIcons.tsx)

//
// ICON DEFINITIONS
//

// User location icon (modern)
const userLocationIcon = new Icon({
  iconUrl: '/markers/user-location.svg',
  iconSize: [38, 38],
  iconAnchor: [19, 38],
  popupAnchor: [0, -38]
});

// Regular deal marker icon
const dealMarkerIcon = new Icon({
  iconUrl: '/markers/deal-marker.svg',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

// Sustainable deal marker icon
const sustainableDealMarkerIcon = new Icon({
  iconUrl: '/markers/sustainable-deal-marker.svg',
  iconSize: [38, 38],
  iconAnchor: [19, 38],
  popupAnchor: [0, -38]
});

// Fallback/default icon
const defaultIcon = new Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Highlighted icon for selected deals
const highlightedIcon = new Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [35, 57],
  iconAnchor: [17, 57],
  popupAnchor: [1, -54],
  shadowSize: [41, 41],
  className: 'highlighted-marker'
});

//
// Tile Loading Tracker Component
//
const TileLoadTracker = ({ onTilesLoaded }: { onTilesLoaded: () => void }) => {
  const map = useMap();

  useEffect(() => {
    const handleTileLoad = () => onTilesLoaded();
    map.on('baselayerchange', handleTileLoad);
    map.on('load', handleTileLoad);
    if (map.getZoom()) onTilesLoaded();
    return () => {
      map.off('baselayerchange', handleTileLoad);
      map.off('load', handleTileLoad);
    };
  }, [map, onTilesLoaded]);

  return null;
};

//
// Map Updater Component
//
const MapUpdater = memo(
  ({
    center,
    bounds,
    zoom
  }: {
    center: [number, number];
    bounds?: LatLngBounds | null;
    zoom?: number;
  }) => {
    const map = useMap();
    useEffect(() => {
      if (bounds && bounds.isValid()) {
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
      } else if (center) {
        map.setView(center, zoom || map.getZoom());
      }
    }, [center, bounds, map, zoom]);
    return null;
  }
);

//
// Map Interactions Component
//
const MapInteractions = memo(
  ({
    onLocationUpdate
  }: {
    onLocationUpdate?: (coords: { latitude: number; longitude: number }) => void;
  }) => {
    useMapEvents({
      locationfound: (e) => {
        const { lat, lng } = e.latlng;
        onLocationUpdate?.({ latitude: lat, longitude: lng });
      },
      locationerror: (e) => console.error('Location error:', e)
    });
    return null;
  }
);

//
// DealMap Component
//
interface DealMapProps {
  deals: Deal[];
  height?: string;
  className?: string;
  onDealSelect?: (deal: Deal) => void;
  selectedDealId?: string | number | null;
  zoom?: number;
  showUserLocation?: boolean;
  minSustainabilityScore?: number;
}

const DealMap: React.FC<DealMapProps> = ({
  deals,
  height = '500px',
  className = '',
  onDealSelect,
  selectedDealId = null,
  zoom = 13,
  showUserLocation = true,
  minSustainabilityScore = 6.0
}) => {
  // Use the updated useGeolocation hook
  const {
    latitude,
    longitude,
    loading: locationLoading,
    error: locationError,
    addressString
  } = useGeolocation();

  const { formatCurrency, formatPercentage } = useFormatters();

  const [center, setCenter] = useState<[number, number]>([51.505, -0.09]);
  const [mapError, setMapError] = useState<string | null>(null);
  const [tilesLoaded, setTilesLoaded] = useState(false);
  const [visibleDeals, setVisibleDeals] = useState<Deal[]>([]);

  // Optional performance tracking
  const [renderStats, setRenderStats] = useState({
    markersCount: 0,
    renderTime: 0
  });

  useEffect(() => {
    if (locationError) {
      setMapError('Unable to retrieve location. Please enable location services.');
    }
  }, [locationError]);

  // Process deals: only include those with valid coordinates and meeting sustainability criteria
  const processedDeals = useMemo(() => {
    return deals.filter((deal) => {
      const lat =
        deal.location?.latitude !== undefined
          ? deal.location.latitude
          : typeof deal.latitude === 'number'
          ? deal.latitude
          : null;
      const lng =
        deal.location?.longitude !== undefined
          ? deal.location.longitude
          : typeof deal.longitude === 'number'
          ? deal.longitude
          : null;
      return lat !== null && lng !== null &&
        (!minSustainabilityScore || (deal.sustainability_score || 0) >= minSustainabilityScore);
    });
  }, [deals, minSustainabilityScore]);

  // Calculate bounds to include all markers and user location (if available)
  const bounds = useMemo(() => {
    if (!processedDeals.length) return null;
    const latLngs = processedDeals
      .map((deal) => {
        const lat =
          deal.location?.latitude !== undefined
            ? deal.location.latitude
            : typeof deal.latitude === 'number'
            ? deal.latitude
            : null;
        const lng =
          deal.location?.longitude !== undefined
            ? deal.location.longitude
            : typeof deal.longitude === 'number'
            ? deal.longitude
            : null;
        return lat !== null && lng !== null ? [lat, lng] as [number, number] : null;
      })
      .filter(Boolean) as [number, number][];
    if (latitude && longitude) {
      latLngs.push([latitude, longitude]);
    }
    return latLngs.length ? latLngBounds(latLngs) : null;
  }, [processedDeals, latitude, longitude]);

  // Update center when user location changes
  useEffect(() => {
    if (latitude && longitude) {
      setCenter([latitude, longitude]);
    }
  }, [latitude, longitude]);

  // Progressive loading of markers for larger datasets
  useEffect(() => {
    const getLocationFromDeal = (deal: Deal): [number, number] | null => {
      const lat =
        deal.location?.latitude !== undefined
          ? deal.location.latitude
          : typeof deal.latitude === 'number'
          ? deal.latitude
          : null;
      const lng =
        deal.location?.longitude !== undefined
          ? deal.location.longitude
          : typeof deal.longitude === 'number'
          ? deal.longitude
          : null;
      return lat !== null && lng !== null ? [lat, lng] : null;
    };

    if (processedDeals.length < 100) {
      setVisibleDeals(processedDeals);
      return;
    }
    if (tilesLoaded) {
      const nearbyDeals = processedDeals.filter((deal) => {
        const loc = getLocationFromDeal(deal);
        if (!loc || !latitude || !longitude) return false;
        const distance = locationService.calculateDistance(
          latitude,
          longitude,
          loc[0],
          loc[1]
        );
        return distance < 10; // within 10km
      });
      setVisibleDeals(nearbyDeals.slice(0, 20));
      const timeoutId = setTimeout(() => {
        setVisibleDeals(processedDeals);
      }, 500);
      return () => clearTimeout(timeoutId);
    } else {
      setVisibleDeals(processedDeals.slice(0, 20));
    }
  }, [processedDeals, tilesLoaded, latitude, longitude]);

  // Optional: track render performance
  useEffect(() => {
    const startTime = performance.now();
    const timeoutId = setTimeout(() => {
      const endTime = performance.now();
      setRenderStats({
        markersCount: visibleDeals.length,
        renderTime: Math.round(endTime - startTime)
      });
    }, 0);
    return () => clearTimeout(timeoutId);
  }, [visibleDeals]);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`Rendered ${renderStats.markersCount} markers in ${renderStats.renderTime}ms`);
    }
  }, [renderStats]);

  const handleMarkerClick = useCallback(
    (deal: Deal) => {
      onDealSelect && onDealSelect(deal);
    },
    [onDealSelect]
  );

  if (locationLoading) {
    return <MapLoadingPlaceholder />;
  }
  if (mapError) {
    return <MapErrorDisplay message={mapError} />;
  }

  return (
    <div className={`relative rounded-lg overflow-hidden ${className}`} style={{ height }}>
      <MapErrorBoundary>
        <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%' }} className="z-0" zoomControl={false}>
          {/* Dark tile layer */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          <ZoomControl position="bottomright" />

          {/* Map interactions */}
          <MapInteractions onLocationUpdate={(coords) => { /* Optional: update state */ }} />

          {/* Track tile loading */}
          <TileLoadTracker onTilesLoaded={() => setTilesLoaded(true)} />

          {/* Update map center and bounds */}
          <MapUpdater center={center} bounds={bounds} zoom={zoom} />

          {/* User location marker */}
          {showUserLocation && latitude && longitude && (
            <Marker position={[latitude, longitude]} icon={userLocationIcon}>
              <Popup>
                <div className="text-neutral-900">
                  <p className="font-medium">Your Location</p>
                </div>
              </Popup>
              {addressString && (
                <Tooltip permanent direction="bottom" offset={[0, 10]} className="location-tooltip">
                  {addressString}
                </Tooltip>
              )}
            </Marker>
          )}

          {/* Deal markers with clustering */}
          <MarkerClusterGroup
            chunkedLoading
            spiderfyOnMaxZoom={true}
            disableClusteringAtZoom={15}
            maxClusterRadius={50}
          >
            {visibleDeals.map((deal) => (
              // The updated DealMarker component is imported separately
              <DealMarker
                key={deal.id}
                deal={deal}
                isSelected={selectedDealId !== null && deal.id === selectedDealId}
                isSustainable={(deal.sustainability_score || 0) >= minSustainabilityScore}
                onMarkerClick={handleMarkerClick}
                formatCurrency={formatCurrency}
                formatPercentage={formatPercentage}
              />
            ))}
          </MarkerClusterGroup>

          <AttributionControl prefix="Powered by Dealopia" position="bottomright" />
        </MapContainer>
      </MapErrorBoundary>
    </div>
  );
};

export default DealMap;
