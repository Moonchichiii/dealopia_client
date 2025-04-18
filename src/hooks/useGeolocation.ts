import { useState, useEffect, useCallback, useMemo } from 'react';
import { toast } from 'react-toastify';
import  locationService  from '@/api/locations/locationService';
import { debounce } from 'lodash';

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  loading: boolean;
  error: string | null;
  timestamp: number | null;
  addressString?: string | null;
}

interface GeolocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
  autoDetect?: boolean;
  onLocationSuccess?: (coords: {latitude: number, longitude: number}) => void;
}

export interface GeolocationResult extends GeolocationState {
  getLocation: () => Promise<void>;
  clearLocation: () => void;
}

const DEFAULT_OPTIONS: GeolocationOptions = {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 0,
  autoDetect: true,
};

const LOCATION_CACHE_KEY = 'dealopia_user_location';
const PERMISSION_DENIED_KEY = 'location_permanently_denied';
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours
const OSM_RATE_LIMIT_DELAY = 1000;
const BACKOFF_MULTIPLIER = 1.5;
const MAX_RETRIES = 3;

const isValidCoordinate = (lat: number, lng: number): boolean =>
  !isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;

const fetchWithTimeout = async (url: string, options: RequestInit = {}, timeout = 5000) => {
  const controller = new AbortController();
  const { signal } = controller;
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, { ...options, signal });
    clearTimeout(timeoutId);
    return response;
  } catch (error: unknown) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timed out. Please check your internet connection.');
    }
    throw error;
  }
};

// Extend the global Window interface
declare global {
  interface Window {
    _postgisEnabled?: boolean;
  }
}

