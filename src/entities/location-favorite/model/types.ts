import { type FavoriteWrapper } from '@/shared/types/favorite';
import { type BaseLocation } from '@/shared/types/location';

export interface FavoriteLocation extends BaseLocation {
  nickname?: string;
}

export type LocationFavorite = FavoriteWrapper<FavoriteLocation>;
