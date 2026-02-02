import { useFavorite } from '@/entities/location-favorite/model/useLocationFavorite';
import { EditNicknameButton } from '@/features/edit-favorite/ui/EditNicknameButton';
import { ToggleFavoriteButton } from '@/features/toggle-favorite/ui/ToggleFavoriteButton';
import { type BaseLocation } from '@/shared/types/location';

import { FavoriteWeatherCard } from './FavoriteWeatherCard';

interface Props {
  onSelect: (loc: BaseLocation) => void;
  currentLocation?: BaseLocation | null;
}

export const FavoriteLocationList = ({ onSelect, currentLocation }: Props) => {
  const { favorites } = useFavorite();

  if (favorites.length === 0) return null;

  return (
    <section className="space-y-8">
      <div className="flex items-center justify-between px-[0.4rem]">
        <h2 className="text-[1.8rem] font-bold">
          나의 즐겨찾기
          <span className="text-toss-blue ml-2">{favorites.length}/6</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {favorites.map((fav) => {
          const isSelected = currentLocation?.lat === fav.payload.lat && currentLocation?.lon === fav.payload.lon;

          return (
            <FavoriteWeatherCard
              key={fav.id}
              location={fav.payload}
              isSelected={isSelected}
              onClick={() => onSelect(fav.payload)}
              editAction={
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <EditNicknameButton
                    id={fav.id}
                    currentNickname={fav.payload.nickname || fav.payload.name}
                    originalName={fav.payload.name}
                  />
                </div>
              }
              deleteAction={<ToggleFavoriteButton location={fav.payload} showText={false} />}
            />
          );
        })}
      </div>
    </section>
  );
};
