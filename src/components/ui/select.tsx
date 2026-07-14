import { ChevronDown } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => (
    <div className="relative">
      <select
        className={cn(
          'flex h-11 min-h-[2.75rem] w-full appearance-none rounded-md border border-border-sand bg-soft-white px-3 py-2 pr-9 text-sm text-night-ink transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-haven-blue focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        ref={ref}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-graphite"
        aria-hidden="true"
      />
    </div>
  ),
);
Select.displayName = 'Select';

export { Select };
