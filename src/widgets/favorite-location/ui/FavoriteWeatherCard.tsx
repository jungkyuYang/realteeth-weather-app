import { type ReactNode } from 'react';
import { WeatherCard } from '@/entities/weather/ui/WeatherCard'; // 엔티티 카드 임포트
import { type BaseLocation } from '@/shared/types/location';
import { cn } from '@/shared/lib/utils';
// 각 카드별 날씨 데이터를 가져오는 훅 (이미 있다면 사용)
// import { useCurrentWeather } from '@/entities/weather/model/useCurrentWeather';

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
  // 실제로는 여기서 location.lat, location.lon으로 데이터를 가져와야 합니다.
  // 임시 데이터 (나중에 데이터 패칭 로직으로 교체)
  const weatherData = {
    temp: 24.5,
    tempMin: 21,
    tempMax: 28,
    description: '구름 조금',
  };

  return (
    <WeatherCard
      {...weatherData}
      locationName={location.nickname || location.name}
      onClick={onClick}
      // 💡 선택 상태에 따른 테두리 강조는 여기서 className으로 주입
      className={cn(isSelected && 'border-toss-blue border-2 bg-toss-blue/5 shadow-md', 'relative group')}
      // 💡 여러 액션을 하나로 묶어서 WeatherCard의 action props로 전달
      action={
        <div className="flex items-center gap-2">
          {editAction}
          {deleteAction}
        </div>
      }
      weatherIcon={<span className="text-[2.4rem]">☁️</span>}
    />
  );
};
