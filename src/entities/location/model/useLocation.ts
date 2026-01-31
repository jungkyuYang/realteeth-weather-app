import { useEffect } from 'react';
import { useQuery, keepPreviousData, useQueryClient } from '@tanstack/react-query'; // useQueryClient 추가
import { locationApi } from '../api/locationApi';
import { locationKeys } from './locationKeys';
import { isGeolocationSupported } from './validation';
import { type LocationData } from './types';
import { ERROR_MESSAGES } from '@/shared/constants/messages';

const FIVE_MINUTES = 1000 * 60 * 5;
const THIRTY_MINUTES = 1000 * 60 * 30;

export const useLocation = () => {
  const queryClient = useQueryClient();

  const query = useQuery<LocationData, Error>({
    queryKey: locationKeys.current(),
    queryFn: () => locationApi.fetchCurrent(),
    enabled: isGeolocationSupported(),
    placeholderData: keepPreviousData,
    staleTime: FIVE_MINUTES,
    gcTime: THIRTY_MINUTES,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: 'always',
  });

  useEffect(() => {
    let permissionStatus: PermissionStatus | null = null;

    const setupWatch = async () => {
      if (!('permissions' in navigator)) return;

      try {
        permissionStatus = await navigator.permissions.query({ name: 'geolocation' });

        permissionStatus.onchange = () => {
          if (permissionStatus?.state === 'granted' && (query.isError || !query.data)) {
            queryClient.invalidateQueries({ queryKey: locationKeys.current() });
          }
        };
      } catch (e) {
        console.warn('Geolocation permission query failed:', e);
      }
    };

    setupWatch();

    return () => {
      if (permissionStatus) permissionStatus.onchange = null;
    };
  }, [queryClient, query.isError, query.data]);

  return {
    lat: query.data?.lat ?? null,
    lon: query.data?.lon ?? null,
    isLoading: query.isPending,
    isRefreshing: query.isFetching && !query.isPending,
    isError: query.isError || !isGeolocationSupported(),
    error: !isGeolocationSupported() ? ERROR_MESSAGES.LOCATION.NOT_SUPPORTED : (query.error?.message ?? null),
    refresh: () => query.refetch(),
  };
};
