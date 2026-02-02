import { createBaseClient } from '@/shared/api/baseClient';
import { type BaseLocation } from '@/shared/types/location';

import {
  type WeatherData,
  type WeatherResponse,
  type WeatherForecastResponse,
  type HourlyWeather,
  // 💡 여기에 SearchLocationResponse가 없다면 아래 인터페이스를 다시 살려야 합니다.
} from '../model/types';

interface SearchLocationResponse {
  name: string;
  local_names?: Record<string, string>;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

const openWeatherClient = createBaseClient({
  baseURL: import.meta.env.VITE_OPENWEATHER_BASE_URL,
  params: {
    appid: import.meta.env.VITE_OPENWEATHER_API_KEY,
  },
});

export const weatherApi = {
  fetchByCoords: async (lat: number, lon: number): Promise<WeatherData> => {
    const { data } = await openWeatherClient.get<WeatherResponse>(CONSTANTS.ENDPOINTS.WEATHER, {
      params: {
        lat,
        lon,
        ...CONSTANTS.DEFAULT_PARAMS,
      },
    });

    return mapWeatherResponse(data);
  },

  fetchForecast: async (lat: number, lon: number): Promise<HourlyWeather[]> => {
    const { data } = await openWeatherClient.get<WeatherForecastResponse>(CONSTANTS.ENDPOINTS.FORECAST, {
      params: {
        lat,
        lon,
        ...CONSTANTS.DEFAULT_PARAMS,
      },
    });

    return mapForecastResponse(data);
  },

  searchLocations: async (query: string): Promise<BaseLocation[]> => {
    const searchQuery = query.includes(CONSTANTS.CONFIG.KR_SUFFIX) ? query : `${query}${CONSTANTS.CONFIG.KR_SUFFIX}`;

    const { data } = await openWeatherClient.get<SearchLocationResponse[]>(CONSTANTS.ENDPOINTS.GEO, {
      params: {
        q: searchQuery,
      },
    });

    return mapSearchResponse(data);
  },
};

/**
 * 💡 매퍼 함수들 (하단 배치)
 */
const mapWeatherResponse = (data: WeatherResponse): WeatherData => {
  const weatherDetail = data.weather?.[0];

  return {
    temp: data.main.temp,
    tempMin: data.main.temp_min,
    tempMax: data.main.temp_max,
    humidity: data.main.humidity,
    status: weatherDetail?.main ?? 'Clear',
    description: weatherDetail?.description ?? '',
    icon: weatherDetail?.icon ?? '',
    cityName: data.name,
    dt: data.dt,
  };
};

const mapForecastResponse = (data: WeatherForecastResponse): HourlyWeather[] => {
  return data.list.map((item) => ({
    dt: item.dt,
    temp: item.main.temp,
    icon: item.weather[0].icon,
    description: item.weather[0].description,
  }));
};

const mapSearchResponse = (data: SearchLocationResponse[]): BaseLocation[] => {
  return data.map((item) => ({
    id: `${item.lat}-${item.lon}`,
    name: item.local_names?.ko || item.name,
    originalName: item.name,
    lat: item.lat,
    lon: item.lon,
    country: item.country,
    state: item.state,
  }));
};

const CONSTANTS = {
  ENDPOINTS: {
    WEATHER: '/data/2.5/weather',
    FORECAST: '/data/2.5/forecast',
    GEO: '/geo/1.0/direct',
  },
  DEFAULT_PARAMS: {
    units: 'metric',
    lang: 'kr',
  },
  CONFIG: {
    KR_SUFFIX: ',KR',
  },
} as const;
