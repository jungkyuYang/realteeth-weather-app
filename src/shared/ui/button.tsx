/* eslint-disable react-refresh/only-export-components */
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';

import { cn } from '@/shared/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap font-bold transition-all active:scale-[0.96] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-toss-blue/20',
  {
    variants: {
      variant: {
        default: 'bg-toss-blue text-white hover:bg-toss-blue-hover shadow-md shadow-blue-500/10',
        destructive: 'bg-destructive text-white hover:bg-destructive/90',
        outline:
          'border border-border bg-transparent text-toss-text-main dark:text-white dark:border-white/20 hover:bg-toss-grey dark:hover:bg-white/10',
        secondary:
          'bg-toss-grey dark:bg-white/10 text-toss-text-sub dark:text-white/80 hover:bg-toss-grey/80 dark:hover:bg-white/20',
        ghost: 'text-toss-text-main dark:text-white hover:bg-toss-grey dark:hover:bg-white/10 hover:text-toss-blue',
        link: 'text-toss-blue underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-[5.2rem] px-[2.4rem] rounded-[1.8rem] text-[1.6rem]',
        xs: 'h-[2.8rem] gap-[0.4rem] rounded-[0.8rem] px-[0.8rem] text-[1.2rem] [&_svg]:size-[1.2rem]',
        sm: 'h-[4.0rem] gap-[0.6rem] rounded-[1.2rem] px-[1.6rem] text-[1.4rem] [&_svg]:size-[1.4rem]',
        lg: 'h-[6.0rem] rounded-[2.2rem] px-[3.2rem] text-[1.8rem] [&_svg]:size-[1.8rem]',
        icon: 'size-[5.2rem] rounded-[1.8rem] [&_svg]:size-[2rem]',
        'icon-sm': 'size-[4.0rem] rounded-[1.2rem] [&_svg]:size-[1.6rem]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

interface ButtonProps extends React.ComponentProps<'button'>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
}

function Button({
  className,
  variant,
  size,
  asChild = false,
  isLoading = false,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      disabled={disabled || isLoading}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {isLoading && <Loader2 className="animate-spin" />}
      {children}
    </Comp>
  );
}

export { Button, buttonVariants };
