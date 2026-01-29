import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { fetchWeather } from '../api/weatherApi';
import { weatherKeys } from './weatherKeys';

const FIVE_MINUTE = 1000 * 60 * 5;
const THIRTY_MINUTES = 1000 * 60 * 30;

export const useWeather = (lat?: number, lon?: number) => {
  const query = useQuery({
    queryKey: weatherKeys.detail(lat, lon),
    queryFn: () => fetchWeather(lat, lon),
    enabled: lat !== undefined && lon !== undefined,
    placeholderData: keepPreviousData,
    staleTime: FIVE_MINUTE,
    gcTime: THIRTY_MINUTES,
    // 날씨 앱 특성상 사용자가 앱을 다시 켰을 때(Focus) 최신 데이터 제공
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
