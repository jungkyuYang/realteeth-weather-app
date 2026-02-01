import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { weatherApi } from '../api/weatherApi';
import { weatherKeys } from './weatherKeys';
import { isValidCoords } from './validation';
import { type WeatherData } from './types';
import { ERROR_MESSAGES } from '@/shared/constants/messages';

const FIVE_MINUTES = 1000 * 60 * 5;
const THIRTY_MINUTES = 1000 * 60 * 30;

export const useWeather = (lat?: number | null, lon?: number | null) => {
  const query = useQuery<WeatherData, Error>({
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
    enabled: isValidCoords(lat, lon),
    placeholderData: keepPreviousData,
    staleTime: FIVE_MINUTES,
    gcTime: THIRTY_MINUTES,
    refetchOnWindowFocus: true,
  });

  return {
    weather: query.data ?? null,
    isLoading: query.isPending,
    isRefreshing: query.isFetching && !query.isPending,
    isError: query.isError || !isValidCoords(lat, lon),
    error: !isValidCoords(lat, lon) ? ERROR_MESSAGES.WEATHER.INVALID_COORDS : (query.error?.message ?? null),
    refresh: () => query.refetch(),
  };
};
