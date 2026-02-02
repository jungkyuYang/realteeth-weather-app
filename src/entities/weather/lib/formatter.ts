/**
 * OpenWeatherMap 아이콘 URL 생성
 */
export const getWeatherIconUrl = (iconCode: string, size: '2x' | '4x' | '' = '') => {
  const suffix = size ? `@${size}` : '';
  const fileName = `${iconCode}${suffix}.webp`;

  // public 폴더에 있는 파일은 루트(/) 경로로 바로 접근 가능합니다.
  // 이 방식은 Base64로 변환되지 않고 실제 정적 파일 URL을 반환합니다.
  return `/weather/${fileName}`;
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
