import { useState } from 'react';

import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from '@/shared/ui/dialog';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';

interface Props {
  title: string;
  label: string;
  description?: string;
  initialValue: string;
  placeholder?: string;
  triggerIcon?: React.ReactNode;
  triggerAriaLabel?: string;
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
  triggerAriaLabel,
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
          aria-label={triggerAriaLabel || `${title} 수정`}
          className={cn('hover:bg-toss-grey hover:text-toss-blue', triggerClassName)}
        >
          {triggerIcon}
        </Button>
      </DialogTrigger>

      <DialogContent
        className={cn(
          'sm:max-w-152 p-0 overflow-hidden border-none shadow-2xl rounded-[2.8rem] bg-card',
          // 우측 상단 X 닫기 버튼 스타일링
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
              className={cn('w-full order-1 shadow-lg shadow-blue-500/10 active:scale-[0.98]', submitButtonClassName)}
            >
              {isLoading ? '변경 중...' : '확인'}
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="lg"
              onClick={() => setOpen(false)}
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
