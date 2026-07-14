import * as React from 'react';

import { cn } from '@/lib/utils';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', ...props }, ref) => (
    <input
      type={type}
      className={cn(
        'flex h-11 min-h-[2.75rem] w-full border border-wd-line bg-wd-elevated px-3 py-2 text-sm text-wd-text placeholder:text-wd-muted/70 transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wd-accent focus-visible:ring-offset-2 focus-visible:ring-offset-wd-black',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      ref={ref}
      {...props}
    />
  ),
);
Input.displayName = 'Input';

export { Input };
