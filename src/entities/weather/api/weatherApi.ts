import { createBaseClient } from '@/shared/api/baseClient';
import { ERROR_MESSAGES } from '@/shared/constants/messages';
import { type WeatherData, type WeatherResponse } from '../model/types';

const weatherClient = createBaseClient({
  baseURL: import.meta.env.VITE_WEATHER_BASE_URL,
  params: {
    appid: import.meta.env.VITE_OPENWEATHER_API_KEY,
    units: 'metric',
    lang: 'kr',
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

export const fetchWeather = async (lat?: number, lon?: number): Promise<WeatherData> => {
  if (lat === undefined || lon === undefined || lat === null || lon === null) {
    throw new Error(ERROR_MESSAGES.WEATHER.INVALID_COORDS);
  }

  const { data } = await weatherClient.get<WeatherResponse>('/weather', {
    params: { lat, lon },
  });

  return mapWeatherResponse(data);
};
