import apiClient from '@/api/client';

interface NotificationPreferences {
  [key: string]: unknown;
}

interface UserSettings {
  [key: string]: unknown;
}

interface FavoriteResponse {
  id: string | number;
  type: 'deal' | 'shop';
  [key: string]: unknown;
}

const USER_ENDPOINTS = {
  FAVORITES: '/api/v1/users/favorites/',
  PROFILE: '/api/v1/users/profile/',
  SETTINGS: '/api/v1/users/settings/'
};

class UserService {
  public async getFavorites(): Promise<FavoriteResponse[]> {
    const { data } = await apiClient.get(USER_ENDPOINTS.FAVORITES);
    return data;
  }

  public async addFavorite(type: 'deal' | 'shop', id: number | string): Promise<FavoriteResponse> {
    const { data } = await apiClient.post(USER_ENDPOINTS.FAVORITES, { type, id });
    return data;
  }

  public async removeFavorite(type: 'deal' | 'shop', id: number | string): Promise<void> {
    await apiClient.delete(`${USER_ENDPOINTS.FAVORITES}${type}/${id}/`);
  }

  public async getSettings(): Promise<UserSettings> {
    const { data } = await apiClient.get(USER_ENDPOINTS.SETTINGS);
    return data;
  }

  public async updateSettings(settings: UserSettings): Promise<UserSettings> {
    const { data } = await apiClient.patch(USER_ENDPOINTS.SETTINGS, settings);
    return data;
  }

  public async getNotificationPreferences(): Promise<NotificationPreferences> {
    const { data } = await apiClient.get(`${USER_ENDPOINTS.SETTINGS}notifications/`);
    return data;
  }

  public async updateNotificationPreferences(
    preferences: NotificationPreferences
  ): Promise<NotificationPreferences> {
    const { data } = await apiClient.patch(`${USER_ENDPOINTS.SETTINGS}notifications/`, preferences);
    return data;
  }
}

const userService = new UserService();
export default userService;
