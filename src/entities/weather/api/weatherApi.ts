import { createBaseClient } from '@/shared/api/baseClient';
import {
  type WeatherData,
  type WeatherResponse,
  type SearchLocationResponse,
  type WeatherForecastResponse,
  type HourlyWeather,
} from '../model/types';
import { type BaseLocation } from '@/shared/types/location';

const ENDPOINTS = {
  WEATHER: '/data/2.5/weather',
  FORECAST: '/data/2.5/forecast',
  GEO: '/geo/1.0/direct',
} as const;

const openWeatherClient = createBaseClient({
  baseURL: import.meta.env.VITE_OPENWEATHER_BASE_URL,
  params: {
    appid: import.meta.env.VITE_OPENWEATHER_API_KEY,
  },
});

/** * 현재 날씨 매퍼
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

/** * 💡 시간대별 예보 매퍼 추가
 */
const mapForecastResponse = (data: WeatherForecastResponse): HourlyWeather[] => {
  return data.list.map((item) => ({
    dt: item.dt,
    temp: item.main.temp,
    icon: item.weather[0].icon,
    description: item.weather[0].description,
  }));
};

/** * 위치 검색 매퍼
 */
const mapSearchResponse = (data: SearchLocationResponse[]): BaseLocation[] => {
  return data.map((item) => ({
    id: `${item.lat}-${item.lon}`,
    name: item.local_names?.ko || item.name,
    lat: item.lat,
    lon: item.lon,
    country: item.country,
    state: item.state,
  }));
};

export const weatherApi = {
  /** 현재 날씨 조회 */
  fetchByCoords: async (lat: number, lon: number): Promise<WeatherData> => {
    const { data } = await openWeatherClient.get<WeatherResponse>(ENDPOINTS.WEATHER, {
      params: {
        lat,
        lon,
        units: 'metric',
        lang: 'kr',
      },
    });
    return mapWeatherResponse(data);
  },

  /** 💡 시간대별 예보 조회 추가 */
  fetchForecast: async (lat: number, lon: number): Promise<HourlyWeather[]> => {
    const { data } = await openWeatherClient.get<WeatherForecastResponse>(ENDPOINTS.FORECAST, {
      params: {
        lat,
        lon,
        units: 'metric',
        lang: 'kr',
      },
    });
    return mapForecastResponse(data);
  },

  /** 위치 검색 */
  searchLocations: async (query: string): Promise<BaseLocation[]> => {
    const { data } = await openWeatherClient.get<SearchLocationResponse[]>(ENDPOINTS.GEO, {
      params: {
        q: query,
      },
    });
    return mapSearchResponse(data);
  },
};
