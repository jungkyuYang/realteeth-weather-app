export const ERROR_MESSAGES = {
  DEFAULT: '알 수 없는 오류가 발생했습니다.',
  UNAUTHORIZED: 'API 키가 유효하지 않습니다. 설정을 확인해주세요.',
  NOT_FOUND: '요청하신 지역 정보를 찾을 수 없습니다.',
  TOO_MANY_REQUESTS: '요청 횟수가 초과되었습니다. 잠시 후 다시 시도해주세요.',
  TIMEOUT: '네트워크 응답 시간이 초과되었습니다.',
} as const;
