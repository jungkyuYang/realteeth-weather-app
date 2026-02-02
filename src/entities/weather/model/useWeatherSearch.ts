import { useSuspenseQuery } from '@tanstack/react-query';

import { type WeatherData } from './types';
import { weatherKeys } from './weatherKeys';
import { weatherApi } from '../api/weatherApi';

/**
 * 💡 핵심 로직: 상세 날씨 및 예보 통합 조회 훅
 */
export const useWeather = (lat?: number | null, lon?: number | null) => {
  const query = useSuspenseQuery<WeatherData, Error>({
    queryKey: weatherKeys.detail(lat!, lon!),
    queryFn: async () => {
      // 현재 날씨와 시간대별 예보를 병렬로 호출
      const [currentWeather, hourlyForecast] = await Promise.all([
        weatherApi.fetchByCoords(lat!, lon!),
        weatherApi.fetchForecast(lat!, lon!),
      ]);

      return {
        ...currentWeather,
        hourly: hourlyForecast,
      };
    },
    staleTime: CONSTANTS.STALE_TIME,
    gcTime: CONSTANTS.GC_TIME,
    refetchOnWindowFocus: true,
  });

  return {
    weather: query.data,
    isRefreshing: query.isFetching,
    refresh: () => query.refetch(),
  };
};

const CONSTANTS = {
  STALE_TIME: 1000 * 60 * 5, // 5분
  GC_TIME: 1000 * 60 * 30, // 30분
} as const;
