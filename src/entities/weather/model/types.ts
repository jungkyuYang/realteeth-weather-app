export type WeatherStatus =
  | 'Clear'
  | 'Clouds'
  | 'Rain'
  | 'Snow'
  | 'Drizzle'
  | 'Thunderstorm'
  | 'Atmosphere'
  | (string & {});

export interface WeatherData {
  temp: number; // 현재 온도
  tempMin: number; // 최저 온도
  tempMax: number; // 최고 온도
  humidity: number; // 습도
  description: string; // 날씨 설명 (예: '가벼운 비')
  status: WeatherStatus; // 날씨 상태 코드
  icon: string; // 날씨 아이콘 ID
  cityName: string; // 도시 이름
  dt: number; // 데이터 업데이트 시간 (Unix timestamp)
}

/**
 * API 응답 원본 타입 (OpenWeatherMap 예시)
 * API에서 주는 가공되지 않은 형태를 정의합니다.
 */
export interface WeatherResponse {
  main: {
    temp: number;
    temp_min: number;
    temp_max: number;
    humidity: number;
  };
  weather: Array<{
    main: WeatherStatus;
    description: string;
    icon: string;
  }>;
  name: string;
  dt: number;
}

export interface SearchLocationData {
  id: string; // 리스트 key값으로 활용
  name: string; // UI에 표시될 지역명
  lat: number;
  lon: number;
  country: string;
  state?: string; // 상세 주소 텍스트
}

/**
 * API 응답 원본 타입 (Geocoding API)
 * API에서 주는 가공되지 않은 형태를 정의합니다.
 */
export interface SearchLocationResponse {
  name: string;
  local_names?: Record<string, string>;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}
