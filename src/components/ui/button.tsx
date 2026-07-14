import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold uppercase tracking-[0.08em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wd-accent focus-visible:ring-offset-2 focus-visible:ring-offset-wd-black disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary:
          'bg-wd-accent text-wd-black hover:bg-wd-accent/90 active:bg-wd-accent/80',
        secondary:
          'bg-wd-text text-wd-black hover:bg-white/90 active:bg-white/80',
        ghost:
          'text-wd-text hover:bg-wd-elevated active:bg-wd-hover',
        outline:
          'border border-wd-text/40 bg-transparent text-wd-text hover:border-wd-accent hover:text-wd-accent',
        link: 'text-wd-accent underline-offset-4 hover:underline p-0 h-auto min-h-0 min-w-0 normal-case tracking-normal font-medium',
      },
      size: {
        sm: 'h-10 min-h-[2.75rem] px-4 text-xs',
        default: 'h-11 min-h-[2.75rem] px-5 text-xs',
        lg: 'h-12 min-h-[2.75rem] px-7 text-sm',
        icon: 'size-11 min-h-[2.75rem] min-w-[2.75rem] p-0',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  ),
);
Button.displayName = 'Button';

export { Button, buttonVariants };
