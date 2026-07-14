'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';

import { dailyMoments } from '@/data/daily-moments';
import type { NavSection } from '@/lib/types';
import { cn } from '@/lib/utils';

export interface MegaMenuProps {
  section: NavSection;
  open: boolean;
  onClose: () => void;
}

export function MegaMenu({ section, open, onClose }: MegaMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const isMoments = section.id === 'shop-by-moment';

  useEffect(() => {
    if (!open) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    function handleClickOutside(event: MouseEvent) {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open, onClose]);

  if (!open || !section.children?.length) {
    return null;
  }

  return (
    <div
      ref={panelRef}
      id={`mega-menu-${section.id}`}
      role="region"
      aria-label={`${section.label} menu`}
      className="absolute left-0 right-0 top-full z-40 border-b border-wd-line bg-wd-elevated shadow-elevated"
    >
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {isMoments ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {dailyMoments.map((moment) => (
              <Link
                key={moment.slug}
                href={`/moments/${moment.slug}`}
                onClick={onClose}
                className="group rounded-lg border border-wd-line p-4 transition-colors hover:border-wd-accent/50 hover:bg-wd-hover"
              >
                <span
                  className="mb-2 inline-block size-2 rounded-full"
                  style={{ backgroundColor: moment.accentColor }}
                  aria-hidden="true"
                />
                <h3 className="font-display text-lg font-medium text-wd-text group-hover:text-wd-accent">
                  {moment.title}
                </h3>
                <p className="mt-1 text-sm text-wd-muted">{moment.shortCopy}</p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {section.children.map((child) => (
              <Link
                key={child.href}
                href={child.href}
                onClick={onClose}
                className="group rounded-md p-3 transition-colors hover:bg-wd-hover/60"
              >
                <span className="font-medium text-wd-text group-hover:text-wd-accent">
                  {child.label}
                </span>
                {child.description ? (
                  <p className="mt-0.5 text-sm text-wd-muted">
                    {child.description}
                  </p>
                ) : null}
              </Link>
            ))}
          </div>
        )}

        {section.href ? (
          <div className="mt-6 border-t border-wd-line pt-4">
            <Link
              href={section.href}
              onClick={onClose}
              className="text-sm font-medium text-wd-accent hover:underline"
            >
              View all {section.label}
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function MegaMenuTrigger({
  section,
  isOpen,
  onToggle,
  onClose,
}: {
  section: NavSection;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}) {
  const hasChildren = Boolean(section.children?.length);

  if (!hasChildren && section.href) {
    return (
      <Link
        href={section.href}
        className="px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-wd-text transition-colors hover:text-wd-accent"
      >
        {section.label}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={cn(
        'px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition-colors',
        isOpen
          ? 'text-wd-accent'
          : 'text-wd-text hover:text-wd-accent',
      )}
      aria-expanded={isOpen}
      aria-controls={`mega-menu-${section.id}`}
      aria-haspopup="true"
      onClick={onToggle}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          onClose();
        }
      }}
    >
      {section.label}
    </button>
  );
}
