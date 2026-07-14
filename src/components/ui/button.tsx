import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-haven-blue focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary:
          'bg-night-ink text-cloud-cream hover:bg-night-ink/90 active:bg-night-ink/95',
        secondary:
          'bg-haven-blue text-soft-white hover:bg-haven-blue/90 active:bg-haven-blue/95',
        ghost:
          'text-night-ink hover:bg-border-sand/60 active:bg-border-sand/80',
        outline:
          'border border-border-sand bg-transparent text-night-ink hover:bg-cloud-cream active:bg-border-sand/40',
        link: 'text-haven-blue underline-offset-4 hover:underline p-0 h-auto min-h-0 min-w-0',
      },
      size: {
        sm: 'h-10 min-h-[2.75rem] px-3 text-sm',
        default: 'h-11 min-h-[2.75rem] px-4 text-sm',
        lg: 'h-12 min-h-[2.75rem] px-6 text-base',
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
