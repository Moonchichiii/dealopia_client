// src/hooks/useGeolocation.ts
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

interface Position {
  latitude: number;
  longitude: number;
}

interface GeolocationState {
  position: Position | null;
  error: string | null;
  loading: boolean;
}

interface UseGeolocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
  onSuccess?: (position: Position) => void;
  onError?: (error: string) => void;
}

export const useGeolocation = (options: UseGeolocationOptions = {}) => {
  const [state, setState] = useState<GeolocationState>({
    position: null,
    error: null,
    loading: true,
  });

  useEffect(() => {
    const {
      enableHighAccuracy = true,
      timeout = 10000,
      maximumAge = 0,
      onSuccess,
      onError,
    } = options;

    // Check if geolocation is supported
    if (!navigator.geolocation) {
      const errorMessage = 'Geolocation is not supported by your browser';
      setState({
        position: null,
        error: errorMessage,
        loading: false,
      });
      if (onError) onError(errorMessage);
      toast.error(errorMessage);
      return;
    }

    // Success handler
    const handleSuccess = (position: GeolocationPosition) => {
      const newPosition = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };
      
      setState({
        position: newPosition,
        error: null,
        loading: false,
      });
      
      if (onSuccess) onSuccess(newPosition);
    };

    // Error handler
    const handleError = (error: GeolocationPositionError) => {
      let errorMessage: string;
      
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = 'Location access denied. Please enable location permissions.';
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = 'Location information is unavailable.';
          break;
        case error.TIMEOUT:
          errorMessage = 'The request to get your location timed out.';
          break;
        default:
          errorMessage = 'An unknown error occurred.';
      }

      setState({
        position: null,
        error: errorMessage,
        loading: false,
      });
      
      if (onError) onError(errorMessage);
      toast.warning(errorMessage);
    };

    // Get the current position
    const watchId = navigator.geolocation.watchPosition(
      handleSuccess,
      handleError,
      {
        enableHighAccuracy,
        timeout,
        maximumAge,
      }
    );

    // Clean up by clearing the watch
    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [options]);

  return state;
};