import { Suspense } from 'react';

import { ErrorBoundary } from 'react-error-boundary';
import { useParams, useLocation as useRouteLocation } from 'react-router';
import { toast } from 'sonner';

/**
 * 💡 위젯 임포트
 * 각 위젯은 본체, 로딩(Loading), 에러(Error) UI를 세트로 내보냅니다.
 */
import {
  CurrentWeatherCard,
  CurrentWeatherLoading,
  CurrentWeatherError,
} from '@/widgets/current-weather/ui/CurrentWeatherCard';
import { LocationDetailHeader } from '@/widgets/header/ui/LocationDetailHeader';
import {
  WeatherForecastChart,
  WeatherForecastChartLoading,
  WeatherForecastChartError,
} from '@/widgets/weather-chart/ui/WeatherForecastChart';
import {
  WeatherDetailGrid,
  WeatherDetailGridLoading,
  WeatherDetailGridError,
} from '@/widgets/weather-detail-stats/ui/WeatherDetailGrid';

/**
 * 💡 페이지 내부 텍스트 상수
 */
const UI_TEXT = {
  DEFAULT_TITLE: '상세 날씨',
  FORECAST_SECTION: '시간대별 예보',
  DETAIL_SECTION: '상세 정보',
  SHARE_SUCCESS: '날씨 정보가 클립보드에 복사되었습니다.',
} as const;

const LocationDetailPage = () => {
  const { lat, lon } = useParams<{ lat: string; lon: string }>();

  const routeLocation = useRouteLocation();

  const numLat = Number(lat);

  const numLon = Number(lon);

  const cacheKey = `${numLat}-${numLon}`; // 좌표 변경 시 모든 Boundary 초기화용

  // URL Query에서 지역 이름 추출 (예: ?name=강남구)
  const queryParams = new URLSearchParams(routeLocation.search);

  const koreanName = queryParams.get('name');

  const displayTitle = koreanName ? `${koreanName} ${UI_TEXT.DEFAULT_TITLE}` : UI_TEXT.DEFAULT_TITLE;

  /**
   * 💡 공유하기 핸들러
   * 나중에 여기서 실제 weather 데이터를 조합해 텍스트를 만들 수 있습니다.
   */
  const handleShare = () => {
    const shareText = `[${displayTitle}]\n현재 위치의 날씨 정보를 확인해보세요!`;
    navigator.clipboard.writeText(shareText);
    toast.success(UI_TEXT.SHARE_SUCCESS);
  };

  return (
    <div className="min-h-screen bg-background text-toss-text-main pb-20">
      {/* 1. 분리된 헤더 위젯 */}
      <LocationDetailHeader title={displayTitle} onShare={handleShare} />

      <main className="px-6 py-8 space-y-16 max-w-384 mx-auto animate-in fade-in duration-500">
        {/* 2. 메인 날씨 카드 섹션 */}
        <ErrorBoundary key={`main-${cacheKey}`} fallback={<CurrentWeatherError />}>
          <Suspense fallback={<CurrentWeatherLoading />}>
            <CurrentWeatherCard lat={numLat} lon={numLon} />
          </Suspense>
        </ErrorBoundary>

        {/* 3. 차트 섹션 */}
        <section className="space-y-6">
          <h3 className="text-[1.8rem] font-bold px-1">{UI_TEXT.FORECAST_SECTION}</h3>
          <ErrorBoundary key={`chart-${cacheKey}`} fallback={<WeatherForecastChartError />}>
            <Suspense fallback={<WeatherForecastChartLoading />}>
              <WeatherForecastChart lat={numLat} lon={numLon} />
            </Suspense>
          </ErrorBoundary>
        </section>

        {/* 4. 상세 정보 그리드 섹션 */}
        <section className="space-y-6">
          <h3 className="text-[1.8rem] font-bold px-1">{UI_TEXT.DETAIL_SECTION}</h3>
          <ErrorBoundary key={`detail-${cacheKey}`} fallback={<WeatherDetailGridError />}>
            <Suspense fallback={<WeatherDetailGridLoading />}>
              <WeatherDetailGrid lat={numLat} lon={numLon} />
            </Suspense>
          </ErrorBoundary>
        </section>
      </main>
    </div>
  );
};

export default LocationDetailPage;
