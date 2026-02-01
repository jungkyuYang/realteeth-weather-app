export type WeatherStatus =
  | 'Clear'
  | 'Clouds'
  | 'Rain'
  | 'Snow'
  | 'Drizzle'
  | 'Thunderstorm'
  | 'Atmosphere'
  | (string & {});

/** *  시간대별 기온을 위한 타입 추가
 */
export interface HourlyWeather {
  dt: number; // 시간 (Unix timestamp)
  temp: number; // 해당 시간 기온
  icon: string; // 날씨 아이콘
  description: string; // 날씨 설명
}

export interface WeatherData {
  temp: number;
  tempMin: number;
  tempMax: number;
  humidity: number;
  description: string;
  status: WeatherStatus;
  icon: string;
  cityName: string;
  dt: number;
  hourly?: HourlyWeather[];
}

/**
 * API 응답 원본 타입 (OpenWeatherMap Forecast API 기준)
 * 3시간 단위의 예보 데이터를 포함하는 구조입니다.
 */
export interface WeatherForecastResponse {
  list: Array<{
    dt: number;
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
  }>;
  city: {
    name: string;
  };
}

// 기존 WeatherResponse (현재 날씨 API용)도 유지
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
