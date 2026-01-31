import { ERROR_MESSAGES } from '@/shared/constants/messages';
import { type LocationData } from '../model/types';

const TEN_SECONDS = 1000 * 10;
const ONE_MINUTE = 1000 * 60;

const GEOLOCATION_CONFIG: PositionOptions = {
  enableHighAccuracy: false,
  timeout: TEN_SECONDS,
  maximumAge: ONE_MINUTE,
};

/**
 * 좌표를 소수점 4자리로 반올림하여 정규화합니다.
 * (약 11m의 오차를 허용하여 캐시 효율을 높입니다.)
 */
export const roundCoordinate = (coord: number): number => {
  return Number(coord.toFixed(4));
};
export const locationApi = {
  fetchCurrent: (): Promise<LocationData> => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: roundCoordinate(position.coords.latitude),
            lon: roundCoordinate(position.coords.longitude),
          });
        },
        (error) => {
          const message = locationApi._getErrorMessage(error);
          reject(new Error(message));
        },
        GEOLOCATION_CONFIG,
      );
    });
  },

  /**
   * 내부용 에러 메시지 변환 함수 (Private 컨벤션)
   */
  _getErrorMessage: (error: GeolocationPositionError): string => {
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
  },
};
