export const ERROR_MESSAGES = {
  LOCATION: {
    NOT_SUPPORTED: '이 브라우저는 위치 서비스를 지원하지 않습니다.',
    PERMISSION_DENIED: '위치 권한이 거부되었습니다. 직접 장소를 검색해주세요.',
    UNAVAILABLE: '위치 정보를 사용할 수 없습니다.',
    TIMEOUT: '위치 정보 요청 시간이 초과되었습니다.',
    UNKNOWN: '위치 정보를 가져오는 데 실패했습니다.',
    PERMISSION_QUERY_FAILED: '위치 권한 상태를 확인하는 중 오류가 발생했습니다:',
  },
  WEATHER: {
    INVALID_COORDS: '유효한 좌표 정보가 없습니다.',
    INVALID_QUERY: '2글자 이상 입력해주세요.',
  },
} as const;
