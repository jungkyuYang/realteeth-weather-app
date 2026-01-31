/**
 * 위경도 좌표의 유효성을 검사합니다.
 * 기상 데이터 호출 전, 불필요한 네트워크 요청을 방지하기 위한 가드로 사용됩니다.
 */
export const isValidCoords = (lat?: number | null, lon?: number | null): boolean => {
  // 1. 존재 여부 확인 (기본적인 데이터 체크)
  if (lat === undefined || lat === null || lon === undefined || lon === null) {
    return false;
  }

  // 2. 타입 확인 (런타임 안정성)
  if (typeof lat !== 'number' || typeof lon !== 'number') {
    return false;
  }

  // 3. 범위 확인 (도메인 규칙: 위도 -90~90, 경도 -180~180)
  const isLatValid = lat >= -90 && lat <= 90;
  const isLonValid = lon >= -180 && lon <= 180;

  return isLatValid && isLonValid;
};

export const sanitizeQuery = (query: string): string => {
  // 예: 한글, 영문, 숫자, 공백, 하이픈(-), 쉼표(,) 정도만 허용하고 나머지는 제거
  // (지명 검색에 필요한 최소한의 문자만 남김)
  return query.replace(/[^a-zA-Z0-9ㄱ-ㅎㅏ-ㅣ가-힣\s\-,]/g, '').trim();
};

/**
 * 최종 유효성 검사
 */
export const isValidSearchQuery = (query: string): boolean => {
  return query.length > 0;
};
