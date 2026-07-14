import * as React from 'react';

import { cn } from '@/lib/utils';

export interface SwatchProps {
  label: string;
  hex?: string;
  selected?: boolean;
  size?: 'sm' | 'md';
  className?: string;
  onClick?: () => void;
}

export function Swatch({
  label,
  hex,
  selected = false,
  size = 'sm',
  className,
  onClick,
}: SwatchProps) {
  const isInteractive = Boolean(onClick);
  const sizeClasses = size === 'sm' ? 'size-5' : 'size-7';

  const content = (
    <>
      <span
        className={cn(
          'shrink-0 rounded-full border border-border-sand',
          sizeClasses,
          selected && 'ring-2 ring-haven-blue ring-offset-1',
        )}
        style={{ backgroundColor: hex ?? 'var(--border-sand)' }}
        aria-hidden="true"
      />
      <span className="truncate text-xs text-graphite">{label}</span>
    </>
  );

  if (isInteractive) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={`${label}${selected ? ', selected' : ''}`}
        aria-pressed={selected}
        className={cn(
          'inline-flex min-h-[2.75rem] items-center gap-2 rounded-md px-1.5 py-1 transition-colors hover:bg-border-sand/40',
          selected && 'bg-border-sand/30',
          className,
        )}
      >
        {content}
      </button>
    );
  }

  return (
    <span
      className={cn('inline-flex items-center gap-2', className)}
      title={label}
    >
      {content}
    </span>
  );
}
