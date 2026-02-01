import { Button } from '@/shared/ui/button';
import { Star } from 'lucide-react';
import { useToggleFavorite } from '../model/useToggleFavorite';
import { type BaseLocation } from '@/shared/types/location';
import { cn } from '@/shared/lib/utils';

interface Props {
  location: BaseLocation;
  className?: string;
  showText?: boolean;
}

export const ToggleFavoriteButton = ({ location, className, showText = true }: Props) => {
  const { isFavorite, toggleFavorite, isSaving } = useToggleFavorite();
  const active = isFavorite(location.lat, location.lon);

  return (
    <Button
      variant={active ? 'secondary' : 'outline'}
      size={showText ? 'sm' : 'icon-sm'}
      onClick={(e) => {
        e.stopPropagation();
        toggleFavorite(location);
      }}
      disabled={isSaving}
      className={cn(
        'transition-all font-bold shrink-0', // 버튼이 찌그러지지 않게 shrink-0 추가
        active && 'bg-favorite-bg text-favorite border-favorite/20 hover:bg-favorite-bg/80',
        !active && 'text-toss-text-sub',
        showText && 'min-w-[7.2rem]',
        className,
      )}
    >
      <Star
        className={cn(
          'size-[1.6rem] transition-transform duration-300',
          showText && 'mr-2',
          active ? 'fill-favorite text-favorite scale-110' : 'text-toss-text-sub',
        )}
      />
      {showText && <span className="text-toss-btn leading-none">{active ? '해제' : '등록'}</span>}
    </Button>
  );
};
