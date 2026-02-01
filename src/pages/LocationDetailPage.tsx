import { useParams, useNavigate } from 'react-router';
import { ChevronLeft, Share2, Wind, Droplets, Thermometer, Eye } from 'lucide-react';
import { CurrentWeatherCard } from '@/widgets/current-weather/ui/CurrentWeatherCard';
import { WeatherForecastChart } from '@/widgets/weather-chart/ui/WeatherForecastChart';
import { useWeather } from '@/entities/weather/model/useWeather';

const LocationDetailPage = () => {
  const { lat, lon } = useParams<{ lat: string; lon: string }>();
  const navigate = useNavigate();

  const numLat = Number(lat);
  const numLon = Number(lon);

  const { weather } = useWeather(numLat, numLon);

  return (
    <div className="min-h-screen bg-background text-toss-text-main pb-20 transition-colors">
      {/* 1. HomePage와 통일된 느낌의 헤더 */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md px-6 h-24 flex items-center justify-between border-b border-toss-grey/10">
        <button
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 hover:bg-toss-grey/20 rounded-full transition-all active:scale-95"
        >
          <ChevronLeft size={28} />
        </button>
        <h1 className="text-[1.8rem] font-bold">{weather.cityName} 상세 날씨</h1>
        <button className="p-2 -mr-2 hover:bg-toss-grey/20 rounded-full transition-all">
          <Share2 size={22} />
        </button>
      </header>

      {/* HomePage와 동일한 max-width 및 간격(space-y-16) 적용 */}
      <main className="px-6 py-8 space-y-16 max-w-240 mx-auto">
        {/* 2. 메인 날씨 카드 섹션 (HomePage와 동일한 레이아웃) */}
        <section className="animate-in fade-in duration-500">
          <CurrentWeatherCard lat={numLat} lon={numLon} />
        </section>

        {/* 3. 시간대별 예보 차트 섹션 */}
        <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h3 className="text-[1.8rem] font-bold px-[0.4rem]">시간대별 예보</h3>
          <WeatherForecastChart lat={numLat} lon={numLon} />
        </section>

        {/* 4. 상세 지표 그리드 섹션 */}
        <section className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
          <h3 className="text-[1.8rem] font-bold px-[0.4rem]">상세 정보</h3>
          <div className="grid grid-cols-2 gap-6">
            <DetailStatCard
              icon={<Droplets className="text-blue-500" size={20} />}
              title="습도"
              value={`${weather.humidity}%`}
              desc={weather.humidity > 60 ? '조금 습해요' : '쾌적해요'}
            />
            <DetailStatCard
              icon={<Thermometer className="text-orange-500" size={20} />}
              title="기온 범위"
              value={`${Math.round(weather.tempMin)}° / ${Math.round(weather.tempMax)}°`}
              desc="오늘의 최저/최고"
            />
            <DetailStatCard
              icon={<Wind className="text-teal-500" size={20} />}
              title="날씨 상태"
              value={weather.status}
              desc={weather.description}
            />
            <DetailStatCard
              icon={<Eye className="text-purple-500" size={20} />}
              title="관측 시간"
              value={new Date(weather.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              desc="최근 업데이트"
            />
          </div>
        </section>
      </main>
    </div>
  );
};

interface DetailStatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  desc: string;
}

const DetailStatCard = ({ icon, title, value, desc }: DetailStatCardProps) => (
  // HomePage의 카드 스타일(라운딩, 패딩)과 통일
  <div className="bg-white dark:bg-white/5 p-8 rounded-[2.2rem] shadow-sm border border-toss-grey/5 transition-all">
    <div className="flex items-center gap-3 mb-6">
      <div className="p-2.5 bg-toss-grey/10 dark:bg-white/10 rounded-xl">{icon}</div>
      <p className="text-toss-btn font-medium text-toss-grey">{title}</p>
    </div>
    <p className="text-[2.2rem] font-bold mb-2">{value}</p>
    <p className="text-[1.2rem] text-toss-grey/60 font-medium leading-tight">{desc}</p>
  </div>
);

export default LocationDetailPage;
