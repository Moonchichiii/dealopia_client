import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Deal } from '../types/deal';
import { useGeolocation } from '../hooks/useGeolocation';

// Fix for default marker icons in React Leaflet
const defaultIcon = new Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface DealMapProps {
  deals: Deal[];
  height?: string;
  className?: string;
  onDealSelect?: (deal: Deal) => void;
}

// Component to handle map center updates
const MapUpdater: React.FC<{ center: [number, number] }> = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
};

const DealMap: React.FC<DealMapProps> = ({
  deals,
  height = '400px',
  className = '',
  onDealSelect
}) => {
  const { latitude, longitude, loading } = useGeolocation();
  const [center, setCenter] = useState<[number, number]>([51.505, -0.09]); // Default to London

  useEffect(() => {
    if (latitude && longitude) {
      setCenter([latitude, longitude]);
    }
  }, [latitude, longitude]);

  if (loading) {
    return (
      <div 
        className={`bg-stone-900/50 backdrop-blur-sm rounded-2xl flex items-center justify-center ${className}`}
        style={{ height }}
      >
        <div className="animate-pulse text-stone-400">Loading map...</div>
      </div>
    );
  }

  return (
    <div className={`relative rounded-2xl overflow-hidden ${className}`} style={{ height }}>
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapUpdater center={center} />
        
        {/* User location marker */}
        {latitude && longitude && (
          <Marker 
            position={[latitude, longitude]} 
            icon={defaultIcon}
          >
            <Popup>
              <div className="text-stone-900">
                <p className="font-medium">Your Location</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Deal markers */}
        {deals.map((deal) => (
          <Marker
            key={deal.id}
            position={[deal.location.latitude, deal.location.longitude]}
            icon={defaultIcon}
            eventHandlers={{
              click: () => onDealSelect?.(deal)
            }}
          >
            <Popup>
              <div className="text-stone-900">
                <h3 className="font-medium">{deal.title}</h3>
                <p className="text-sm text-stone-600">{deal.merchant.name}</p>
                <p className="text-sm font-medium text-primary-600">
                  ${deal.price} <span className="line-through text-stone-400">${deal.originalPrice}</span>
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default DealMap;