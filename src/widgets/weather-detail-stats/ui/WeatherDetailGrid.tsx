import Droplets from 'lucide-react/dist/esm/icons/droplets';
import Eye from 'lucide-react/dist/esm/icons/eye';
import Thermometer from 'lucide-react/dist/esm/icons/thermometer';
import Wind from 'lucide-react/dist/esm/icons/wind';
import X from 'lucide-react/dist/esm/icons/x';

import { useWeather } from '@/entities/weather/model/useWeather';
import { DetailStatCard } from '@/entities/weather/ui/DetailStatCard';
import { cn } from '@/shared/lib/utils';

interface Props {
  lat: number;
  lon: number;
  className?: string;
}

/**
 * 1. 메인 비즈니스 위젯
 */
export const WeatherDetailGrid = ({ lat, lon, className }: Props) => {
  const { weather } = useWeather(lat, lon);

  return (
    <div className={cn(CONSTANTS.STYLE.GRID_LAYOUT, className)}>
      <DetailStatCard
        icon={<Droplets className="text-blue-500" size={CONSTANTS.STYLE.ICON_SIZE} />}
        title={CONSTANTS.TEXT.HUMIDITY}
        value={`${weather.humidity}%`}
        desc={weather.humidity > 60 ? CONSTANTS.TEXT.HUMID_HIGH : CONSTANTS.TEXT.HUMID_LOW}
      />
      <DetailStatCard
        icon={<Thermometer className="text-orange-500" size={CONSTANTS.STYLE.ICON_SIZE} />}
        title={CONSTANTS.TEXT.TEMP_RANGE}
        value={`${Math.round(weather.tempMin)}° / ${Math.round(weather.tempMax)}°`}
        desc={CONSTANTS.TEXT.TEMP_DESC}
      />
      <DetailStatCard
        icon={<Wind className="text-teal-500" size={CONSTANTS.STYLE.ICON_SIZE} />}
        title={CONSTANTS.TEXT.STATUS}
        value={weather.status}
        desc={weather.description}
      />
      <DetailStatCard
        icon={<Eye className="text-purple-500" size={CONSTANTS.STYLE.ICON_SIZE} />}
        title={CONSTANTS.TEXT.OBSERVATION}
        value={new Date(weather.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        desc={CONSTANTS.TEXT.UPDATE_TIME}
      />
    </div>
  );
};

/**
 * 2. 로딩 상태
 */
export const WeatherDetailGridLoading = () => (
  <div className={CONSTANTS.STYLE.GRID_LAYOUT}>
    {Array.from({ length: CONSTANTS.CONFIG.SKELETON_COUNT }).map((_, i) => (
      <DetailStatCard.Skeleton key={i} />
    ))}
  </div>
);

/**
 * 3. 에러 상태
 */
export const WeatherDetailGridError = () => (
  <div className={CONSTANTS.STYLE.ERROR_CONTAINER}>
    <div className="p-3 bg-destructive/10 rounded-full">
      <X className="text-destructive opacity-60" size={24} />
    </div>
    <p className="text-toss-text-sub opacity-60 font-medium text-toss-btn">{CONSTANTS.TEXT.ERROR}</p>
  </div>
);

const CONSTANTS = {
  TEXT: {
    HUMIDITY: '습도',
    HUMID_HIGH: '조금 습해요',
    HUMID_LOW: '쾌적해요',
    TEMP_RANGE: '기온 범위',
    TEMP_DESC: '오늘의 최저/최고',
    STATUS: '날씨 상태',
    OBSERVATION: '관측 시간',
    UPDATE_TIME: '최근 업데이트',
    ERROR: '정보를 불러오지 못했습니다.',
  },
  CONFIG: {
    SKELETON_COUNT: 4,
  },
  STYLE: {
    GRID_LAYOUT: 'grid grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700',
    ERROR_CONTAINER:
      'h-48 bg-card rounded-[2.8rem] border border-dashed border-toss-grey/20 flex flex-col items-center justify-center gap-4',
    ICON_SIZE: 20,
  },
} as const;
