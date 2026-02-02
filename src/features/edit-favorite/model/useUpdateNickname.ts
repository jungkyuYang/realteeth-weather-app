import { type LocationFavorite } from '@/entities/location-favorite/model/types';
import { useFavorite } from '@/entities/location-favorite/model/useLocationFavorite';
import { toast } from '@/shared/lib/store/useToastStore';

import { EDIT_FAVORITE_CONSTANTS } from './constants';

export const useUpdateNickname = () => {
  const { favorites, save, isSaving } = useFavorite();

  const updateNickname = async (id: string, newNickname: string) => {
    const updatedFavorites = favorites.map((fav: LocationFavorite) =>
      fav.id === id
        ? {
            ...fav,
            payload: { ...fav.payload, nickname: newNickname },
            metadata: { ...fav.metadata, updatedAt: Date.now() },
          }
        : fav,
    );

    try {
      await save(updatedFavorites);
      toast.success(EDIT_FAVORITE_CONSTANTS.MESSAGES.SUCCESS);
    } catch {
      toast.error(EDIT_FAVORITE_CONSTANTS.MESSAGES.ERROR);
    }
  };

  return { updateNickname, isSaving };
};
