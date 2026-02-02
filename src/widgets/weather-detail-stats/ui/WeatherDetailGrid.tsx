import Droplets from 'lucide-react/dist/esm/icons/droplets';
import Eye from 'lucide-react/dist/esm/icons/eye';
import Thermometer from 'lucide-react/dist/esm/icons/thermometer';
import Wind from 'lucide-react/dist/esm/icons/wind';
import X from 'lucide-react/dist/esm/icons/x';

import { useWeather } from '@/entities/weather/model/useWeather';
import { DetailStatCard } from '@/entities/weather/ui/DetailStatCard';
import { cn } from '@/shared/lib/utils';

/**
 * 💡 1. 상수는 컴포넌트 외부 최상단에서 관리
 * 수정이 필요할 때 여기만 보면 되도록 몰아넣었습니다.
 */
const UI_TEXT = {
  HUMIDITY: '습도',
  TEMP_RANGE: '기온 범위',
  STATUS: '날씨 상태',
  OBSERVATION: '관측 시간',
  UPDATE_TIME: '최근 업데이트',
  ERROR: '정보를 불러오지 못했습니다.',
} as const;

const SKELETON_COUNT = 4;

interface Props {
  lat: number;
  lon: number;
  className?: string;
}

/**
 * 💡 2. 메인 비즈니스 위젯
 */
export const WeatherDetailGrid = ({ lat, lon, className }: Props) => {
  const { weather } = useWeather(lat, lon);

  return (
    <div className={cn('grid grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700', className)}>
      <DetailStatCard
        icon={<Droplets className="text-blue-500" size={20} />}
        title={UI_TEXT.HUMIDITY}
        value={`${weather.humidity}%`}
        desc={weather.humidity > 60 ? '조금 습해요' : '쾌적해요'}
      />
      <DetailStatCard
        icon={<Thermometer className="text-orange-500" size={20} />}
        title={UI_TEXT.TEMP_RANGE}
        value={`${Math.round(weather.tempMin)}° / ${Math.round(weather.tempMax)}°`}
        desc="오늘의 최저/최고"
      />
      <DetailStatCard
        icon={<Wind className="text-teal-500" size={20} />}
        title={UI_TEXT.STATUS}
        value={weather.status}
        desc={weather.description}
      />
      <DetailStatCard
        icon={<Eye className="text-purple-500" size={20} />}
        title={UI_TEXT.OBSERVATION}
        value={new Date(weather.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        desc={UI_TEXT.UPDATE_TIME}
      />
    </div>
  );
};

/**
 * 💡 3. 로딩 상태
 */
export const WeatherDetailGridLoading = () => (
  <div className="grid grid-cols-2 gap-6">
    {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
      <DetailStatCard.Skeleton key={i} />
    ))}
  </div>
);

/**
 * 💡 4. 에러 상태
 */
export const WeatherDetailGridError = () => (
  <div className="h-48 bg-card rounded-[2.8rem] border border-dashed border-toss-grey/20 flex flex-col items-center justify-center gap-4">
    <div className="p-3 bg-destructive/10 rounded-full">
      <X className="text-destructive opacity-60" size={24} />
    </div>
    <p className="text-toss-text-sub opacity-60 font-medium text-toss-btn">{UI_TEXT.ERROR}</p>
  </div>
);
