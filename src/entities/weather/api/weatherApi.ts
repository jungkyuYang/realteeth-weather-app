import { createBaseClient } from '@/shared/api/baseClient';
import { type WeatherData, type WeatherResponse } from '../model/types';

const weatherClient = createBaseClient({
  baseURL: import.meta.env.VITE_WEATHER_BASE_URL,
  params: {
    appid: import.meta.env.VITE_OPENWEATHER_API_KEY,
    units: 'metric',
    lang: 'kr',
  },
});

/**
 * 외부 API의 복잡한 구조를 앱의 순수 타입(WeatherData)으로 변환
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

export const weatherApi = {
  fetchByCoords: async (lat: number, lon: number): Promise<WeatherData> => {
    const { data } = await weatherClient.get<WeatherResponse>('/weather', {
      params: { lat, lon },
    });

    return mapWeatherResponse(data);
  },
};
