export const ERROR_MESSAGES = {
  GEOLOCATION: {
    NOT_SUPPORTED: '이 브라우저는 위치 서비스를 지원하지 않습니다.',
    PERMISSION_DENIED: '위치 권한이 거부되었습니다. 직접 장소를 검색해주세요.',
    UNAVAILABLE: '위치 정보를 사용할 수 없습니다.',
    TIMEOUT: '위치 정보 요청 시간이 초과되었습니다.',
    UNKNOWN: '위치 정보를 가져오는 데 실패했습니다.',
  },
  WEATHER: {
    FETCH_FAILED: '날씨 정보를 가져오는 데 실패했습니다.',
    NOT_FOUND: '해당 장소의 정보가 제공되지 않습니다.',
  },
} as const;
