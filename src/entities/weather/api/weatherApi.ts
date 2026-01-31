import { createBaseClient } from '@/shared/api/baseClient';
import {
  type WeatherData,
  type WeatherResponse,
  type SearchLocationData,
  type SearchLocationResponse,
} from '../model/types';

const ENDPOINTS = {
  WEATHER: '/data/2.5/weather',
  GEO: '/geo/1.0/direct',
} as const;

const openWeatherClient = createBaseClient({
  baseURL: import.meta.env.VITE_OPENWEATHER_BASE_URL,
  params: {
    appid: import.meta.env.VITE_OPENWEATHER_API_KEY,
  },
});

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

const mapSearchResponse = (data: SearchLocationResponse[]): SearchLocationData[] => {
  return data.map((item) => ({
    id: `${item.lat}-${item.lon}`,
    name: item.local_names?.ko || item.name, // 한국어 이름 있으면 사용, 없으면 기본 이름
    lat: item.lat,
    lon: item.lon,
    country: item.country,
    state: item.state,
  }));
};

export const weatherApi = {
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

  searchLocations: async (query: string): Promise<SearchLocationData[]> => {
    const { data } = await openWeatherClient.get<SearchLocationResponse[]>(ENDPOINTS.GEO, {
      params: {
        q: query,
      },
    });
    return mapSearchResponse(data);
  },
};
