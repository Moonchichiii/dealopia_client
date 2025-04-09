// src/api/services/userService.ts
import apiClient from '@/api/client';

const USER_ENDPOINTS = {
  FAVORITES: '/api/v1/users/favorites/',
  PROFILE: '/api/v1/users/profile/',
  SETTINGS: '/api/v1/users/settings/'
};

class UserService {
  public async getFavorites(): Promise<unknown> {
    const response = await apiClient.get(USER_ENDPOINTS.FAVORITES);
    return response.data;
  }

  public async addFavorite(type: 'deal' | 'shop', id: number | string): Promise<unknown> {
    const response = await apiClient.post(USER_ENDPOINTS.FAVORITES, { type, id });
    return response.data;
  }

  public async removeFavorite(type: 'deal' | 'shop', id: number | string): Promise<void> {
    await apiClient.delete(`${USER_ENDPOINTS.FAVORITES}${type}/${id}/`);
  }

  public async getSettings(): Promise<unknown> {
    const response = await apiClient.get(USER_ENDPOINTS.SETTINGS);
    return response.data;
  }

  public async updateSettings(settings: Record<string, unknown>): Promise<unknown> {
    const response = await apiClient.patch(USER_ENDPOINTS.SETTINGS, settings);
    return response.data;
  }

  public async getNotificationPreferences(): Promise<unknown> {
    const response = await apiClient.get(`${USER_ENDPOINTS.SETTINGS}notifications/`);
    return response.data;
  }

  public async updateNotificationPreferences(preferences: Record<string, unknown>): Promise<unknown> {
    const response = await apiClient.patch(`${USER_ENDPOINTS.SETTINGS}notifications/`, preferences);
    return response.data;
  }
}

const userService = new UserService();
export default userService;
