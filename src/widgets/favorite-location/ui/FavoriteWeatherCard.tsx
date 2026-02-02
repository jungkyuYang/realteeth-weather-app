import { type ReactNode } from 'react';
import { WeatherCard } from '@/entities/weather/ui/WeatherCard'; // 엔티티 카드 임포트
import { type BaseLocation } from '@/shared/types/location';
import { cn } from '@/shared/lib/utils';
import { useWeather } from '@/entities/weather/model/useWeather';
import { getWeatherIconUrl } from '@/entities/weather/lib/formatter';
interface FavoriteWeatherCardProps {
  location: BaseLocation & { nickname?: string };
  isSelected?: boolean;
  onClick: () => void;
  editAction: ReactNode;
  deleteAction: ReactNode;
}

export const FavoriteWeatherCard = ({
  location,
  isSelected,
  onClick,
  editAction,
  deleteAction,
}: FavoriteWeatherCardProps) => {
  const { weather } = useWeather(location.lat, location.lon);

  const renderLocationName = () => {
    if (location.nickname && location.nickname !== location.name) {
      return (
        <div className="flex flex-col items-start gap-2">
          {/* 수정된 별명: 메인 텍스트 컬러 */}
          <span className="text-[2rem] font-bold text-toss-text-main truncate leading-tight">{location.nickname}</span>

          {/* 💡 색감을 더한 원본 이름 라벨 */}
          <div
            className={cn(
              'px-[0.6rem] py-[0.1rem] rounded-[0.4rem] inline-flex items-center',
              'bg-toss-blue/10 border border-toss-blue/20', // 은은한 블루 배경과 테두리
            )}
          >
            <span className="text-[1.1rem] font-bold text-toss-blue opacity-80 truncate max-w-48">{location.name}</span>
          </div>
        </div>
      );
    }
    return <span className="text-[2rem] font-bold truncate">{location.name}</span>;
  };
  return (
    <WeatherCard
      temp={weather?.temp ?? 0}
      tempMin={weather?.tempMin ?? 0}
      tempMax={weather?.tempMax ?? 0}
      description={weather?.description ?? ''}
      locationName={renderLocationName()}
      onClick={onClick}
      className={cn(isSelected && 'border-toss-blue border-2 bg-toss-blue/5 shadow-md', 'relative group')}
      action={
        <div className="flex items-center gap-2">
          {editAction}
          {deleteAction}
        </div>
      }
      weatherIcon={
        weather?.icon && (
          <img
            src={getWeatherIconUrl(weather.icon, '2x')}
            alt={weather.description}
            className="w-12 h-12"
            fetchPriority="high"
            loading="eager"
          />
        )
      }
    />
  );
};
