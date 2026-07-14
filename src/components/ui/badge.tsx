import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-night-ink text-cloud-cream',
        secondary:
          'border-transparent bg-haven-blue/10 text-haven-blue',
        outline:
          'border-border-sand bg-transparent text-graphite',
        accent:
          'border-transparent bg-moss-linen/20 text-night-ink',
        warning:
          'border-transparent bg-amber-light/20 text-night-ink',
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
