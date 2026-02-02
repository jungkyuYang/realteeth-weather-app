import { type LocationFavorite } from '@/entities/location-favorite/model/types';
import { useFavorite } from '@/entities/location-favorite/model/useLocationFavorite';
import { toast } from '@/shared/lib/store/useToastStore';
import { type BaseLocation } from '@/shared/types/location';

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
      toast.info(CONSTANTS.MESSAGES.REMOVED);
    } else {
      if (favorites.length >= CONSTANTS.CONFIG.MAX_COUNT) {
        toast.error(CONSTANTS.MESSAGES.LIMIT_EXCEEDED(CONSTANTS.CONFIG.MAX_COUNT));

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
      toast.success(CONSTANTS.MESSAGES.ADDED);
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

export const CONSTANTS = {
  CONFIG: {
    MAX_COUNT: 6,
  },
  MESSAGES: {
    LIMIT_EXCEEDED: (max: number) => `최대 ${max}개까지만 등록 가능합니다.`,
    ADDED: '즐겨찾기에 추가되었습니다.',
    REMOVED: '즐겨찾기에서 제거되었습니다.',
  },
} as const;
