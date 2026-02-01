import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { weatherApi } from '../api/weatherApi';
import { weatherKeys } from './weatherKeys';
import { type BaseLocation } from '@/shared/types/location';
import { sanitizeQuery, isValidSearchQuery } from './validation';
import { ERROR_MESSAGES } from '@/shared/constants/messages';

const ONE_DAY = 1000 * 60 * 60 * 24;

export const useWeatherSearch = (query: string) => {
  const sanitizedQuery = sanitizeQuery(query);
  const isEnabled = isValidSearchQuery(sanitizedQuery);

  const searchQuery = useQuery<BaseLocation[], Error>({
    queryKey: weatherKeys.search(sanitizedQuery),
    queryFn: () => weatherApi.searchLocations(sanitizedQuery),
    enabled: isEnabled,
    placeholderData: keepPreviousData,
    staleTime: ONE_DAY,
    gcTime: ONE_DAY * 1.5,
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
