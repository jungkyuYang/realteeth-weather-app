import { ERROR_MESSAGES } from '@/shared/constants/constants';

import { type LocationData } from '../model/types';

/**
 * 💡 핵심 로직: 위치 정보 API
 */
export const locationApi = {
  /**
   * 브라우저 Geolocation API를 사용하여 현재 좌표를 가져옵니다.
   */
  fetchCurrent: (): Promise<LocationData> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error(ERROR_MESSAGES.LOCATION.UNAVAILABLE));

        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: roundCoordinate(position.coords.latitude),
            lon: roundCoordinate(position.coords.longitude),
          });
        },
        (error) => {
          const message = formatLocationError(error);
          reject(new Error(message));
        },
        CONSTANTS.GEOLOCATION_CONFIG,
      );
    });
  },
};

/**
 * 💡 하단 정리: 보조 함수 및 상수
 */

/**
 * 좌표를 소수점 4자리까지 반올림 (좌표값 정규화)
 */
const roundCoordinate = (coord: number): number => {
  return Number(coord.toFixed(4));
};

/**
 * Geolocation 에러 코드를 정의된 메시지로 변환
 */
const formatLocationError = (error: GeolocationPositionError): string => {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      return ERROR_MESSAGES.LOCATION.PERMISSION_DENIED;
    case error.POSITION_UNAVAILABLE:
      return ERROR_MESSAGES.LOCATION.UNAVAILABLE;
    case error.TIMEOUT:
      return ERROR_MESSAGES.LOCATION.TIMEOUT;
    default:
      return ERROR_MESSAGES.LOCATION.UNKNOWN;
  }
};

const CONSTANTS = {
  GEOLOCATION_CONFIG: {
    enableHighAccuracy: false,
    timeout: 1000 * 10, // 10초
    maximumAge: 1000 * 60, // 1분 (캐시 활용)
  },
} as const;
