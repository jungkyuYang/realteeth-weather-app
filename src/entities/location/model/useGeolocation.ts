import { useEffect } from 'react'; // 추가
import { useQuery, keepPreviousData, useQueryClient } from '@tanstack/react-query'; // useQueryClient 추가
import { fetchCurrentLocation } from '../api/locationApi';
import { locationKeys } from './locationKeys';
import { type LocationData } from './types';

const FIVE_MINUTES = 1000 * 60 * 5;
const THIRTY_MINUTES = 1000 * 60 * 30;

export const useGeolocation = () => {
  const queryClient = useQueryClient();

  const query = useQuery<LocationData, Error>({
    queryKey: locationKeys.current(),
    queryFn: fetchCurrentLocation,
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
    isLoading: query.isLoading || query.isFetching,
    error: query.error ? query.error.message : null,
    refresh: () => query.refetch(),
  };
};
