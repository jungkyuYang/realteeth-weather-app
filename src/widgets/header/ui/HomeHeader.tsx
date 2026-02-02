import Locate from 'lucide-react/dist/esm/icons/locate';
import LocateFixed from 'lucide-react/dist/esm/icons/locate-fixed';
import MapPin from 'lucide-react/dist/esm/icons/map-pin';
import X from 'lucide-react/dist/esm/icons/x';

import { cn } from '@/shared/lib/utils';
import { type BaseLocation } from '@/shared/types/location';

interface HomeHeaderProps {
  selectedLocation: BaseLocation | null;
  geoCoords: { lat: number | null; lon: number | null };
  onReset: () => void;
  onActivateGPS: () => void;
}

export const HomeHeader = ({ selectedLocation, geoCoords, onReset, onActivateGPS }: HomeHeaderProps) => {
  const isSearching = !!selectedLocation;
  const hasGeo = !!(geoCoords.lat && geoCoords.lon);
  const isDefault = !selectedLocation && !hasGeo;

  const locationName = selectedLocation?.name ?? (hasGeo ? CONSTANTS.TEXT.GEO_LABEL : CONSTANTS.TEXT.DEFAULT_NAME);

  return (
    <header className={CONSTANTS.STYLE.HEADER_WRAPPER}>
      {/* 왼쪽: 위치 정보 영역 */}
      <div className="flex items-center gap-2 overflow-hidden mr-4">
        <div className={cn('p-2 rounded-xl transition-colors', isSearching ? 'bg-toss-blue/10' : 'bg-toss-grey/10')}>
          <MapPin
            size={CONSTANTS.STYLE.ICON_SIZE_PIN}
            className={isSearching ? 'text-toss-blue' : 'text-toss-text-sub'}
          />
        </div>

        <div className="flex items-center gap-2 overflow-hidden">
          <h2
            className={cn(
              'text-[1.8rem] font-bold truncate transition-colors',
              isSearching ? 'text-toss-blue' : 'text-toss-text-main',
            )}
          >
            {locationName}
          </h2>

          {isDefault && (
            <span className="px-2 py-0.5 text-[1.2rem] font-semibold bg-toss-grey/20 text-toss-text-sub rounded-md shrink-0">
              {CONSTANTS.TEXT.BADGE}
            </span>
          )}

          {isSearching && (
            <button
              onClick={onReset}
              className="p-1.5 bg-toss-grey/20 rounded-full active:scale-90 transition-all hover:bg-toss-grey/30"
              aria-label="위치 초기화"
            >
              <X size={CONSTANTS.STYLE.ICON_SIZE_CLOSE} className="text-toss-text-sub" />
            </button>
          )}
        </div>
      </div>

      {/* 오른쪽: GPS 액션 버튼 */}
      <button
        onClick={onActivateGPS}
        className={cn(
          'flex items-center gap-2 px-5 py-2.5 rounded-full transition-all active:scale-95 border shadow-sm',
          hasGeo
            ? 'bg-toss-blue text-white border-toss-blue shadow-blue-200/50'
            : 'bg-background text-toss-text-sub border-toss-grey/30',
        )}
      >
        {hasGeo ? (
          <LocateFixed size={CONSTANTS.STYLE.ICON_SIZE_GPS} />
        ) : (
          <Locate size={CONSTANTS.STYLE.ICON_SIZE_GPS} />
        )}
        <span className="text-toss-btn font-bold">{CONSTANTS.TEXT.GPS_BTN}</span>
      </button>
    </header>
  );
};

const CONSTANTS = {
  TEXT: {
    DEFAULT_NAME: '서울',
    GEO_LABEL: '내 주변',
    BADGE: '기본 위치',
    GPS_BTN: '현위치',
  },
  STYLE: {
    HEADER_WRAPPER:
      'sticky top-0 z-50 bg-background/80 backdrop-blur-md px-6 h-24 flex items-center justify-between border-b border-toss-grey/10 transition-all',
    ICON_SIZE_PIN: 20,
    ICON_SIZE_CLOSE: 14,
    ICON_SIZE_GPS: 18,
  },
} as const;
