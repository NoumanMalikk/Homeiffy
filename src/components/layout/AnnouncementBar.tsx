'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';

import { announcementMessages } from '@/data/store-config';
import { useReducedMotion } from '@/lib/hooks/use-reduced-motion';

const MESSAGES = announcementMessages;
const ROTATION_MS = 5000;

export function AnnouncementBar() {
  const [index, setIndex] = useState(0);
  const reducedMotion = useReducedMotion();

  const advance = useCallback(() => {
    setIndex((current) => (current + 1) % MESSAGES.length);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const timer = window.setInterval(advance, ROTATION_MS);
    return () => window.clearInterval(timer);
  }, [reducedMotion, advance]);

  return (
    <div
      className="relative z-40 flex h-9 items-center justify-center border-b border-wd-line bg-wd-black px-4 text-xs text-wd-muted sm:text-sm"
      role="region"
      aria-label="Site announcements"
    >
      <div className="relative w-full max-w-7xl overflow-hidden text-center" aria-live="polite">
        <AnimatePresence mode="wait">
          <motion.p
            key={index}
            className="truncate px-4 uppercase tracking-[0.12em]"
            initial={reducedMotion ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reducedMotion ? undefined : { opacity: 0, y: -6 }}
            transition={{ duration: reducedMotion ? 0 : 0.3 }}
          >
            {MESSAGES[index]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
