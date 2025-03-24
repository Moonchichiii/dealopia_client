import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { dealService, locationService } from '@/api/services';

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  loading: boolean;
  error: string | null;
}

interface UseGeolocationOptions {
  enableHighAccuracy?: boolean;
  maximumAge?: number;
  timeout?: number;
  automaticallyGetLocation?: boolean;
}

export function useGeolocation(options: UseGeolocationOptions = {}) {
  const {
    enableHighAccuracy = true,
    maximumAge = 30000,
    timeout = 10000,
    automaticallyGetLocation = true
  } = options;

  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    accuracy: null,
    loading: automaticallyGetLocation,
    error: null
  });

  const { data: nearbyDeals, isLoading: isLoadingDeals } = useQuery({
    queryKey: ['deals', 'nearby', state.latitude, state.longitude],
    queryFn: () => {
      if (state.latitude === null || state.longitude === null) {
        return [];
      }
      return dealService.getNearbyDeals(state.latitude, state.longitude, 10);
    },
    enabled: state.latitude !== null && state.longitude !== null,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const getLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Geolocation is not supported by your browser'
      }));
      return;
    }

    setState(prev => ({ ...prev, loading: true }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          loading: false,
          error: null
        });
      },
      (error) => {
        setState(prev => ({
          ...prev,
          loading: false,
          error: getGeolocationErrorMessage(error)
        }));
      },
      { enableHighAccuracy, maximumAge, timeout }
    );
  }, [enableHighAccuracy, maximumAge, timeout]);

  useEffect(() => {
    if (automaticallyGetLocation) {
      getLocation();
    }
  }, [automaticallyGetLocation, getLocation]);

  const { data: locationAddress, isLoading: isLoadingAddress } = useQuery({
    queryKey: ['location', 'reverse', state.latitude, state.longitude],
    queryFn: async () => {
      if (state.latitude === null || state.longitude === null) {
        return null;
      }
      try {
        const locations = await locationService.getNearbyLocations(
          state.latitude, 
          state.longitude,
          0.5 // small radius to get precise location
        );
        return locations.length > 0 ? locations[0] : null;
      } catch (error) {
        console.error('Error fetching address:', error);
        return null;
      }
    },
    enabled: state.latitude !== null && state.longitude !== null,
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  return {
    ...state,
    getLocation,
    nearbyDeals,
    isLoadingDeals,
    locationAddress,
    isLoadingAddress
  };
}

function getGeolocationErrorMessage(error: GeolocationPositionError): string {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      return 'User denied the request for geolocation.';
    case error.POSITION_UNAVAILABLE:
      return 'Location information is unavailable.';
    case error.TIMEOUT:
      return 'The request to get user location timed out.';
    default:
      return 'An unknown error occurred.';
  }
}
