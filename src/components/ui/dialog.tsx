'use client';

import { X } from 'lucide-react';
import * as React from 'react';
import { createPortal } from 'react-dom';

import { Button } from '@/components/ui/button';
import { useFocusTrap } from '@/lib/hooks/use-focus-trap';
import { useScrollLock } from '@/lib/hooks/use-scroll-lock';
import { cn } from '@/lib/utils';

export interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function Dialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  className,
}: DialogProps) {
  const trapRef = useFocusTrap(open);
  useScrollLock(open);
  const titleId = React.useId();
  const descId = React.useId();

  React.useEffect(() => {
    if (!open) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onOpenChange(false);
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onOpenChange]);

  if (!open || typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-night-ink/40 backdrop-blur-[2px]"
        aria-hidden="true"
        onClick={() => onOpenChange(false)}
      />
      <div
        ref={trapRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descId : undefined}
        className={cn(
          'relative z-10 w-full max-w-lg rounded-lg border border-border-sand bg-soft-white p-6 shadow-elevated',
          className,
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2
              id={titleId}
              className="font-display text-xl font-medium text-night-ink"
            >
              {title}
            </h2>
            {description ? (
              <p id={descId} className="mt-1 text-sm text-graphite">
                {description}
              </p>
            ) : null}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            aria-label="Close dialog"
          >
            <X />
          </Button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
