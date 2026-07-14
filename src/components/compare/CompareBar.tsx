'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { useReducedMotion } from '@/lib/hooks/use-reduced-motion';
import { useCompareStore } from '@/stores';

export function CompareBar() {
  const items = useCompareStore((s) => s.items);
  const removeItem = useCompareStore((s) => s.remove);
  const clearAll = useCompareStore((s) => s.clear);
  const reducedMotion = useReducedMotion();

  return (
    <AnimatePresence>
      {items.length > 0 ? (
        <motion.div
          className="fixed bottom-0 left-0 right-0 z-40 border-t border-border-sand bg-soft-white/95 shadow-elevated backdrop-blur-md"
          initial={reducedMotion ? false : { y: '100%' }}
          animate={{ y: 0 }}
          exit={reducedMotion ? undefined : { y: '100%' }}
          transition={{ duration: reducedMotion ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}
          role="region"
          aria-label="Product comparison"
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
            <div className="flex flex-1 flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-night-ink">
                Comparing {items.length} of 4
              </span>
              {items.map((item) => (
                <span
                  key={item.productId}
                  className="inline-flex items-center gap-1 rounded-full border border-border-sand bg-cloud-cream/50 px-3 py-1 text-xs text-night-ink"
                >
                  <span className="max-w-[10rem] truncate">{item.title}</span>
                  <button
                    type="button"
                    onClick={() => removeItem(item.productId)}
                    className="inline-flex size-6 items-center justify-center rounded-full hover:bg-border-sand/60"
                    aria-label={`Remove ${item.title} from compare`}
                  >
                    <X className="size-3" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={clearAll}>
                Clear all
              </Button>
              <Link
                href="/compare"
                className="inline-flex h-10 min-h-[2.75rem] items-center justify-center rounded-md bg-night-ink px-3 text-sm font-medium text-cloud-cream transition-colors hover:bg-night-ink/90"
              >
                Compare now
              </Link>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
