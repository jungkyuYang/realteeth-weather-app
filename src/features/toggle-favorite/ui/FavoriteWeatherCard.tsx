import { useWeather } from '@/entities/weather/model/useWeather';
import { WeatherCard } from '@/entities/weather/ui/WeatherCard';
import { type BaseLocation } from '@/shared/types/location';
import { cn } from '@/shared/lib/utils';

interface Props {
  location: BaseLocation & { nickname?: string };
  onClick?: () => void;
  editAction?: React.ReactNode;
  deleteAction?: React.ReactNode;
}

export const FavoriteWeatherCard = ({ location, onClick, editAction, deleteAction }: Props) => {
  const { weather, isLoading } = useWeather(location.lat, location.lon);

  if (isLoading || !weather) {
    return <div className="h-88 bg-card animate-pulse rounded-[2.8rem] border border-toss-grey" />;
  }

  return (
    <WeatherCard
      locationName={
        /* 💡 min-h를 주어 별칭 유무와 상관없이 동일한 높이 유지 */
        <div className="flex flex-col items-start min-h-[5.8rem]">
          {/* 1층: 별칭(또는 이름) + 수정 버튼 */}
          <div className="flex items-center gap-2">
            <span className="text-[2rem] font-bold leading-tight truncate max-w-56">
              {location.nickname || location.name}
            </span>
            {editAction}
          </div>

          {/* 2층: 별칭이 있을 때만 보이지만, 없을 때도 공간은 차지함 (opacity-0) */}
          <div
            className={cn(
              'flex items-center gap-2 mt-1.5 transition-all duration-300',
              location.nickname ? 'opacity-100' : 'opacity-0 invisible',
            )}
          >
            <span className="text-[1rem] font-bold tracking-tight text-toss-blue/80 bg-toss-blue/5 px-1.5 py-0.5 rounded-md border border-toss-blue/10 shrink-0">
              원본 지명
            </span>
            <span className="text-[1.3rem] font-medium text-toss-text-sub truncate max-w-60 opacity-80">
              {location.name}
            </span>
          </div>
        </div>
      }
      temp={weather.temp}
      tempMin={weather.tempMin}
      tempMax={weather.tempMax}
      description={weather.description}
      weatherIcon={
        <img
          src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
          alt={weather.status}
          className="size-[4.8rem]"
        />
      }
      onClick={onClick}
      action={deleteAction}
    />
  );
};
