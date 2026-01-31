/**
 * 어떤 도메인이든 담을 수 있는 즐겨찾기 공용 래퍼
 * @template T - 즐겨찾기에 담길 실제 도메인 데이터 타입
 */
export interface FavoriteWrapper<T> {
  id: string; // 식별자
  order: number; // 정렬 순서
  metadata: {
    createdAt: number;
    updatedAt: number;
    isActive: boolean;
  };
  payload: T; // 실제 데이터 (Location, News 등)
}
