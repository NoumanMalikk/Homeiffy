import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center border px-2.5 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-wd-accent text-wd-black',
        secondary:
          'border-transparent bg-wd-accent/15 text-wd-accent',
        outline:
          'border-wd-line bg-transparent text-wd-muted',
        accent:
          'border-transparent bg-wd-elevated text-wd-text',
        warning:
          'border-transparent bg-wd-accent/20 text-wd-accent',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
