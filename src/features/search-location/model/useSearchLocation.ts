import { useState, useCallback, useMemo } from 'react';
import { useWeatherSearch } from '@/entities/weather/model/useWeatherSearch';
import { type BaseLocation } from '@/shared/types/location';
import { useDebounce } from '@/shared/lib/hooks/useDebounce';

export const useSearchLocation = (onSelect: (loc: BaseLocation) => void) => {
  const [input, setInput] = useState('');
  const [internalFocusedIndex, setInternalFocusedIndex] = useState(-1);

  // 1. Debounce 처리 (API 호출 및 포커스 타이밍 제어용)
  const debouncedValue = useDebounce(input, 400);

  // 2. 검색 결과 fetch (input이 아닌 debouncedValue를 관찰)
  const { locations = [], isSearching } = useWeatherSearch(debouncedValue);

  /**
   * 💡 최적화 포인트: useMemo 내에서 상태를 계산하여 불필요한 useEffect를 대체
   * - 사용자가 입력을 시작하면(input !== debouncedValue) 즉시 포커스 해제 (-1)
   * - 검색 완료 후 결과가 있고, 사용자가 조작 전(-1)이라면 0번을 가리킴
   */
  const focusedIndex = useMemo(() => {
    // 사용자가 타이핑 중이거나 로딩 중일 때는 연산을 최소화하고 포커스 제거
    if (input !== debouncedValue || isSearching || locations.length === 0) {
      return -1;
    }

    // 수동 조작이 없었다면 첫 번째 항목, 있었다면 그 인덱스 유지
    return internalFocusedIndex === -1 ? 0 : internalFocusedIndex;
  }, [input, debouncedValue, isSearching, locations.length, internalFocusedIndex]);

  /**
   * 💡 핸들러 최적화: useCallback을 통해 컴포넌트 리렌더링 시 함수 재생성 방지
   */
  const handleInputChange = useCallback((value: string) => {
    setInput(value);
    // 렌더링 중에 focusedIndex가 -1이 되도록 유도하므로 여기서 굳이 상태를 또 바꿀 필요가 없음
    // 다만 수동 인덱스는 리셋해줘야 다음 결과에서 다시 0번부터 시작함
    setInternalFocusedIndex(-1);
  }, []);

  const selectLocation = useCallback(
    (loc: BaseLocation) => {
      if (!loc) return;
      onSelect(loc);
      setInput('');
      setInternalFocusedIndex(-1);
    },
    [onSelect],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (locations.length === 0 || isSearching) return;

      // 현재 시각적 포커스(focusedIndex)를 기준으로 다음 위치 계산
      const currentIndex = focusedIndex === -1 ? 0 : focusedIndex;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setInternalFocusedIndex(Math.min(currentIndex + 1, locations.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setInternalFocusedIndex(Math.max(currentIndex - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (locations[currentIndex]) selectLocation(locations[currentIndex]);
          break;
        case 'Escape':
          setInput('');
          setInternalFocusedIndex(-1);
          break;
      }
    },
    [locations, isSearching, focusedIndex, selectLocation],
  );

  return {
    input,
    locations,
    isSearching,
    focusedIndex,
    handleInputChange,
    handleKeyDown,
    selectLocation,
    setInput,
  };
};
