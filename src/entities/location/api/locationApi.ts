import { ERROR_MESSAGES } from '@/shared/constants/messages';
import { type LocationData } from '../model/types';

const TEN_SECONDS = 1000 * 10;
const ONE_MINUTE = 1000 * 60;

const GEOLOCATION_CONFIG: PositionOptions = {
  enableHighAccuracy: false,
  timeout: TEN_SECONDS,
  maximumAge: ONE_MINUTE,
};

export const fetchCurrentLocation = (): Promise<LocationData> => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !('geolocation' in navigator)) {
      return reject(new Error(ERROR_MESSAGES.GEOLOCATION.NOT_SUPPORTED));
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      (error) => {
        let message: string;

        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = ERROR_MESSAGES.GEOLOCATION.PERMISSION_DENIED;
            break;
          case error.POSITION_UNAVAILABLE:
            message = ERROR_MESSAGES.GEOLOCATION.UNAVAILABLE;
            break;
          case error.TIMEOUT:
            message = ERROR_MESSAGES.GEOLOCATION.TIMEOUT;
            break;
          default:
            message = ERROR_MESSAGES.GEOLOCATION.UNKNOWN;
        }

        reject(new Error(message));
      },
      GEOLOCATION_CONFIG,
    );
  });
};
