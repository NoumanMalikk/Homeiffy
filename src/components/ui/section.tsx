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
      cream: 'bg-wd-black',
      white: 'bg-wd-surface',
      subtle: 'bg-gradient-to-b from-wd-black to-wd-surface',
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
