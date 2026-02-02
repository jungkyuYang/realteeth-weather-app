import { type LocationFavorite } from '../model/types';

export const STORAGE_KEY = 'weather_app_location_favorites_v1';

export const locationFavoriteApi = {
  get: async (): Promise<LocationFavorite[]> => {
    const data = localStorage.getItem(STORAGE_KEY);

    return data ? JSON.parse(data) : [];
  },

  getSync: (): LocationFavorite[] => {
    const data = localStorage.getItem(STORAGE_KEY);

    return data ? JSON.parse(data) : [];
  },

  save: async (favorites: LocationFavorite[]): Promise<void> => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  },

  remove: async (id: string): Promise<void> => {
    const favorites = await locationFavoriteApi.get();

    const filtered = favorites.filter((item) => item.id !== id);
    await locationFavoriteApi.save(filtered);
  },
};
