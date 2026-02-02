import Check from 'lucide-react/dist/esm/icons/check';
import ChevronLeft from 'lucide-react/dist/esm/icons/chevron-left';
import X from 'lucide-react/dist/esm/icons/x';

import { cn } from '@/shared/lib/utils';

import { useDistrictSelector } from '../model/useDistrictSelector';

const TEXTS = {
  title: '지역 선택',
  allSuffix: '전체 선택',
  empty: '데이터를 불러올 수 없습니다.',
  selecting: '선택 중:',
} as const;

const STYLES = {
  container:
    'bg-white dark:bg-[#1b212e] rounded-[2.8rem] overflow-hidden shadow-2xl flex flex-col h-240 max-h-[85vh] transition-all',
  header: 'px-8 py-6 border-b border-toss-grey/10 flex items-center justify-between',
  nav: 'px-8 py-4 bg-toss-grey/20 dark:bg-white/5 flex gap-3 items-center overflow-x-auto no-scrollbar',
  listArea: 'flex-1 overflow-y-auto p-4 custom-scrollbar',
  footer: 'px-8 py-5 border-t border-toss-grey/10 bg-white dark:bg-[#1b212e]',
  confirmBtn:
    'w-full text-left p-6 rounded-[1.6rem] bg-toss-blue/5 text-toss-blue font-bold text-[1.6rem] mb-2 hover:bg-toss-blue/10 transition-all active:scale-[0.98] flex items-center gap-2',
} as const;

interface DistrictSelectorProps {
  onConfirm: (address: string) => void;
  onClose: () => void;
}

export const DistrictSelector = ({ onConfirm, onClose }: DistrictSelectorProps) => {
  const { step, selection, currentList, handleSelect, handleConfirmCurrent, handleBack, setStep, scrollRef } =
    useDistrictSelector(onConfirm);

  const selectionText = [selection.province, selection.city].filter(Boolean).join(' ');

  return (
    <div className={STYLES.container}>
      <header className={STYLES.header}>
        <div className="flex items-center gap-4">
          {step !== 'province' && (
            <button
              onClick={handleBack}
              className="p-2 hover:bg-toss-grey dark:hover:bg-white/5 rounded-full transition-colors"
            >
              <ChevronLeft className="size-6 opacity-50" />
            </button>
          )}
          <h3 className="text-[1.8rem] font-bold tracking-tight">{TEXTS.title}</h3>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-toss-grey dark:hover:bg-white/5 rounded-full transition-colors"
        >
          <X className="size-6 opacity-50" />
        </button>
      </header>

      <nav className={STYLES.nav}>
        <StepLabel label="시/도" active={step === 'province'} onClick={() => setStep('province')} />
        <Separator />
        <StepLabel
          label="시/군/구"
          active={step === 'city'}
          disabled={!selection.province}
          onClick={() => setStep('city')}
        />
        <Separator />
        <StepLabel
          label="읍/면/동"
          active={step === 'dong'}
          disabled={!selection.city}
          onClick={() => setStep('dong')}
        />
      </nav>

      <div ref={scrollRef} className={STYLES.listArea}>
        <div className="grid grid-cols-1 gap-1">
          {step !== 'province' && (
            <button onClick={handleConfirmCurrent} className={STYLES.confirmBtn}>
              <span className="text-[1.8rem]">✨</span>
              <span>
                {step === 'city' ? selection.province : selection.city} {TEXTS.allSuffix}
              </span>
            </button>
          )}

          {currentList.map((item) => (
            <DistrictItem
              key={item}
              name={item}
              isSelected={item === selection.province || item === selection.city}
              onClick={() => handleSelect(item)}
            />
          ))}

          {currentList.length === 0 && <EmptyState />}
        </div>
      </div>

      {selectionText && (
        <footer className={STYLES.footer}>
          <p className="text-[1.3rem] font-medium opacity-50">
            {TEXTS.selecting} <span className="text-toss-text-main dark:text-white/80">{selectionText}</span>
          </p>
        </footer>
      )}
    </div>
  );
};

/* --- Sub Components --- */

interface StepLabelProps {
  label: string;
  active: boolean;
  disabled?: boolean;
  onClick: () => void;
}

const StepLabel = ({ label, active, disabled, onClick }: StepLabelProps) => (
  <button
    onClick={onClick}
    disabled={disabled || active}
    className={cn(
      'text-toss-btn font-bold whitespace-nowrap transition-all px-1',
      active ? 'text-toss-blue scale-105' : 'opacity-40 hover:opacity-60 disabled:hover:opacity-40',
    )}
  >
    {label}
  </button>
);

const Separator = () => <span className="text-[1.2rem] opacity-10 select-none">{'>'}</span>;

interface DistrictItemProps {
  name: string;
  onClick: () => void;
  isSelected: boolean;
}

const DistrictItem = ({ name, onClick, isSelected }: DistrictItemProps) => (
  <button
    onClick={onClick}
    className={cn(
      'w-full text-left p-6 rounded-[1.6rem] transition-all active:scale-[0.98] flex items-center justify-between group',
      isSelected ? 'bg-toss-blue/5 text-toss-blue font-bold' : 'hover:bg-toss-grey dark:hover:bg-white/5',
    )}
  >
    <span className="text-[1.6rem] font-medium">{name}</span>
    <div className="flex items-center">
      {isSelected ? (
        <Check className="size-5 text-toss-blue" />
      ) : (
        <ChevronLeft className="size-5 rotate-180 opacity-0 -translate-x-2 group-hover:opacity-30 group-hover:translate-x-0 transition-all" />
      )}
    </div>
  </button>
);

const EmptyState = () => (
  <div className="py-24 text-center">
    <p className="opacity-30 text-[1.5rem] font-medium">{TEXTS.empty}</p>
  </div>
);
