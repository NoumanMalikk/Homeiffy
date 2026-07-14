import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const sectionVariants = cva('', {
  variants: {
    spacing: {
      none: 'py-0',
      sm: 'py-8 sm:py-10',
      default: 'py-12 sm:py-16',
      lg: 'py-16 sm:py-24',
    },
    background: {
      none: '',
      cream: 'bg-cloud-cream',
      white: 'bg-soft-white',
      subtle:
        'bg-gradient-to-b from-soft-white/60 to-cloud-cream/40',
    },
  },
  defaultVariants: {
    spacing: 'default',
    background: 'none',
  },
});

export interface SectionProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof sectionVariants> {
  as?: 'section' | 'div';
}

function Section({
  className,
  spacing,
  background,
  as: Component = 'section',
  ...props
}: SectionProps) {
  return (
    <Component
      className={cn(sectionVariants({ spacing, background }), className)}
      {...props}
    />
  );
}

export { Section, sectionVariants };
