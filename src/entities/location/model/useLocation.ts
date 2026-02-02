import { useEffect } from 'react';

import { useQuery, keepPreviousData, useQueryClient } from '@tanstack/react-query';

import { ERROR_MESSAGES } from '@/shared/constants/constants';

import { locationKeys } from './locationKeys';
import { type LocationData } from './types';
import { isGeolocationSupported } from './validation';
import { locationApi } from '../api/locationApi';

/**
 * 💡 핵심 로직: 현재 위치 정보 관리 커스텀 훅
 */
export const useLocation = () => {
  const queryClient = useQueryClient();

  const query = useQuery<LocationData, Error>({
    queryKey: locationKeys.current(),
    queryFn: () => locationApi.fetchCurrent(),
    enabled: isGeolocationSupported(),
    placeholderData: keepPreviousData,
    staleTime: CONSTANTS.STALE_TIME,
    gcTime: CONSTANTS.GC_TIME,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: 'always',
    initialData: getInitialLocation,
  });

  // 데이터 변경 시 SessionStorage 업데이트
  useEffect(() => {
    if (query.data) {
      sessionStorage.setItem(CONSTANTS.STORAGE_KEY, JSON.stringify(query.data));
    }
  }, [query.data]);

  // 위치 권한 변경 감지 및 자동 갱신 로직
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
        console.warn(ERROR_MESSAGES.LOCATION.PERMISSION_QUERY_FAILED, e);
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

/**
 * SessionStorage에서 이전 위치 정보를 안전하게 복원
 */
function getInitialLocation(): LocationData | undefined {
  try {
    const saved = sessionStorage.getItem(CONSTANTS.STORAGE_KEY);

    return saved ? JSON.parse(saved) : undefined;
  } catch {
    return undefined;
  }
}

const CONSTANTS = {
  STALE_TIME: 1000 * 60 * 5, // 5분
  GC_TIME: 1000 * 60 * 30, // 30분
  STORAGE_KEY: 'weather_app_last_location_v1',
} as const;
