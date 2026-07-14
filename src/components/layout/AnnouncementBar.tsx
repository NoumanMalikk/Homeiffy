'use client';

import { Pause, Play } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';

import { announcementMessages } from '@/data/store-config';
import { useReducedMotion } from '@/lib/hooks/use-reduced-motion';
import { cn } from '@/lib/utils';

const MESSAGES = announcementMessages;
const ROTATION_MS = 5000;

export function AnnouncementBar() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reducedMotion = useReducedMotion();

  const advance = useCallback(() => {
    setIndex((current) => (current + 1) % MESSAGES.length);
  }, []);

  useEffect(() => {
    if (paused || reducedMotion) return;
    const timer = window.setInterval(advance, ROTATION_MS);
    return () => window.clearInterval(timer);
  }, [paused, reducedMotion, advance]);

  return (
    <div
      className="relative z-40 flex h-9 items-center justify-center border-b border-wd-line bg-wd-black px-4 text-xs text-wd-muted sm:text-sm"
      role="region"
      aria-label="Site announcements"
    >
      <div className="flex w-full max-w-7xl items-center justify-center gap-3">
        <div
          className="relative flex-1 overflow-hidden text-center"
          aria-live={paused ? 'off' : 'polite'}
        >
          <AnimatePresence mode="wait">
            <motion.p
              key={index}
              className="truncate px-8 uppercase tracking-[0.12em]"
              initial={reducedMotion ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reducedMotion ? undefined : { opacity: 0, y: -6 }}
              transition={{ duration: reducedMotion ? 0 : 0.3 }}
            >
              {MESSAGES[index]}
            </motion.p>
          </AnimatePresence>
        </div>
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          className={cn(
            'inline-flex size-9 shrink-0 items-center justify-center text-wd-muted transition-colors hover:text-wd-accent',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wd-accent',
          )}
          aria-label={paused ? 'Resume announcement rotation' : 'Pause announcement rotation'}
          aria-pressed={paused}
        >
          {paused ? <Play className="size-3.5" /> : <Pause className="size-3.5" />}
        </button>
      </div>
    </div>
  );
}
