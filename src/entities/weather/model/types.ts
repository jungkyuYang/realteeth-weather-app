/**
 * 날씨 상태(비, 눈, 맑음 등)를 나타내는 타입
 */
export type WeatherStatus =
  | 'Clear'
  | 'Clouds'
  | 'Rain'
  | 'Snow'
  | 'Drizzle'
  | 'Thunderstorm'
  | 'Atmosphere'
  | (string & {});

/**
 * 우리 앱에서 실제로 사용할 정제된 날씨 데이터 인터페이스
 */
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
