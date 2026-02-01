import { cn } from '@/shared/lib/utils';

interface SkeletonProps {
  className?: string;
}

export const Skeleton = ({ className }: SkeletonProps) => {
  return (
    <div
      className={cn(
        // 1. 배경색: 토스 스타일의 연한 그레이 (다크모드 대응)
        'bg-toss-grey dark:bg-white/5',
        // 2. 애니메이션: 부드럽게 깜빡이는 효과
        'animate-pulse',
        // 3. 기본 모서리 곡률 (필요시 className으로 덮어씀)
        'rounded-[1.2rem]',
        className,
      )}
    />
  );
};
