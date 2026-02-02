import RefreshCw from 'lucide-react/dist/esm/icons/refresh-cw';
import X from 'lucide-react/dist/esm/icons/x';

import { useWeather } from '@/entities/weather';
import { formatHour, getWeatherIconUrl } from '@/entities/weather/lib/formatter';
import { cn } from '@/shared/lib/utils';
import { Skeleton } from '@/shared/ui/skeleton';

export const CurrentWeatherCard = ({ lat, lon }: { lat: number; lon: number }) => {
  const { weather, isRefreshing, refresh } = useWeather(lat, lon);
  const dailyFlowData = weather.hourly?.slice(0, CONSTANTS.FORECAST_HOURS) || [];

  return (
    <section className={cn(CONSTANTS.STYLE.CARD, CONSTANTS.STYLE.HEIGHT)}>
      <button
        onClick={() => refresh()}
        className="absolute top-8 right-8 p-3 rounded-full hover:bg-toss-grey transition-all active:scale-90 z-10"
        disabled={isRefreshing}
        aria-label="날씨 정보 새로고침"
      >
        <RefreshCw
          className={cn('size-8 text-toss-grey-400', isRefreshing && 'animate-spin text-toss-blue')}
          aria-hidden="true"
        />
      </button>

      <div className="flex flex-col h-full justify-between animate-in fade-in duration-700">
        <div className="flex flex-col items-center pt-4">
          <div className="relative size-40">
            <img
              key={weather.icon}
              src={getWeatherIconUrl(weather.icon, CONSTANTS.STYLE.ICON_SIZE_MAIN)}
              className={cn(
                'w-full h-full object-contain drop-shadow-2xl transition-opacity duration-300',
                isRefreshing ? 'opacity-30' : 'opacity-100',
              )}
              alt={weather.status}
              fetchPriority="high"
              loading="eager"
            />
          </div>
          <div className="text-center">
            <h2 className="text-[7.2rem] font-extrabold leading-none tabular-nums text-toss-text-main">
              {weather.temp.toFixed(1)}°
            </h2>
            <p className="text-[2.2rem] font-bold text-toss-blue mt-2">{weather.status}</p>
            <div className="flex justify-center gap-4 mt-4 text-[1.6rem] text-toss-text-sub">
              <span>
                {CONSTANTS.TEXT.TEMP_MIN} <b className="text-toss-blue">{weather.tempMin.toFixed(0)}°</b>
              </span>
              <span className="w-px h-4 bg-border self-center" />
              <span>
                {CONSTANTS.TEXT.TEMP_MAX} <b className="text-destructive">{weather.tempMax.toFixed(0)}°</b>
              </span>
            </div>
          </div>
        </div>

        <div className="border-t border-border/60 pt-6 relative">
          <h3 className="text-toss-header font-bold mb-4 text-toss-text-main px-2">{CONSTANTS.TEXT.SECTION_TITLE}</h3>

          <div
            className="flex gap-10 overflow-x-auto pb-4 px-4 scroll-smooth"
            style={{
              WebkitMaskImage: 'linear-gradient(to right, black 85%, transparent 100%)',
              maskImage: 'linear-gradient(to right, black 85%, transparent 100%)',
            }}
          >
            {dailyFlowData.map((hour) => (
              <div key={hour.dt} className="flex flex-col items-center min-w-[5.2rem] gap-3">
                <span className="text-toss-btn text-toss-grey-400 font-medium">{formatHour(hour.dt)}</span>
                <img
                  src={getWeatherIconUrl(hour.icon, CONSTANTS.STYLE.ICON_SIZE_SUB)}
                  className="size-12"
                  alt=""
                  loading="lazy"
                  decoding="async"
                />
                <span className="text-[1.8rem] font-bold tabular-nums text-toss-text-main">
                  {hour.temp.toFixed(0)}°
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export const CurrentWeatherLoading = () => (
  <section className={cn(CONSTANTS.STYLE.CARD, CONSTANTS.STYLE.HEIGHT)}>
    <div className="flex flex-col h-full justify-between">
      <div className="flex flex-col items-center pt-4">
        <Skeleton className="size-40 rounded-full mb-6" />
        <Skeleton className="h-24 w-48 rounded-3xl mb-4" />
        <Skeleton className="h-8 w-24 rounded-xl mb-4" />
        <Skeleton className="h-6 w-40 rounded-lg" />
      </div>
      <div className="border-t border-border/50 pt-6">
        <Skeleton className="h-7 w-32 rounded-lg mb-6 ml-2" />
        <div className="flex gap-10 px-2 overflow-hidden">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex flex-col items-center min-w-[5.2rem] gap-4">
              <Skeleton className="h-4 w-10 rounded-md" />
              <Skeleton className="size-12 rounded-full" />
              <Skeleton className="h-6 w-12 rounded-md" />
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export const CurrentWeatherError = ({ resetErrorBoundary }: { resetErrorBoundary?: () => void }) => (
  <section
    className={cn(
      CONSTANTS.STYLE.CARD,
      CONSTANTS.STYLE.HEIGHT,
      'flex flex-col items-center justify-center text-center',
    )}
  >
    <div className="size-20 bg-destructive/10 rounded-full flex items-center justify-center mb-6">
      <X className="size-10 text-destructive" />
    </div>
    <p className="text-[2.2rem] font-bold text-toss-text-main mb-6">{CONSTANTS.TEXT.ERROR_TITLE}</p>
    {resetErrorBoundary && (
      <button
        onClick={resetErrorBoundary}
        className="px-8 py-3 bg-toss-grey text-toss-text-sub rounded-xl text-toss-btn font-bold hover:opacity-80 transition-colors"
      >
        {CONSTANTS.TEXT.RETRY_BTN}
      </button>
    )}
  </section>
);

const CONSTANTS = {
  FORECAST_HOURS: 8,
  STYLE: {
    HEIGHT: 'h-[48rem]',
    CARD: 'w-full max-w-2xl mx-auto rounded-[3.2rem] p-10 relative overflow-hidden shadow-toss border border-border/40 bg-card dark:bg-secondary/40 transition-colors duration-300',
    ICON_SIZE_MAIN: '4x' as const,
    ICON_SIZE_SUB: '2x' as const,
  },
  TEXT: {
    ERROR_TITLE: '데이터를 불러오지 못했습니다',
    RETRY_BTN: '다시 시도하기',
    SECTION_TITLE: '시간대별 예보',
    TEMP_MIN: '최저',
    TEMP_MAX: '최고',
  },
} as const;
