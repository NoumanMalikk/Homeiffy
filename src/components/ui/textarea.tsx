import * as React from 'react';

import { cn } from '@/lib/utils';

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea
      className={cn(
        'flex min-h-[5.5rem] w-full rounded-md border border-border-sand bg-soft-white px-3 py-2 text-sm text-night-ink placeholder:text-graphite/70 transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-haven-blue focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      ref={ref}
      {...props}
    />
  ),
);
Textarea.displayName = 'Textarea';

export { Textarea };
