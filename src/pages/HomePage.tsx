import { useState, useRef, Suspense, useTransition } from 'react';
import { useNavigate } from 'react-router';
import { ErrorBoundary } from 'react-error-boundary';
import { toast } from 'sonner';

import { useLocation } from '@/entities/location/model/useLocation';
import { HomeHeader } from '@/widgets/header/ui/HomeHeader';
import {
  CurrentWeatherCard,
  CurrentWeatherLoading,
  CurrentWeatherError,
} from '@/widgets/current-weather/ui/CurrentWeatherCard';

// 💡 Widgets 레이어에서 통합된 컴포넌트들을 불러옵니다.
import { FavoriteLocationList } from '@/widgets/favorite-location/ui/FavoriteLocationList';
import { LocationSearch, type LocationSearchHandle } from '@/widgets/search-location/ui/LocationSearch';
import { DistrictSelector } from '@/features/select-district/ui/DistrictSelector';

import { type BaseLocation } from '@/shared/types/location';
import { cn } from '@/shared/lib/utils';
import { useLockBodyScroll } from '@/shared/lib/hooks/useLockBodyScroll';

const SEOUL_COORDS = { lat: 37.5665, lon: 126.978 };

const HomePage = () => {
  const navigate = useNavigate();

  const { lat: geoLat, lon: geoLon, refresh, isError } = useLocation();
  const [selectedLocation, setSelectedLocation] = useState<BaseLocation | null>(null);
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const searchRef = useRef<LocationSearchHandle>(null);
  const [isPending, startTransition] = useTransition();

  // 현재 보고 있는 위치 좌표 결정 로직
  const targetLat = selectedLocation?.lat ?? geoLat ?? SEOUL_COORDS.lat;
  const targetLon = selectedLocation?.lon ?? geoLon ?? SEOUL_COORDS.lon;

  const handleNavigateToDetail = (lat: number, lon: number) => {
    navigate(`/detail/${lat}/${lon}`);
  };

  // 지역 선택 핸들러
  const handleSelectLocation = (loc: BaseLocation | null) => {
    startTransition(() => setSelectedLocation(loc));
    // 선택 시 최상단 날씨 카드로 스크롤 이동
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // GPS 활성화 핸들러
  const handleActivateGPS = async () => {
    startTransition(() => setSelectedLocation(null));
    const result = await refresh();
    if (result.isError || isError) {
      toast('위치 권한을 확인해 주세요', {
        description: '권한 허용이 필요합니다.',
      });
    } else {
      toast.success('현재 위치로 업데이트되었습니다.');
    }
  };

  useLockBodyScroll(isSelectorOpen);

  return (
    <div className="min-h-screen bg-background text-toss-text-main pb-20 transition-colors">
      {/* 고정 헤더 */}
      <HomeHeader
        selectedLocation={selectedLocation}
        geoCoords={{ lat: geoLat, lon: geoLon }}
        onReset={() => handleSelectLocation(null)}
        onActivateGPS={handleActivateGPS}
      />

      <main className="px-6 py-8 space-y-16 max-w-240 mx-auto">
        {/* [TOP] 지역 검색 섹션: 유저가 가장 먼저 도달하는 액션 */}
        <section className="space-y-6">
          <LocationSearch
            ref={searchRef}
            onSelect={handleSelectLocation}
            onOpenSelector={() => setIsSelectorOpen(true)}
          />
        </section>

        {/* [MIDDLE] 현재 날씨 정보 섹션: 검색 결과나 현재 위치의 상세 정보 */}
        <section
          className={cn(
            'h-192 w-full flex flex-col justify-center transition-all duration-500',
            isPending ? 'opacity-50 scale-[0.98] blur-[2px]' : 'opacity-100 scale-100 blur-0',
          )}
        >
          <ErrorBoundary
            key={`${targetLat}-${targetLon}`}
            fallbackRender={({ resetErrorBoundary }) => <CurrentWeatherError resetErrorBoundary={resetErrorBoundary} />}
          >
            <Suspense fallback={<CurrentWeatherLoading />}>
              <CurrentWeatherCard lat={targetLat} lon={targetLon} />
            </Suspense>
          </ErrorBoundary>
        </section>

        {/* [BOTTOM] 즐겨찾기 섹션: 하단에 위치하여 안정적인 리스트 제공 */}
        <section className="pt-10 border-t border-toss-grey dark:border-white/5">
          <FavoriteLocationList
            onSelect={(loc) => loc && handleNavigateToDetail(loc.lat, loc.lon)}
            currentLocation={selectedLocation}
          />
        </section>

        {/* 행정동 선택 모달 (Portal 역할) */}
        {isSelectorOpen && (
          <div
            className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
            onClick={() => setIsSelectorOpen(false)}
          >
            <div
              className="w-full max-w-180 animate-in slide-in-from-bottom-4 duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              <DistrictSelector
                onConfirm={(addr) => {
                  setIsSelectorOpen(false);
                  searchRef.current?.search(addr);
                }}
                onClose={() => setIsSelectorOpen(false)}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default HomePage;
