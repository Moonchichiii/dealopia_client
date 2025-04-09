import React, { useEffect, useState } from 'react';
import { useGeolocation } from '@/hooks/useGeolocation';
import { locationService } from '@/api/services';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { userLocationIcon } from '@/components/map/DealMarker';
import Loader from '@/components/Loader';

// Optionally, define a type for a nearby location
interface NearbyLocation {
  id: string | number;
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  country: string;
}

const LocationTracker: React.FC = () => {
  const { latitude, longitude, loading, error, getLocation } = useGeolocation({ autoDetect: true });
  const [nearbyLocations, setNearbyLocations] = useState<NearbyLocation[]>([]);

  useEffect(() => {
    if (!latitude || !longitude) {
      getLocation().catch((err) => console.error('Error getting location:', err));
    }
  }, [latitude, longitude, getLocation]);

  useEffect(() => {
    if (latitude && longitude) {
      locationService.getNearbyLocations(latitude, longitude, 10)
        .then(locations => setNearbyLocations(locations))
        .catch(err => console.error('Error fetching nearby locations:', err));
    }
  }, [latitude, longitude]);

  if (loading) {
    return <Loader progress={50} />;
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <p>{error}</p>
        <button 
          onClick={getLocation} 
          className="mt-4 px-4 py-2 bg-primary-500 text-white rounded"
        >
          Try Again
        </button>
      </div>
    );
  }

  const mapCenter: [number, number] = latitude && longitude ? [latitude, longitude] : [51.505, -0.09];

  return (
    <div className="my-8">
      <h2 className="text-2xl font-bold mb-4">Your Location</h2>
      <MapContainer center={mapCenter} zoom={13} style={{ height: '400px', width: '100%' }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {latitude && longitude && (
          <Marker position={mapCenter} icon={userLocationIcon}>
            <Popup>Your current location</Popup>
          </Marker>
        )}
        {nearbyLocations.map(loc => (
          <Marker key={loc.id} position={[loc.latitude, loc.longitude]}>
            <Popup>
              <strong>{loc.address}</strong>
              <br />
              {loc.city}, {loc.country}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default LocationTracker;
