import { type LocationFavorite } from '@/entities/location-favorite/model/types';
import { useFavorite } from '@/entities/location-favorite/model/useLocationFavorite';
import { toast } from '@/shared/lib/store/useToastStore';
import { type BaseLocation } from '@/shared/types/location';

import { TOGGLE_FAVORITE_CONSTANTS } from './constants';

export const useToggleFavorite = () => {
  const { favorites, save, remove, isSaving } = useFavorite();

  const isFavorite = (lat: number, lon: number) =>
    favorites.some((fav) => fav.payload.lat === lat && fav.payload.lon === lon);

  const removeFavorite = async (id: string) => {
    await remove(id);
  };

  const toggleFavorite = async (loc: BaseLocation) => {
    const existing = favorites.find(
      (fav: LocationFavorite) => fav.payload.lat === loc.lat && fav.payload.lon === loc.lon,
    );

    if (existing) {
      await remove(existing.id);
      toast.info(TOGGLE_FAVORITE_CONSTANTS.MESSAGES.REMOVED);
    } else {
      if (favorites.length >= TOGGLE_FAVORITE_CONSTANTS.CONFIG.MAX_COUNT) {
        toast.error(TOGGLE_FAVORITE_CONSTANTS.MESSAGES.LIMIT_EXCEEDED(TOGGLE_FAVORITE_CONSTANTS.CONFIG.MAX_COUNT));

        return;
      }

      const newFavorite: LocationFavorite = {
        id: `${loc.lat}-${loc.lon}`,
        order: favorites.length,
        metadata: { createdAt: Date.now(), updatedAt: Date.now(), isActive: true },
        payload: {
          ...loc,
          lat: Number(loc.lat),
          lon: Number(loc.lon),
          name: loc.name,
        },
      };

      await save([...favorites, newFavorite]);
      toast.success(TOGGLE_FAVORITE_CONSTANTS.MESSAGES.ADDED);
    }
  };

  return {
    favorites,
    isFavorite,
    toggleFavorite,
    removeFavorite,
    isSaving,
  };
};
