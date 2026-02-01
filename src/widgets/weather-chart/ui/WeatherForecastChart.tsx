import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useWeather } from '@/entities/weather/model/useWeather';

interface Props {
  lat: number;
  lon: number;
}

export const WeatherForecastChart = ({ lat, lon }: Props) => {
  const { weather } = useWeather(lat, lon);

  // 💡 WeatherData 타입의 hourly 배열을 안전하게 변환
  // 데이터가 없을 경우를 대비해 빈 배열로 폴백 처리합니다.
  const chartData = (weather.hourly || []).slice(0, 8).map((item) => ({
    // Unix timestamp를 '15시' 형태로 변환
    time: new Date(item.dt * 1000).getHours() + '시',
    temp: Math.round(item.temp),
    description: item.description,
    icon: item.icon,
  }));

  if (chartData.length === 0) {
    return (
      <div className="w-full h-40 flex items-center justify-center text-toss-btn opacity-40">
        예보 데이터가 없습니다.
      </div>
    );
  }

  return (
    <div className="w-full bg-white dark:bg-white/5 rounded-[2.8rem] p-8 shadow-sm">
      <div className="flex items-center justify-between mb-8 px-2">
        <h3 className="text-[1.8rem] font-bold">시간대별 기온</h3>
        <span className="text-[1.3rem] text-toss-blue font-semibold">3시간 단위</span>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3182f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3182f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
            <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#999' }} dy={10} />
            {/* 데이터 값에 맞춰 Y축 범위 자동 조절 */}
            <YAxis hide domain={['dataMin - 3', 'dataMax + 3']} />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: '#3182f6', strokeWidth: 1.5, strokeDasharray: '4 4' }}
            />
            <Area
              type="monotone"
              dataKey="temp"
              stroke="#3182f6"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorTemp)"
              isAnimationActive={true}
              animationDuration={1000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

interface ChartDataItem {
  time: string;
  temp: number;
  description: string;
  icon: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: ChartDataItem; // 우리가 정의한 데이터 구조
  }>;
}
const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length > 0) {
    const data = payload[0].payload; // 이제 data.time 등을 안전하게 사용 가능

    return (
      <div className="bg-white dark:bg-[#2c2c2c] px-4 py-3 rounded-2xl shadow-2xl border border-black/5">
        <p className="text-[1.2rem] opacity-50 mb-1">{data.time}</p>
        <p className="text-[1.6rem] font-bold text-toss-blue">{data.temp}°</p>
        <p className="text-[1.1rem] opacity-40">{data.description}</p>
      </div>
    );
  }
  return null;
};
