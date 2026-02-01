export interface BaseLocation {
  id: string; // 리스트 key 및 식별자
  name: string; // 원본 지역명
  originalName: string;
  lat: number;
  lon: number;
  country: string;
  state?: string; // 상세 주소(주/도)
}
