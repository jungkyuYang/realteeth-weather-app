import { forwardRef, useImperativeHandle, useRef } from 'react';

import ChevronRight from 'lucide-react/dist/esm/icons/chevron-right';
import MapPin from 'lucide-react/dist/esm/icons/map-pin';
import Search from 'lucide-react/dist/esm/icons/search';

import { useSearchLocation } from '@/features/search-location/model/useSearchLocation';
import { ToggleFavoriteButton } from '@/features/toggle-favorite/ui/ToggleFavoriteButton';
import { cn } from '@/shared/lib/utils';
import { type BaseLocation } from '@/shared/types/location';
import { Input } from '@/shared/ui/input';

export interface LocationSearchHandle {
  search: (value: string) => void;
}

interface Props {
  onSelect: (loc: BaseLocation) => void;
  onOpenSelector: () => void;
}

export const LocationSearch = forwardRef<LocationSearchHandle, Props>(function LocationSearch(
  { onSelect, onOpenSelector },
  ref,
) {
  const { input, locations, isSearching, focusedIndex, handleInputChange, handleKeyDown, selectLocation } =
    useSearchLocation(onSelect);

  const inputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    search: (value: string) => {
      handleInputChange(value);
      setTimeout(() => inputRef.current?.focus(), 0);
    },
  }));

  return (
    <section className={CONSTANTS.STYLE.CONTAINER}>
      <div className="relative group">
        <Search
          size={CONSTANTS.STYLE.ICON_SEARCH}
          className={cn(
            'absolute left-7 top-1/2 -translate-y-1/2 transition-all duration-300 z-10',
            input
              ? 'text-toss-blue scale-110'
              : 'opacity-30 group-focus-within:text-toss-blue group-focus-within:opacity-100',
          )}
        />
        <Input
          ref={inputRef}
          value={input}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={CONSTANTS.TEXT.PLACEHOLDER}
          className={CONSTANTS.STYLE.INPUT}
        />
        <button
          type="button"
          onClick={onOpenSelector}
          className="absolute right-6 top-1/2 -translate-y-1/2 text-[1.5rem] font-bold text-toss-blue hover:bg-toss-blue/5 px-4 py-2 rounded-xl transition-all active:scale-95"
        >
          {CONSTANTS.TEXT.BTN_SELECTOR}
        </button>
      </div>

      {input && (
        <div className={CONSTANTS.STYLE.DROPDOWN}>
          <div className="max-h-160 overflow-y-auto custom-scrollbar">
            {locations.length > 0 ? (
              <div className="flex flex-col gap-1">
                {locations.map((loc: BaseLocation, idx: number) => (
                  <SearchResultItem
                    key={loc.id || `${loc.lat}-${loc.lon}`}
                    loc={loc}
                    isFocused={focusedIndex === idx}
                    onClick={() => selectLocation(loc)}
                  />
                ))}
              </div>
            ) : (
              !isSearching && (
                <div className="py-20 text-center opacity-40 text-[1.6rem] font-bold px-4">
                  "{input}" {CONSTANTS.TEXT.NO_RESULT}
                </div>
              )
            )}
            {isSearching && (
              <div className="py-10 flex justify-center">
                <div className="size-6 border-2 border-toss-blue border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
});

const SearchResultItem = ({
  loc,
  isFocused,
  onClick,
}: {
  loc: BaseLocation;
  isFocused: boolean;
  onClick: () => void;
}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        'w-full flex items-center justify-between p-4 rounded-[1.6rem] transition-all duration-200 group relative cursor-pointer',
        isFocused ? 'bg-toss-blue/10 dark:bg-toss-blue/20' : 'hover:bg-toss-grey dark:hover:bg-white/5',
      )}
    >
      <div className="flex items-center gap-5 pl-2 flex-1 min-w-0">
        <div
          className={cn(
            'size-12 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 shadow-sm',
            isFocused ? 'bg-white dark:bg-white/20 scale-105' : 'bg-toss-grey dark:bg-white/10',
          )}
        >
          <MapPin className={cn('size-6', isFocused ? 'text-toss-blue' : 'opacity-20')} />
        </div>

        <div className="flex flex-col min-w-0">
          <div
            className={cn(
              'text-toss-header font-bold transition-colors truncate',
              isFocused ? 'text-toss-blue' : 'text-toss-text-main dark:text-white',
            )}
          >
            {loc.name}
          </div>
          <div className="text-[1.2rem] font-medium opacity-40 truncate">
            {[loc.state, loc.country].filter(Boolean).join(', ')}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <ToggleFavoriteButton
          location={loc}
          showText={false}
          className={cn('transition-opacity duration-200', !isFocused && 'opacity-0 group-hover:opacity-100')}
        />
        <ChevronRight
          className={cn(
            'size-5 transition-all opacity-0 mr-2',
            isFocused && 'opacity-100 translate-x-0 text-toss-blue',
          )}
        />
      </div>
    </div>
  );
};

/**
 * 💡 최하단 통합 상수 관리
 */
const CONSTANTS = {
  TEXT: {
    PLACEHOLDER: '지역명으로 날씨 검색',
    BTN_SELECTOR: '지역 선택',
    NO_RESULT: '해당 장소의 정보가 제공되지 않습니다.',
  },
  STYLE: {
    CONTAINER: 'relative w-full max-w-240 mx-auto',
    INPUT:
      'h-[6.4rem] pl-20 pr-32 text-[1.8rem] rounded-[2.2rem] border-none bg-toss-grey dark:bg-white/5 focus:ring-2 ring-toss-blue/30 transition-all shadow-sm',
    DROPDOWN:
      'absolute top-[110%] left-0 right-0 bg-white dark:bg-[#1b212e] rounded-[2.2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] z-50 overflow-hidden border border-toss-grey/10 animate-in fade-in zoom-in-95 duration-200 p-2',
    ICON_SEARCH: 24,
  },
} as const;
