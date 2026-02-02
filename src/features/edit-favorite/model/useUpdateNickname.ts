import { type LocationFavorite } from '@/entities/location-favorite/model/types';
import { useFavorite } from '@/entities/location-favorite/model/useLocationFavorite';
import { toast } from '@/shared/lib/store/useToastStore';

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
      toast.success(CONSTANTS.MESSAGES.SUCCESS);
    } catch {
      toast.error(CONSTANTS.MESSAGES.ERROR);
    }
  };

  return { updateNickname, isSaving };
};

const CONSTANTS = {
  MESSAGES: {
    PROMPT: '새로운 닉네임을 입력하세요.',
    SUCCESS: '닉네임이 성공적으로 변경되었습니다.',
    ERROR: '닉네임 변경 중 오류가 발생했습니다.',
    INVALID: '유효하지 않은 닉네임입니다.',
  },
  CONFIG: {
    MAX_LENGTH: 20, // 닉네임 최대 길이 제한 등 확장 고려
  },
} as const;
