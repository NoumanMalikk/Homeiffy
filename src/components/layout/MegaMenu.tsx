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
      className="absolute left-0 right-0 top-full z-40 border-b border-border-sand bg-soft-white shadow-elevated"
    >
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {isMoments ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {dailyMoments.map((moment) => (
              <Link
                key={moment.slug}
                href={`/moments/${moment.slug}`}
                onClick={onClose}
                className="group rounded-lg border border-border-sand/60 p-4 transition-colors hover:border-haven-blue/30 hover:bg-cloud-cream/50"
              >
                <span
                  className="mb-2 inline-block size-2 rounded-full"
                  style={{ backgroundColor: moment.accentColor }}
                  aria-hidden="true"
                />
                <h3 className="font-display text-lg font-medium text-night-ink group-hover:text-haven-blue">
                  {moment.title}
                </h3>
                <p className="mt-1 text-sm text-graphite">{moment.shortCopy}</p>
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
                className="group rounded-md p-3 transition-colors hover:bg-cloud-cream/60"
              >
                <span className="font-medium text-night-ink group-hover:text-haven-blue">
                  {child.label}
                </span>
                {child.description ? (
                  <p className="mt-0.5 text-sm text-graphite">
                    {child.description}
                  </p>
                ) : null}
              </Link>
            ))}
          </div>
        )}

        {section.href ? (
          <div className="mt-6 border-t border-border-sand pt-4">
            <Link
              href={section.href}
              onClick={onClose}
              className="text-sm font-medium text-haven-blue hover:underline"
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
        className="rounded-md px-3 py-2 text-sm font-medium text-night-ink transition-colors hover:text-haven-blue"
      >
        {section.label}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={cn(
        'rounded-md px-3 py-2 text-sm font-medium transition-colors',
        isOpen
          ? 'bg-cloud-cream text-haven-blue'
          : 'text-night-ink hover:text-haven-blue',
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
