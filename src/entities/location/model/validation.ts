export const isGeolocationSupported = (): boolean => {
  return typeof window !== 'undefined' && 'geolocation' in navigator;
};
