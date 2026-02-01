import { useState, useCallback, useRef, useEffect, type RefObject } from 'react';
import { useDistrictData } from '@/entities/location/model/district';

export type SelectorStep = 'province' | 'city' | 'dong';

interface SelectionState {
  province: string;
  city: string;
}

export interface UseDistrictSelectorReturn {
  step: SelectorStep;
  selection: SelectionState;
  currentList: string[];
  handleSelect: (item: string) => void;
  handleConfirmCurrent: () => void;
  handleBack: () => void;
  setStep: (step: SelectorStep) => void;
  scrollRef: RefObject<HTMLDivElement | null>;
}

export const useDistrictSelector = (onConfirm: (address: string) => void): UseDistrictSelectorReturn => {
  const [step, setStep] = useState<SelectorStep>('province');
  const [selection, setSelection] = useState<SelectionState>({
    province: '',
    city: '',
  });

  const scrollRef = useRef<HTMLDivElement>(null);

  const { provinces, cities, dongs } = useDistrictData(selection.province, selection.city);
  const currentList = step === 'province' ? provinces : step === 'city' ? cities : dongs;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [step]);

  // 💡 마지막 선택 단계에서 'item'만 내보내도록 수정
  const handleSelect = useCallback(
    (item: string) => {
      if (step === 'province') {
        setSelection({ province: item, city: '' });
        setStep('city');
      } else if (step === 'city') {
        setSelection((prev) => ({ ...prev, city: item }));
        setStep('dong');
      } else {
        // 읍/면/동 단계: "역삼동" 전달
        onConfirm(item);
      }
    },
    [step, onConfirm],
  );

  // 💡 중간 단계 '전체' 선택 시에도 해당 레벨의 명칭만 전달
  const handleConfirmCurrent = useCallback(() => {
    const result = step === 'city' ? selection.province : selection.city;
    onConfirm(result);
  }, [step, selection, onConfirm]);

  const handleBack = useCallback(() => {
    if (step === 'dong') setStep('city');
    else if (step === 'city') setStep('province');
  }, [step]);

  return {
    step,
    selection,
    currentList,
    handleSelect,
    handleConfirmCurrent,
    handleBack,
    setStep,
    scrollRef,
  };
};
