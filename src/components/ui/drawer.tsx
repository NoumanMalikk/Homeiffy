'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import * as React from 'react';
import { createPortal } from 'react-dom';

import { Button } from '@/components/ui/button';
import { useFocusTrap } from '@/lib/hooks/use-focus-trap';
import { useReducedMotion } from '@/lib/hooks/use-reduced-motion';
import { useScrollLock } from '@/lib/hooks/use-scroll-lock';
import { cn } from '@/lib/utils';

export interface DrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  side?: 'left' | 'right';
  className?: string;
}

export function Drawer({
  open,
  onOpenChange,
  title,
  description,
  children,
  side = 'right',
  className,
}: DrawerProps) {
  const trapRef = useFocusTrap(open);
  useScrollLock(open);
  const reducedMotion = useReducedMotion();
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

  if (typeof document === 'undefined') {
    return null;
  }

  const slideFrom = side === 'right' ? '100%' : '-100%';

  return createPortal(
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-50">
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-[2px]"
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.2 }}
            onClick={() => onOpenChange(false)}
          />
          <motion.div
            ref={trapRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={description ? descId : undefined}
            className={cn(
              'absolute top-0 flex h-full w-full max-w-md flex-col border-wd-line bg-wd-surface shadow-elevated',
              side === 'right'
                ? 'right-0 border-l'
                : 'left-0 border-r',
              className,
            )}
            initial={{ x: reducedMotion ? 0 : slideFrom }}
            animate={{ x: 0 }}
            exit={{ x: reducedMotion ? 0 : slideFrom }}
            transition={{
              duration: reducedMotion ? 0 : 0.3,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <div className="flex items-start justify-between gap-4 border-b border-wd-line px-4 py-4 sm:px-6">
              <div>
                <h2
                  id={titleId}
                  className="font-display text-lg font-medium text-wd-text"
                >
                  {title}
                </h2>
                {description ? (
                  <p id={descId} className="mt-0.5 text-sm text-wd-muted">
                    {description}
                  </p>
                ) : null}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onOpenChange(false)}
                aria-label="Close drawer"
              >
                <X />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6">
              {children}
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
