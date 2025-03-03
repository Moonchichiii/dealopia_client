import apiClient from '../client';
import { Location } from '@types/locations';

/**
 * Locations API service for location operations
 */
export const locationsApi = {
  /**
   * Get all locations
   */
  getLocations: async (search?: string) => {
    const { data } = await apiClient.get('/locations/', { 
      params: search ? { search } : undefined 
    });
    return data;
  },

  /**
   * Get a single location by ID
   */
  getLocation: async (id: number | string): Promise<Location> => {
    const { data } = await apiClient.get(`/locations/${id}/`);
    return data;
  },

  /**
   * Get nearby locations
   */
  getNearbyLocations: async (lat: number, lng: number, radius: number = 10) => {
    const { data } = await apiClient.get('/locations/nearby/', {
      params: { lat, lng, radius }
    });
    return data;
  },
};