export function useGeolocation(options: GeolocationOptions = {}): GeolocationResult {
  // Memoize merged options so they don't change on every render.
  const mergedOptions = useMemo(
    () => ({ ...DEFAULT_OPTIONS, ...options }),
    [options]
  );
  const hasUserDeniedLocation = localStorage.getItem(PERMISSION_DENIED_KEY) === 'true';

  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    accuracy: null,
    loading: mergedOptions.autoDetect && !hasUserDeniedLocation,
    error: hasUserDeniedLocation ? 'Location access was previously denied' : null,
    timestamp: null,
    addressString: null,
  });

  useEffect(() => {
    if (!mergedOptions.autoDetect || hasUserDeniedLocation) return;
    const cachedLocation = localStorage.getItem(LOCATION_CACHE_KEY);
    if (cachedLocation) {
      try {
        const parsed = JSON.parse(cachedLocation);
        const { latitude, longitude, timestamp, addressString } = parsed;
        if (Date.now() - timestamp < CACHE_TTL) {
          setState(prev => ({
            ...prev,
            latitude,
            longitude,
            accuracy: parsed.accuracy || null,
            loading: false,
            timestamp,
            addressString: addressString || null,
          }));
        } else {
          setState(prev => ({ ...prev, loading: true }));
        }
      } catch {
        console.warn('Failed to parse cached location');
      }
    }
  }, [mergedOptions.autoDetect, hasUserDeniedLocation]);

  const handlePermanentDenial = useCallback(() => {
    localStorage.setItem(PERMISSION_DENIED_KEY, 'true');
    toast.error(
      'Location access is blocked. To enable nearby deals, please allow location access in your browser settings.',
      { autoClose: false, closeOnClick: false, draggable: true, toastId: 'location-denied-permanently' }
    );
  }, []);

  const showLocationToast = useCallback((city: string, country: string) => {
    toast.info(`Located near ${city}, ${country}`, {
      icon: '📍',
      toastId: 'location-toast',
      autoClose: 3000,
      position: 'bottom-right',
    });
  }, []);

  const detectLocation = useCallback(async (): Promise<GeolocationPosition> => {
    const browserLocation = (): Promise<GeolocationPosition> =>
      new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error('Geolocation is not supported by your browser.'));
          return;
        }
        navigator.geolocation.getCurrentPosition(
          resolve,
          (error) => {
            let errorMessage = 'Location detection failed';
            switch (error.code) {
              case error.PERMISSION_DENIED:
                errorMessage = 'Please allow location access to show nearby deals.';
                handlePermanentDenial();
                break;
              case error.POSITION_UNAVAILABLE:
                errorMessage = 'Location information is unavailable.';
                break;
              case error.TIMEOUT:
                errorMessage = 'Location request timed out.';
                break;
            }
            reject(new Error(errorMessage));
          },
          {
            enableHighAccuracy: mergedOptions.enableHighAccuracy,
            timeout: mergedOptions.timeout,
            maximumAge: mergedOptions.maximumAge,
          }
        );
      });

    const ipLocation = async (): Promise<GeolocationPosition> => {
      try {
        const response = await fetchWithTimeout('https://ipapi.co/json/', {}, 5000);
        if (!response.ok)
          throw new Error(`IP geolocation failed: ${response.status}`);
        const data = await response.json();
        if (!data.latitude || !data.longitude)
          throw new Error('IP geolocation returned invalid coordinates');
        return {
          coords: { latitude: data.latitude, longitude: data.longitude, accuracy: 1000 },
          timestamp: Date.now(),
        } as GeolocationPosition;
      } catch {
        throw new Error('Unable to determine your location via IP address.');
      }
    };

    try {
      return await browserLocation();
    } catch (error: unknown) {
      if (error instanceof Error && error.message.includes('allow location access')) throw error;
      try {
        return await ipLocation();
      } catch {
        throw error;
      }
    }
  }, [mergedOptions, handlePermanentDenial]);

  const retryWithBackoff = useCallback(
    async <T>(fn: () => Promise<T>, retries = MAX_RETRIES, delay = OSM_RATE_LIMIT_DELAY): Promise<T> => {
      try {
        return await fn();
      } catch (error: unknown) {
        if (retries <= 0) throw error;
        const isRateLimit = error instanceof Error && error.message.includes('429');
        const backoffDelay = isRateLimit ? delay * BACKOFF_MULTIPLIER : delay;
        await new Promise(resolve => setTimeout(resolve, backoffDelay));
        return retryWithBackoff(fn, retries - 1, backoffDelay);
      }
    },
    []
  );

  const geocodeLocation = useCallback(
    async (latitude: number, longitude: number) => {
      if (!isValidCoordinate(latitude, longitude)) {
        console.warn('Invalid coordinates for geocoding:', { latitude, longitude });
        return null;
      }
      try {
        const apiAddress = await locationService.reverseGeocode(latitude, longitude);
        if (apiAddress) return apiAddress;
        return await retryWithBackoff(async () => {
          const response = await fetchWithTimeout(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18`,
            { headers: { 'Accept-Language': navigator.language || 'en' } },
            5000
          );
          if (!response.ok) {
            if (response.status === 429)
              throw new Error('429: Rate limit exceeded for geocoding service');
            throw new Error(`Geocoding failed with status: ${response.status}`);
          }
          const data = await response.json();
          return {
            address: data.display_name,
            city: data.address.city || data.address.town || data.address.village,
            state: data.address.state,
            country: data.address.country,
          };
        });
      } catch (error: unknown) {
        console.warn('Geocoding failed:', error);
        return null;
      }
    },
    [retryWithBackoff]
  );

  const debouncedGeocode = useCallback(
    debounce(async (latitude: number, longitude: number) => {
      try {
        const addressData = await geocodeLocation(latitude, longitude);
        if (addressData) {
          setState(prev => ({ ...prev, addressString: addressData.address || null }));
          if (addressData.city && addressData.country) {
            showLocationToast(addressData.city, addressData.country);
          }
          try {
            const cachedData = localStorage.getItem(LOCATION_CACHE_KEY);
            if (cachedData) {
              const parsedData = JSON.parse(cachedData);
              localStorage.setItem(LOCATION_CACHE_KEY, JSON.stringify({ ...parsedData, addressString: addressData.address }));
            }
          } catch (e) {
            console.warn('Failed to update location cache with address');
          }
        }
      } catch (error: unknown) {
        console.error('Geocoding failed:', error);
      }
    }, 1000),
    [geocodeLocation, showLocationToast]
  );

  const getLocation = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      console.info("Detecting location for PostGIS spatial queries...");
      const position = await detectLocation();
      const { latitude, longitude, accuracy } = position.coords;

      console.info(`Location detected: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
      console.info("Coordinates will be used for PostGIS spatial queries via GeoDjango");

      setState(prev => ({
        ...prev,
        latitude,
        longitude,
        accuracy,
        loading: false,
        error: null,
        timestamp: Date.now(),
      }));

      const locationData = { latitude, longitude, accuracy, timestamp: Date.now() };
      try {
        localStorage.setItem(LOCATION_CACHE_KEY, JSON.stringify(locationData));
        localStorage.removeItem(PERMISSION_DENIED_KEY);
      } catch (storageError) {
        console.warn('Failed to cache location', storageError);
      }

      // Initialize PostGIS flag if it doesn't exist
      if (typeof window !== 'undefined') {
        window._postgisEnabled = true;
      }

      // Perform reverse geocoding
      debouncedGeocode(latitude, longitude);

      // Call the onLocationSuccess callback if provided
      if (mergedOptions.onLocationSuccess) {
        console.info("Passing coordinates to location success callback for PostGIS queries");
        mergedOptions.onLocationSuccess({ latitude, longitude });
      }

      // Dispatch a custom event that other parts of the app can listen for
      const locationEvent = new CustomEvent('dealopiaLocationAvailable', {
        detail: {
          latitude,
          longitude,
          accuracy,
          postgis: true,
          timestamp: Date.now()
        }
      });
      document.dispatchEvent(locationEvent);

      // Show a success toast that includes PostGIS mention
      toast.success("Location detected! Ready for PostGIS spatial queries", {
        icon: "📍",
        autoClose: 3000,
        position: "bottom-right",
        toastId: "postgis-location-success"
      });

      // Return type needs to match the Promise<void> signature, but we can return the data internally
      // The hook's state already reflects the update.
      // The original return type was Promise<void>, let's keep it that way for external consistency.
      // The internal logic can still use the data.
      // return { ...locationData, loading: false, error: null }; // This line caused a type error, removed.
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Location detection failed';
      setState(prev => ({ ...prev, latitude: null, longitude: null, loading: false, error: errorMessage }));
      toast.error(errorMessage, { icon: '🚨', autoClose: 7000, toastId: 'location-error' });
      throw error; // Re-throw the error so callers can handle it if needed
    }
  }, [detectLocation, debouncedGeocode, mergedOptions]);


  const clearLocation = useCallback(() => {
    localStorage.removeItem(LOCATION_CACHE_KEY);
    localStorage.removeItem(PERMISSION_DENIED_KEY);
    setState({
      latitude: null,
      longitude: null,
      accuracy: null,
      loading: false,
      error: null,
      timestamp: null,
      addressString: null,
    });
    toast.info('Location data cleared', { toastId: 'location-cleared' });
  }, []);

  useEffect(() => {
    if (mergedOptions.autoDetect && !state.latitude && !state.loading && !hasUserDeniedLocation) {
      getLocation().catch(() => {});
    }
    return () => {
      debouncedGeocode.cancel();
    };
  }, [mergedOptions.autoDetect, getLocation, state.latitude, state.loading, debouncedGeocode, hasUserDeniedLocation]);

  // Notify when location becomes available for initial auto-search
  useEffect(() => {
    // This effect seems redundant now as the notification logic is inside getLocation
    // Keeping it for now, but consider removing if it causes double notifications.
    if (state.latitude && state.longitude && !state.loading) {
      // Dispatch a custom event that our components can listen for
      // This might be dispatched again here after already being dispatched in getLocation
      const locationEvent = new CustomEvent('dealopiaLocationAvailable', {
        detail: {
            latitude: state.latitude,
            longitude: state.longitude,
            accuracy: state.accuracy, // Include accuracy if available
            postgis: true, // Assuming PostGIS is enabled if location is available
            timestamp: state.timestamp // Include timestamp
        }
      });
      document.dispatchEvent(locationEvent);

      // Call the success callback if provided
      // This might also be called again here
      if (mergedOptions.onLocationSuccess) {
        mergedOptions.onLocationSuccess({
          latitude: state.latitude,
          longitude: state.longitude
        });
      }
    }
  }, [state.latitude, state.longitude, state.loading, state.accuracy, state.timestamp, mergedOptions]);


  return { ...state, getLocation, clearLocation };
}