export const ERROR_MESSAGES = {
  /** API 및 네트워크 관련 (기존 config) */
  API: {
    DEFAULT: '알 수 없는 오류가 발생했습니다.',
    UNAUTHORIZED: 'API 키가 유효하지 않습니다. 설정을 확인해주세요.',
    NOT_FOUND: '요청하신 지역 정보를 찾을 수 없습니다.',
    TOO_MANY_REQUESTS: '요청 횟수가 초과되었습니다. 잠시 후 다시 시도해주세요.',
    TIMEOUT: '네트워크 응답 시간이 초과되었습니다.',
  },

  /** 브라우저 위치 정보 관련 */
  LOCATION: {
    NOT_SUPPORTED: '이 브라우저는 위치 서비스를 지원하지 않습니다.',
    PERMISSION_DENIED: '위치 권한이 거부되었습니다. 직접 장소를 검색해주세요.',
    UNAVAILABLE: '위치 정보를 사용할 수 없습니다.',
    TIMEOUT: '위치 정보 요청 시간이 초과되었습니다.',
    UNKNOWN: '위치 정보를 가져오는 데 실패했습니다.',
    PERMISSION_QUERY_FAILED: '위치 권한 상태를 확인하는 중 오류가 발생했습니다:',
  },

  /** 날씨 데이터 및 입력값 검증 관련 */
  WEATHER: {
    INVALID_COORDS: '유효한 좌표 정보가 없습니다.',
    INVALID_QUERY: '2글자 이상 입력해주세요.',
  },
} as const;
