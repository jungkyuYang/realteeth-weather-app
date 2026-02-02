/**
 * OpenWeatherMap 아이콘 URL 생성
 */
export const getWeatherIconUrl = (iconCode: string, size: '2x' | '4x' | '' = '') => {
  const suffix = size ? `@${size}` : '';
  const fileName = `${iconCode}${suffix}.webp`;

  // Vite에서 자산을 동적으로 가져오는 표준 방식입니다.
  // 이 경로는 실제 파일이 위치한 src/shared/assets/weather를 가리켜야 합니다.
  return new URL(`../../../shared/assets/weather/${fileName}`, import.meta.url).href;
};

/**
 * 시간 포맷팅 도우미 (오전/오후 표기)
 */
export const formatHour = (dt: number) => {
  const hour = new Date(dt * 1000).getHours();
  if (hour === 0) return '자정';
  if (hour === 12) return '정오';
  return hour > 12 ? `오후 ${hour - 12}시` : `오전 ${hour}시`;
};
