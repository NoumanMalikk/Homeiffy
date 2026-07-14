'use client';

import { Pause, Play } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';

import { announcementMessages } from '@/data/store-config';
import { useReducedMotion } from '@/lib/hooks/use-reduced-motion';
import { cn } from '@/lib/utils';

const MESSAGES = announcementMessages;
const ROTATION_MS = 6000;

export function AnnouncementBar() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reducedMotion = useReducedMotion();

  const advance = useCallback(() => {
    setIndex((current) => (current + 1) % MESSAGES.length);
  }, []);

  useEffect(() => {
    if (paused || reducedMotion) {
      return;
    }

    const timer = window.setInterval(advance, ROTATION_MS);
    return () => window.clearInterval(timer);
  }, [paused, reducedMotion, advance]);

  return (
    <div
      className="relative z-40 flex h-10 items-center justify-center border-b border-border-sand/60 bg-[rgb(69_108_106/0.09)] px-4 text-sm text-room-ink"
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
              className="truncate px-8"
              initial={reducedMotion ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reducedMotion ? undefined : { opacity: 0, y: -6 }}
              transition={{ duration: reducedMotion ? 0 : 0.35 }}
            >
              {MESSAGES[index]}
            </motion.p>
          </AnimatePresence>
        </div>

        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          className={cn(
            'inline-flex size-11 shrink-0 items-center justify-center rounded-md text-soft-graphite transition-colors hover:bg-border-sand/50 hover:text-room-ink',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-homeiffy-teal focus-visible:ring-offset-2',
          )}
          aria-label={paused ? 'Resume announcement rotation' : 'Pause announcement rotation'}
          aria-pressed={paused}
        >
          {paused ? <Play className="size-4" /> : <Pause className="size-4" />}
        </button>
      </div>
    </div>
  );
}
