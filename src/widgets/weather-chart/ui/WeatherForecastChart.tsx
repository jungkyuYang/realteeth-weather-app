import { useMemo } from 'react';

import X from 'lucide-react/dist/esm/icons/x';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

import { useWeather } from '@/entities/weather/model/useWeather';
import { cn } from '@/shared/lib/utils';

interface Props {
  lat: number;
  lon: number;
  className?: string;
}

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
    payload: ChartDataItem;
  }>;
}

/**
 * 1. 메인 차트 위젯
 */
export const WeatherForecastChart = ({ lat, lon, className }: Props) => {
  const { weather } = useWeather(lat, lon);

  const chartData = useMemo(() => {
    return (weather.hourly || []).slice(0, CONSTANTS.CHART.HOURS_TO_SHOW).map((item) => ({
      time: new Date(item.dt * 1000).getHours() + CONSTANTS.TEXT.TIME_SUFFIX,
      temp: Math.round(item.temp),
      description: item.description,
    }));
  }, [weather.hourly]);

  return (
    <div className={cn('w-full bg-card p-8 rounded-[2.8rem] shadow-sm border border-border/50', className)}>
      <div className="flex items-center justify-between mb-8 px-2">
        <h3 className="text-[1.8rem] font-bold text-toss-text-main">{CONSTANTS.TEXT.TITLE}</h3>
        <span className="text-[1.3rem] text-toss-blue font-bold px-3 py-1 bg-toss-blue/10 rounded-full">
          {CONSTANTS.TEXT.UNIT_LABEL}
        </span>
      </div>

      <div className={cn('w-full', CONSTANTS.STYLE.HEIGHT)}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id={CONSTANTS.CHART.GRADIENT_ID} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={CONSTANTS.CHART.PRIMARY_COLOR} stopOpacity={0.2} />
                <stop offset="95%" stopColor={CONSTANTS.CHART.PRIMARY_COLOR} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              vertical={false}
              stroke="currentColor"
              className="text-border"
              opacity={CONSTANTS.CHART.GRID_OPACITY}
            />
            <XAxis
              dataKey="time"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: CONSTANTS.CHART.AXIS_FONT_SIZE, fontWeight: 500 }}
              className="fill-toss-text-sub"
              dy={15}
            />
            <YAxis hide domain={['dataMin - 2', 'dataMax + 2']} />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: CONSTANTS.CHART.PRIMARY_COLOR, strokeWidth: 1, strokeDasharray: '4 4' }}
              animationDuration={200}
            />
            <Area
              type="monotone"
              dataKey="temp"
              stroke={CONSTANTS.CHART.PRIMARY_COLOR}
              strokeWidth={3}
              fill={`url(#${CONSTANTS.CHART.GRADIENT_ID})`}
              isAnimationActive={true}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

/**
 * 2. 로딩 상태
 */
export const WeatherForecastChartLoading = () => (
  <div className="w-full bg-card p-8 rounded-[2.8rem] border border-border/50 animate-pulse">
    <div className="flex justify-between mb-8 px-2">
      <div className="w-32 h-8 bg-toss-grey/10 rounded-lg" />
      <div className="w-20 h-6 bg-toss-grey/10 rounded-full" />
    </div>
    <div
      className={cn(
        'w-full bg-toss-grey/5 rounded-2xl flex items-end justify-between px-4 pb-4',
        CONSTANTS.STYLE.HEIGHT,
      )}
    >
      {[40, 60, 45, 70, 50, 80, 55, 65].map((height, i) => (
        <div key={i} className="w-[10%] bg-toss-grey/10 rounded-t-lg" style={{ height: `${height}%` }} />
      ))}
    </div>
  </div>
);

/**
 * 3. 에러 상태
 */
export const WeatherForecastChartError = () => (
  <div
    className={cn(
      'w-full bg-card p-8 rounded-[2.8rem] border border-border/50 flex flex-col items-center justify-center gap-4',
      CONSTANTS.STYLE.HEIGHT,
    )}
  >
    <div className="p-3 bg-destructive/10 rounded-full">
      <X className="text-destructive opacity-60" size={24} />
    </div>
    <p className="text-toss-text-sub opacity-60 font-medium text-toss-btn">{CONSTANTS.TEXT.ERROR}</p>
  </div>
);

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

/**
 * 💡 최하단 통합 상수 관리
 */
const CONSTANTS = {
  TEXT: {
    TITLE: '시간대별 기온',
    UNIT_LABEL: '3시간 단위',
    EMPTY_MESSAGE: '예보 데이터가 없습니다.',
    TIME_SUFFIX: '시',
    ERROR: '차트 데이터를 불러오지 못했습니다.',
  },
  CHART: {
    PRIMARY_COLOR: '#3182f6',
    GRID_OPACITY: 0.05,
    AXIS_FONT_SIZE: 12,
    GRADIENT_ID: 'colorTemp',
    HOURS_TO_SHOW: 8,
  },
  STYLE: {
    HEIGHT: 'h-64',
  },
} as const;
