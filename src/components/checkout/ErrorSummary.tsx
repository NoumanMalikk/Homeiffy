'use client';

import { cn } from '@/lib/utils';

interface ErrorSummaryProps {
  title?: string;
  errors: string[];
  className?: string;
}

export function ErrorSummary({
  title = 'Please fix the following',
  errors,
  className,
}: ErrorSummaryProps) {
  if (errors.length === 0) {
    return null;
  }

  return (
    <div
      role="alert"
      aria-live="polite"
      className={cn(
        'rounded-md border border-clay-rose/40 bg-clay-rose/10 px-4 py-3 text-sm text-night-ink',
        className,
      )}
    >
      <p className="font-medium">{title}</p>
      <ul className="mt-2 list-disc space-y-1 pl-5">
        {errors.map((error) => (
          <li key={error}>{error}</li>
        ))}
      </ul>
    </div>
  );
}
