import axios from 'axios';
import apiClient from '@/api/client';
import { Location } from '@/types/locations';

const CACHE_DURATIONS = {
  LOCATIONS: 24 * 60 * 60 * 1000,
  NEARBY: 15 * 60 * 1000,
  POPULAR_CITIES: 12 * 60 * 60 * 1000,
};

const handleLocationError = (error: unknown, fallback: unknown = []): unknown => {
  console.error('Location service error:', error);
  return fallback;
};

const externalApiClient = axios.create({
  timeout: 10000,
  headers: { Accept: 'application/json' },
});

const locationService = {
  getLocation: async (id: string | number): Promise<Location | null> => {
    if (!id) return null;
    try {
      return await apiClient.cachedGet<Location>(`/locations/${id}/`, {}, CACHE_DURATIONS.LOCATIONS);
    } catch (error: unknown) {
      return handleLocationError(error, null);
    }
  },

  getLocations: async (search?: string): Promise<Location[]> => {
    try {
      const params = search ? { search } : undefined;
      return await apiClient.cachedGet<Location[]>('/locations/', { params }, CACHE_DURATIONS.LOCATIONS);
    } catch (error: unknown) {
      return handleLocationError(error, []);
    }
  },

  getNearbyLocations: async (
    latitude: number,
    longitude: number,
    radius: number = 10
  ): Promise<Location[]> => {
    try {
      const safeRadius = Math.max(0.1, Math.min(radius, 50));
      return await apiClient.cachedGet<Location[]>(
        '/locations/nearby/',
        { params: { lat: latitude, lng: longitude, radius: safeRadius } },
        CACHE_DURATIONS.NEARBY
      );
    } catch (error: unknown) {
      return handleLocationError(error, []);
    }
  },

  getPopularCities: async (country?: string, limit: number = 10): Promise<unknown[]> => {
    try {
      const safeLimit = Math.min(Math.max(1, limit), 50);
      const params: Record<string, unknown> = { limit: safeLimit };
      if (country) params.country = country;
      return await apiClient.cachedGet('/locations/popular_cities/', { params }, CACHE_DURATIONS.POPULAR_CITIES);
    } catch (error: unknown) {
      return handleLocationError(error, []);
    }
  },

  getLocationStats: async (): Promise<unknown> => {
    try {
      return await apiClient.cachedGet('/locations/stats/');
    } catch (error: unknown) {
      return handleLocationError(error, {
        total_locations: 0,
        countries_count: 0,
        cities_count: 0,
        top_countries: [],
      });
    }
  },

  geocodeAddress: async (
    address: string
  ): Promise<{ latitude: number; longitude: number } | null> => {
    try {
      const response = await externalApiClient.get('https://nominatim.openstreetmap.org/search', {
        params: { q: address, format: 'json', limit: 1 },
      });
      if (response.data && response.data.length > 0) {
        const result = response.data[0];
        return { latitude: parseFloat(result.lat), longitude: parseFloat(result.lon) };
      }
      return null;
    } catch (error: unknown) {
      console.error('Geocoding error:', error);
      return null;
    }
  },

  reverseGeocode: async (
    latitude: number,
    longitude: number
  ): Promise<unknown | null> => {
    try {
      const response = await externalApiClient.get('https://nominatim.openstreetmap.org/reverse', {
        params: { lat: latitude, lon: longitude, format: 'json' },
      });
      if (response.data && response.data.address) {
        const { address } = response.data;
        return {
          address: [address.road, address.house_number].filter(Boolean).join(' '),
          city: address.city || address.town || address.village,
          state: address.state,
          country: address.country,
          postal_code: address.postcode,
        };
      }
      return null;
    } catch (error: unknown) {
      console.error('Reverse geocoding error:', error);
      return null;
    }
  },

  calculateDistance: (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  },

  formatLocation: (location: Location | null): string => {
    if (!location) return '';
    const parts = [location.city, location.state, location.country].filter(Boolean);
    return parts.join(', ');
  },
};

export default locationService;
