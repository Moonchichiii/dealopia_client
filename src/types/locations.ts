export interface Location {
    id: number;
    address: string;
    city: string;
    state: string;
    country: string;
    postal_code: string;
    point: string;
    latitude: number;
    longitude: number;
    created_at: string;
    updated_at: string;
  }
  
  export interface LocationState {
    locations: Location[];
    nearbyLocations: Location[];
    currentLocation: Location | null;
    isLoading: boolean;
    error: string | null;
  }