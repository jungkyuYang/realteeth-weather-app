import { forwardRef, useImperativeHandle, useRef } from 'react';

import ChevronRight from 'lucide-react/dist/esm/icons/chevron-right';
import MapPin from 'lucide-react/dist/esm/icons/map-pin';
import Search from 'lucide-react/dist/esm/icons/search';

import { cn } from '@/shared/lib/utils';
import { type BaseLocation } from '@/shared/types/location';
import { Input } from '@/shared/ui/input';

import { useSearchLocation } from '../model/useSearchLocation';

const TEXTS = {
  placeholder: '지역명으로 날씨 검색',
  selectorBtn: '지역 선택',
  noResultTitle: (input: string) => `"${input}" 결과가 없어요`,
  noResultDesc: '정확한 지역명을 입력해 주세요.',
} as const;

const STYLES = {
  container: 'relative w-full max-w-240 mx-auto',
  // 💡 인풋의 라운드: 2.2rem
  input:
    'h-[6.4rem] pl-20 pr-32 text-[1.8rem] rounded-[2.2rem] border-none bg-toss-grey dark:bg-white/5 focus:ring-2 ring-toss-blue/30 transition-all shadow-sm',
  // 💡 드롭다운: 인풋과 동일한 2.2rem 라운드 + p-2 여백
  dropdown:
    'absolute top-[110%] left-0 right-0 bg-white dark:bg-[#1b212e] rounded-[2.2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] z-50 overflow-hidden border border-toss-grey/10 animate-in fade-in zoom-in-95 duration-200 p-2',
} as const;

export interface SearchLocationHandle {
  search: (value: string) => void;
}

interface SearchLocationProps {
  onSelect: (loc: BaseLocation) => void;
  onOpenSelector: () => void;
}

export const SearchLocation = forwardRef<SearchLocationHandle, SearchLocationProps>(function SearchLocation(
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
    <section className={STYLES.container}>
      <div className="relative group">
        <Search
          size={24}
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
          placeholder={TEXTS.placeholder}
          className={STYLES.input}
        />

        <button
          type="button"
          onClick={onOpenSelector}
          className="absolute right-6 top-1/2 -translate-y-1/2 text-toss-btn font-bold text-toss-blue hover:bg-toss-blue/5 px-4 py-2 rounded-xl transition-all active:scale-95"
        >
          {TEXTS.selectorBtn}
        </button>
      </div>

      {input && (
        <div className={STYLES.dropdown}>
          <div className="max-h-160 overflow-y-auto custom-scrollbar">
            {locations.length > 0 ? (
              <div className="flex flex-col gap-1">
                {locations.map((loc, idx) => (
                  <SearchResultItem
                    key={loc.id}
                    loc={loc}
                    isFocused={focusedIndex === idx}
                    onClick={() => selectLocation(loc)}
                  />
                ))}
              </div>
            ) : (
              !isSearching && <NoResultsView input={input} />
            )}
            {isSearching && <SearchLoadingSpinner />}
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
    <button
      onClick={onClick}
      className={cn(
        // 💡 아이템 라운드: 1.6rem (부모의 2.2rem과 패딩 2를 고려한 조화로운 곡률)
        'w-full flex items-center justify-between p-4 rounded-[1.6rem] text-left transition-all duration-200 group relative',
        isFocused ? 'bg-toss-blue/10 dark:bg-toss-blue/20' : 'hover:bg-toss-grey dark:hover:bg-white/5',
      )}
    >
      <div className="flex items-center gap-5 pl-2">
        <div
          className={cn(
            'size-12 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 shadow-sm',
            isFocused ? 'bg-white dark:bg-white/20 scale-105' : 'bg-toss-grey dark:bg-white/10',
          )}
        >
          <MapPin className={cn('size-6', isFocused ? 'text-toss-blue' : 'opacity-20')} />
        </div>

        <div className="flex flex-col">
          <div
            className={cn(
              'text-toss-header font-bold transition-colors',
              isFocused ? 'text-toss-blue' : 'text-toss-text-main dark:text-white',
            )}
          >
            {loc.name}
          </div>
          <div className="text-[1.2rem] font-medium opacity-40">
            {[loc.state, loc.country].filter(Boolean).join(', ')}
          </div>
        </div>
      </div>

      <ChevronRight
        className={cn('size-5 transition-all opacity-0 mr-2', isFocused && 'opacity-100 translate-x-0 text-toss-blue')}
      />
    </button>
  );
};

const NoResultsView = ({ input }: { input: string }) => (
  <div className="py-20 text-center space-y-2">
    <p className="opacity-40 text-[1.6rem] font-bold">{TEXTS.noResultTitle(input)}</p>
    <p className="opacity-20 text-[1.3rem]">{TEXTS.noResultDesc}</p>
  </div>
);

const SearchLoadingSpinner = () => (
  <div className="py-10 flex justify-center">
    <div className="size-6 border-2 border-toss-blue border-t-transparent rounded-full animate-spin" />
  </div>
);
