import { type FavoriteWrapper } from '@/shared/types/favorite';

/**
 * 장소 즐겨찾기가 필요로 하는 데이터 규격 (독립적 정의)
 */
export interface LocationFavoritePayload {
  lat: number;
  lon: number;
  name: string; // 원본 지역명
  nickname: string; // 사용자 지정 별칭
}

export type LocationFavorite = FavoriteWrapper<LocationFavoritePayload>;
