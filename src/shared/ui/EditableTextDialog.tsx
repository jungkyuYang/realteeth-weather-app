import { useState } from 'react';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from '@/shared/ui/dialog';
import { cn } from '@/shared/lib/utils';

interface Props {
  title: string;
  label: string;
  description?: string;
  initialValue: string;
  placeholder?: string;
  triggerIcon?: React.ReactNode;
  onSave: (value: string) => Promise<void> | void;
  isLoading?: boolean;
  triggerClassName?: string;
  contentClassName?: string;
  inputClassName?: string;
  submitButtonClassName?: string;
}

export const EditableTextDialog = ({
  title,
  label,
  description,
  initialValue,
  placeholder,
  triggerIcon,
  onSave,
  isLoading,
  triggerClassName,
  contentClassName,
  inputClassName,
  submitButtonClassName,
}: Props) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(initialValue);

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (nextOpen) {
      setValue(initialValue);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim() || value === initialValue || isLoading) return;
    await onSave(value.trim());
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          /* 💡 hover:bg-toss-grey는 모드에 따라 자동으로 변합니다 */
          className={cn('hover:bg-toss-grey hover:text-toss-blue', triggerClassName)}
        >
          {triggerIcon}
        </Button>
      </DialogTrigger>

      <DialogContent
        className={cn(
          'sm:max-w-152 p-0 overflow-hidden border-none shadow-2xl rounded-[2.8rem] bg-card',
          '[&>button]:right-10 [&>button]:top-10 [&>button]:rounded-full [&>button]:p-3',
          '[&>button>svg]:size-[2.2rem]',
          '[&>button]:text-toss-text-sub [&>button]:hover:bg-toss-grey [&>button]:transition-all',
          '[&>button]:dark:text-white/50 [&>button]:dark:hover:text-white [&>button]:dark:hover:bg-white/10',
          '[&>button]:opacity-80 [&>button]:hover:opacity-100',
          contentClassName,
        )}
      >
        <form onSubmit={handleSubmit} className="flex flex-col bg-card">
          <DialogHeader className="p-[3.2rem] pb-[1.2rem] text-center">
            {/* 💡 text-toss-text-main을 써야 다크모드에서 흰색으로 변합니다 */}
            <DialogTitle className="text-[2.4rem] font-bold text-toss-text-main leading-tight">{title}</DialogTitle>
            {description && (
              <DialogDescription className="text-toss-text-sub font-medium pt-[0.8rem] text-[1.5rem]">
                {description}
              </DialogDescription>
            )}
          </DialogHeader>

          <div className="px-[3.2rem] py-[0.8rem]">
            <div className="space-y-[1.2rem]">
              <Label htmlFor="editable-input" className="sr-only">
                {label}
              </Label>
              <Input
                id="editable-input"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={placeholder}
                /* 💡 Input 컴포넌트 내부에서 이미 bg-toss-grey 처리가 되어있으므로 중복 스타일 제거 가능 */
                className={cn('h-[5.6rem] px-8 text-[1.8rem] font-semibold', inputClassName)}
                autoFocus
              />
            </div>
          </div>

          <DialogFooter className="p-[3.2rem] pt-[2.4rem] flex flex-col gap-[1.2rem] sm:flex-col">
            <Button
              type="submit"
              size="lg"
              disabled={isLoading || !value.trim() || value === initialValue}
              /* 💡 Button 컴포넌트의 default(toss-blue)를 활용 */
              className={cn('w-full order-1 shadow-lg shadow-blue-500/10 active:scale-[0.98]', submitButtonClassName)}
            >
              {isLoading ? '변경 중...' : '확인'}
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="lg"
              onClick={() => setOpen(false)}
              /* 💡 취소 버튼: 텍스트는 자동으로 서브 컬러, 호버 시 배경 대응 */
              className="w-full order-2 text-toss-text-sub font-medium"
            >
              다음에 할게요
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
