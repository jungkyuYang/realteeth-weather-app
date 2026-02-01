import { useSuspenseQuery } from '@tanstack/react-query';
import { weatherApi } from '../api/weatherApi';
import { weatherKeys } from './weatherKeys';
import { type WeatherData } from './types';

const FIVE_MINUTES = 1000 * 60 * 5;
const THIRTY_MINUTES = 1000 * 60 * 30;

export const useWeather = (lat?: number | null, lon?: number | null) => {
  const query = useSuspenseQuery<WeatherData, Error>({
    queryKey: weatherKeys.detail(lat!, lon!),
    queryFn: async () => {
      const [currentWeather, hourlyForecast] = await Promise.all([
        weatherApi.fetchByCoords(lat!, lon!),
        weatherApi.fetchForecast(lat!, lon!),
      ]);
      return {
        ...currentWeather,
        hourly: hourlyForecast,
      };
    },

    staleTime: FIVE_MINUTES,
    gcTime: THIRTY_MINUTES,
    refetchOnWindowFocus: true,
  });

  return {
    weather: query.data,
    isRefreshing: query.isFetching,
    refresh: () => query.refetch(),
  };
};
