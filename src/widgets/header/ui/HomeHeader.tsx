import { MapPin, X, LocateFixed, Locate } from 'lucide-react';
import { type BaseLocation } from '@/shared/types/location';
import { cn } from '@/shared/lib/utils';

// FSD: 인터페이스 명칭 구체화
interface HomeHeaderProps {
  selectedLocation: BaseLocation | null;
  geoCoords: { lat: number | null; lon: number | null };
  onReset: () => void;
  onActivateGPS: () => void;
}

// 텍스트 상수는 별도로 분리하면 i18n(다국어) 대응
const LABELS = {
  DEFAULT_NAME: '서울',
  GEO_LABEL: '내 주변',
  BADGE: '기본 위치',
  GPS_BTN: '현위치',
};

export const HomeHeader = ({ selectedLocation, geoCoords, onReset, onActivateGPS }: HomeHeaderProps) => {
  const isSearching = !!selectedLocation;
  const hasGeo = !!(geoCoords.lat && geoCoords.lon);
  const isDefault = !selectedLocation && !hasGeo;

  const locationName = selectedLocation?.name ?? (hasGeo ? LABELS.GEO_LABEL : LABELS.DEFAULT_NAME);

  return (
    <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md px-6 py-4 flex items-center justify-between ">
      <div className="flex items-center gap-2 overflow-hidden">
        {/* 💡 text-toss-blue 유틸리티 활용 */}
        <MapPin className={cn('size-5 shrink-0', isSearching ? 'text-toss-blue' : 'text-toss-text-sub')} />

        <div className="flex items-center gap-2 overflow-hidden">
          <div className="flex items-center gap-1.5 overflow-hidden">
            <span
              className={cn(
                'text-toss-header font-bold truncate transition-colors',
                isSearching ? 'text-toss-blue' : 'text-toss-text-main',
              )}
            >
              {locationName}
            </span>

            {isDefault && (
              <span className="px-2 py-0.5 text-toss-badge font-medium bg-toss-grey text-toss-text-sub rounded-md shrink-0">
                {LABELS.BADGE}
              </span>
            )}
          </div>

          {isSearching && (
            <button
              onClick={onReset}
              className="p-1 bg-toss-grey rounded-full active:scale-90 transition-transform hover:bg-toss-grey/80"
              aria-label="위치 초기화"
            >
              <X className="size-3.5 text-toss-text-sub" />
            </button>
          )}
        </div>
      </div>

      <button
        onClick={onActivateGPS}
        className={cn(
          'flex items-center gap-2 px-4 py-2 rounded-full transition-all active:scale-95 border shadow-sm',
          hasGeo
            ? 'bg-blue-50 dark:bg-toss-blue/10 text-toss-blue border-toss-blue/20'
            : 'bg-background dark:bg-secondary text-toss-text-sub border-border',
        )}
      >
        {hasGeo ? <LocateFixed className="size-5" /> : <Locate className="size-5" />}
        <span className="text-toss-btn font-bold">{LABELS.GPS_BTN}</span>
      </button>
    </header>
  );
};
