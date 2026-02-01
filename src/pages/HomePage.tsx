import { useState, useRef, Suspense, useTransition } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { toast } from 'sonner';

import { useLocation } from '@/entities/location/model/useLocation';
import { HomeHeader } from '@/widgets/header/ui/HomeHeader';
import {
  CurrentWeatherCard,
  CurrentWeatherLoading,
  CurrentWeatherError,
} from '@/widgets/current-weather/ui/CurrentWeatherCard';
import { SearchLocation, type SearchLocationHandle } from '@/features/search-location/ui/SearchLocation';
import { DistrictSelector } from '@/features/select-district/ui/DistrictSelector';

import { type BaseLocation } from '@/shared/types/location';
import { cn } from '@/shared/lib/utils';

const SEOUL_COORDS = { lat: 37.5665, lon: 126.978 };

const HomePage = () => {
  const { lat: geoLat, lon: geoLon, refresh, isError } = useLocation();

  const [selectedLocation, setSelectedLocation] = useState<BaseLocation | null>(null);
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const searchRef = useRef<SearchLocationHandle>(null);
  const [isPending, startTransition] = useTransition();

  const targetLat = selectedLocation?.lat ?? geoLat ?? SEOUL_COORDS.lat;
  const targetLon = selectedLocation?.lon ?? geoLon ?? SEOUL_COORDS.lon;

  const handleSelectLocation = (loc: BaseLocation | null) => {
    startTransition(() => setSelectedLocation(loc));
  };

  const handleDistrictConfirm = (fullAddress: string) => {
    setIsSelectorOpen(false);
    searchRef.current?.search(fullAddress);
  };

  const handleActivateGPS = async () => {
    if (selectedLocation) handleSelectLocation(null);

    // 훅의 refetch 로직 실행
    const result = await refresh();

    if (result.isError || isError) {
      toast('위치 권한을 확인해 주세요', {
        description: "주소창 왼쪽 '자물쇠' 버튼을 눌러 위치 권한을 허용할 수 있습니다.",
      });
    } else {
      toast.success('현재 위치로 날씨를 업데이트했습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-background text-toss-text-main transition-colors">
      <HomeHeader
        selectedLocation={selectedLocation}
        geoCoords={{ lat: geoLat, lon: geoLon }}
        onReset={() => handleSelectLocation(null)}
        onActivateGPS={handleActivateGPS}
      />

      <main className="px-6 py-8 space-y-10 max-w-240 mx-auto">
        <div
          className={cn(
            'h-192 w-full flex flex-col justify-center transition-all duration-300',
            isPending ? 'opacity-50 scale-[0.98]' : 'opacity-100 scale-100',
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
        </div>

        <SearchLocation
          ref={searchRef}
          onSelect={handleSelectLocation}
          onOpenSelector={() => setIsSelectorOpen(true)}
        />

        {isSelectorOpen && (
          <div className="fixed inset-0 z-100 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-180 animate-in slide-in-from-bottom-10">
              <DistrictSelector onConfirm={handleDistrictConfirm} onClose={() => setIsSelectorOpen(false)} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default HomePage;
