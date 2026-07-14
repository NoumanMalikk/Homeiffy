import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const containerVariants = cva('mx-auto w-full', {
  variants: {
    size: {
      sm: 'max-w-3xl',
      md: 'max-w-5xl',
      lg: 'max-w-6xl',
      xl: 'max-w-7xl',
      full: 'max-w-none',
    },
    padding: {
      none: 'px-0',
      sm: 'px-4 sm:px-6',
      default: 'px-4 sm:px-6 lg:px-8',
    },
  },
  defaultVariants: {
    size: 'xl',
    padding: 'default',
  },
});

export interface ContainerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof containerVariants> {}

function Container({ className, size, padding, ...props }: ContainerProps) {
  return (
    <div
      className={cn(containerVariants({ size, padding }), className)}
      {...props}
    />
  );
}

export { Container, containerVariants };
