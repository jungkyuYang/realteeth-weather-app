import { type ReactNode } from 'react';

import { cn } from '@/shared/lib/utils';

import { type WeatherData } from '../model/types';

interface Props extends Pick<WeatherData, 'temp' | 'tempMin' | 'tempMax' | 'description'> {
  locationName: ReactNode;
  weatherIcon?: ReactNode;
  action?: ReactNode;
  onClick?: () => void;
  className?: string;
}

export const WeatherCard = ({
  locationName,
  temp,
  tempMin,
  tempMax,
  description,
  weatherIcon,
  action,
  onClick,
  className,
}: Props) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        'group relative bg-card p-[2.4rem] rounded-[2.8rem] shadow-sm border border-toss-grey',
        'hover:shadow-md hover:border-toss-blue/20 transition-all cursor-pointer',
        className,
      )}
    >
      {/* 상단 섹션 */}
      <div className="flex justify-between items-start">
        <div className="space-y-[0.8rem] flex-1 min-w-0">
          <div className="text-[2rem] font-bold text-toss-text-main leading-tight truncate">{locationName}</div>
          <div className="text-[1.5rem] text-toss-text-sub font-medium truncate">{description}</div>
        </div>

        {action && (
          <div className="ml-4 shrink-0" onClick={(e) => e.stopPropagation()}>
            {action}
          </div>
        )}
      </div>

      {/* 하단 섹션: 현재 / 최고 / 최저 온도 조합 */}
      <div className="mt-8 flex items-end justify-between">
        <div className="flex items-baseline gap-5">
          {/* 💡 현재 온도 섹션 (라벨 + 큰 숫자) */}
          <div className="flex flex-col">
            <span className="text-[1.2rem] text-toss-text-sub font-bold opacity-40 ml-1 mb-[-4px]">현재</span>
            <span className="text-[4.4rem] font-bold tracking-tighter leading-none">{temp.toFixed(1)}°</span>
          </div>

          {/* 최고/최저 기온 섹션 */}
          <div className="flex gap-3 text-[1.3rem] font-semibold mb-1 shrink-0 pb-1">
            <div className="flex items-center gap-1">
              <span className="text-toss-text-sub opacity-50 font-medium">최고</span>
              <span className="text-[#f04452]">{tempMax.toFixed(0)}°</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-toss-text-sub opacity-50 font-medium">최저</span>
              <span className="text-toss-blue">{tempMin.toFixed(0)}°</span>
            </div>
          </div>
        </div>

        {/* 날씨 아이콘 */}
        {weatherIcon && (
          <div className="bg-toss-grey/50 rounded-full p-2 group-hover:scale-110 transition-transform shadow-inner shrink-0">
            {weatherIcon}
          </div>
        )}
      </div>
    </div>
  );
};
