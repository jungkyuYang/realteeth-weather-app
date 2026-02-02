import { useState, useRef, Suspense, useTransition } from 'react';

import { Dialog, DialogContent } from '@radix-ui/react-dialog';
import { useOverlay } from '@toss/use-overlay';
import ChevronRight from 'lucide-react/dist/esm/icons/chevron-right';
import { ErrorBoundary } from 'react-error-boundary';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

import { useLocation } from '@/entities/location/model/useLocation';
import { DistrictSelector } from '@/features/select-district/ui/DistrictSelector';
import { cn } from '@/shared/lib/utils';
import { type BaseLocation } from '@/shared/types/location';
import {
  CurrentWeatherCard,
  CurrentWeatherLoading,
  CurrentWeatherError,
} from '@/widgets/current-weather/ui/CurrentWeatherCard';
import { FavoriteLocationList } from '@/widgets/favorite-location/ui/FavoriteLocationList';
import { HomeHeader } from '@/widgets/header/ui/HomeHeader';
import { LocationSearch, type LocationSearchHandle } from '@/widgets/search-location/ui/LocationSearch';

/**
 * 💡 1. 페이지 내부 상수 분리
 */
const SEOUL_COORDS = { lat: 37.5665, lon: 126.978 };

const UI_TEXT = {
  TITLE_CURRENT: '현재 위치 날씨',
  TITLE_SELECTED: '선택한 지역 날씨',
  LABEL_DETAIL: '자세히 보기',
  FAVORITE_SECTION: '즐겨찾는 지역',
  DEFAULT_NAME: '현재 위치',
  TOAST_GPS_ERROR: '위치 권한을 확인해 주세요',
  TOAST_GPS_DESC: '권한 허용이 필요합니다.',
  TOAST_GPS_SUCCESS: '현재 위치로 업데이트되었습니다.',
} as const;

const HomePage = () => {
  const navigate = useNavigate();

  const searchRef = useRef<LocationSearchHandle>(null);

  const [isPending, startTransition] = useTransition();

  const overlay = useOverlay();

  const { lat: geoLat, lon: geoLon, refresh, isError } = useLocation();

  const [selectedLocation, setSelectedLocation] = useState<BaseLocation | null>(null);

  const targetLat = selectedLocation?.lat ?? geoLat ?? SEOUL_COORDS.lat;

  const targetLon = selectedLocation?.lon ?? geoLon ?? SEOUL_COORDS.lon;

  const cacheKey = `${targetLat}-${targetLon}`;

  const handleNavigateToDetail = (lat: number, lon: number, name?: string) => {
    const nameParam = name ? `?name=${encodeURIComponent(name)}` : '';
    navigate(`/detail/${lat}/${lon}${nameParam}`);
  };

  const handleSelectLocation = (loc: BaseLocation | null) => {
    startTransition(() => setSelectedLocation(loc));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleActivateGPS = async () => {
    startTransition(() => setSelectedLocation(null));
    const result = await refresh();
    if (result.isError || isError) {
      toast.error(UI_TEXT.TOAST_GPS_ERROR, {
        description: UI_TEXT.TOAST_GPS_DESC,
      });
    } else {
      toast.success(UI_TEXT.TOAST_GPS_SUCCESS);
    }
  };

  const handleOpenSelector = () => {
    overlay.open(({ isOpen, close }) => (
      // 아까 작성한 Dialog 공통 컴포넌트를 활용하면 베스트입니다!
      <Dialog open={isOpen} onOpenChange={close}>
        <DialogContent className="max-w-180">
          <DistrictSelector
            onConfirm={(addr) => {
              close(); // 성공 시 오버레이 닫기
              searchRef.current?.search(addr);
            }}
            onClose={close} // 취소 시 오버레이 닫기
          />
        </DialogContent>
      </Dialog>
    ));
  };

  return (
    <div className="min-h-screen bg-background text-toss-text-main pb-20 transition-colors">
      <HomeHeader
        selectedLocation={selectedLocation}
        geoCoords={{ lat: geoLat, lon: geoLon }}
        onReset={() => handleSelectLocation(null)}
        onActivateGPS={handleActivateGPS}
      />

      <main className="px-6 py-8 space-y-16 max-w-240 mx-auto animate-in fade-in duration-500">
        {/* [TOP] 지역 검색 섹션 */}
        <section className="space-y-6">
          <LocationSearch ref={searchRef} onSelect={handleSelectLocation} onOpenSelector={handleOpenSelector} />
        </section>

        {/* [MIDDLE] 현재 날씨 정보 섹션 */}
        <section className="space-y-6">
          <div className="flex justify-between items-end px-2">
            <h3 className="text-[1.8rem] font-bold">
              {selectedLocation ? UI_TEXT.TITLE_SELECTED : UI_TEXT.TITLE_CURRENT}
            </h3>
            <button
              onClick={() =>
                handleNavigateToDetail(targetLat, targetLon, selectedLocation?.name || UI_TEXT.DEFAULT_NAME)
              }
              className="flex items-center gap-1 text-toss-blue text-toss-btn font-bold hover:opacity-70 transition-opacity"
            >
              {UI_TEXT.LABEL_DETAIL}
              <ChevronRight size={16} strokeWidth={3} />
            </button>
          </div>

          <div
            className={cn(
              'h-192 w-full flex flex-col justify-center transition-all duration-500',
              isPending ? 'opacity-50 scale-[0.98] blur-[2px]' : 'opacity-100 scale-100 blur-0',
            )}
          >
            <ErrorBoundary
              key={`home-weather-${cacheKey}`}
              fallbackRender={({ resetErrorBoundary }) => (
                <CurrentWeatherError resetErrorBoundary={resetErrorBoundary} />
              )}
            >
              <Suspense fallback={<CurrentWeatherLoading />}>
                <CurrentWeatherCard lat={targetLat} lon={targetLon} />
              </Suspense>
            </ErrorBoundary>
          </div>
        </section>

        {/* [BOTTOM] 즐겨찾기 섹션 */}
        <section className="pt-10 border-t border-toss-grey dark:border-white/5 space-y-8">
          <h3 className="text-[1.8rem] font-bold px-2">{UI_TEXT.FAVORITE_SECTION}</h3>
          <FavoriteLocationList
            onSelect={(loc) => loc && handleNavigateToDetail(loc.lat, loc.lon, loc.name)}
            currentLocation={selectedLocation}
          />
        </section>
      </main>
    </div>
  );
};

export default HomePage;
