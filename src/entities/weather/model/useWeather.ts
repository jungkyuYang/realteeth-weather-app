import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { weatherApi } from '../api/weatherApi';
import { weatherKeys } from './weatherKeys';
import { isValidCoords } from './validation';
import { type WeatherData } from './types';

const FIVE_MINUTES = 1000 * 60 * 5;
const THIRTY_MINUTES = 1000 * 60 * 30;

export const useWeather = (lat?: number | null, lon?: number | null) => {
  const query = useQuery<WeatherData, Error>({
    queryKey: weatherKeys.detail(lat!, lon!),
    queryFn: () => weatherApi.fetchByCoords(lat!, lon!),
    enabled: isValidCoords(lat, lon),
    placeholderData: keepPreviousData,
    staleTime: FIVE_MINUTES,
    gcTime: THIRTY_MINUTES,
    refetchOnWindowFocus: true,
  });

  return {
    weather: query.data,
    isLoading: query.isPending,
    isRefreshing: query.isFetching && !query.isPending,
    isError: query.isError,
    error: query.error ? query.error.message : null,
    refresh: () => query.refetch(),
  };
};
