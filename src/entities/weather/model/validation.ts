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
