import * as React from 'react';
import { cn } from '@/shared/lib/utils';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        /* 1. 기본 스타일: bg-toss-grey로 변경하여 공용 테마 적용 */
        'flex w-full min-w-0 bg-toss-grey border-none px-16 text-[1.8rem] font-semibold transition-all outline-none',
        'h-[5.6rem] rounded-[1.6rem]',

        /* 2. 텍스트 및 선택 영역: toss-blue와 toss-text-main 적용 */
        'text-toss-text-main placeholder:text-toss-text-sub/50 selection:bg-toss-blue/20',

        /* 3. 파일 업로드 등 기타 상태 */
        'file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-toss-btn file:font-medium',
        'disabled:pointer-events-none disabled:opacity-50',

        /* 4. 포커스 시 링 컬러: toss-blue/30으로 일관성 유지 */
        'focus-visible:ring-2 focus-visible:ring-toss-blue/30',

        /* 5. 에러 상태 */
        'aria-invalid:ring-destructive/20 aria-invalid:border-destructive',
        className,
      )}
      {...props}
    />
  );
}

export { Input };
