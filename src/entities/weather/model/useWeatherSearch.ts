import { useQuery, keepPreviousData } from '@tanstack/react-query';

import { ERROR_MESSAGES } from '@/shared/constants/constants';
import { type BaseLocation } from '@/shared/types/location';

import { sanitizeQuery, isValidSearchQuery } from './validation';
import { weatherKeys } from './weatherKeys';
import { weatherApi } from '../api/weatherApi';

/**
 * 💡 핵심 로직: 위치 검색 관리 커스텀 훅
 */
export const useWeatherSearch = (query: string) => {
  const sanitizedQuery = sanitizeQuery(query);
  const isEnabled = isValidSearchQuery(sanitizedQuery);

  const searchQuery = useQuery<BaseLocation[], Error>({
    queryKey: weatherKeys.search(sanitizedQuery),
    queryFn: () => weatherApi.searchLocations(sanitizedQuery),
    enabled: isEnabled,
    placeholderData: keepPreviousData,
    staleTime: CONSTANTS.STALE_TIME,
    gcTime: CONSTANTS.GC_TIME,
    refetchOnWindowFocus: false,
  });

  return {
    locations: searchQuery.data ?? [],
    isLoading: searchQuery.isPending,
    isSearching: searchQuery.isFetching && !searchQuery.isPending,
    isError: searchQuery.isError || !isEnabled,
    error: !isEnabled ? ERROR_MESSAGES.WEATHER.INVALID_QUERY : (searchQuery.error?.message ?? null),
    search: () => searchQuery.refetch(),
  };
};

/**
 * 💡 최하단 통합 상수 관리
 */
const CONSTANTS = {
  STALE_TIME: 1000 * 60 * 60 * 24, // 24시간 (하루)
  GC_TIME: 1000 * 60 * 60 * 24 * 1.5, // 36시간
} as const;
