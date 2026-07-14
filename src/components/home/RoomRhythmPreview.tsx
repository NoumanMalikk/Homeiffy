'use client';

import Link from 'next/link';
import { useState } from 'react';

import { roomRhythmSlots } from '@/components/home/home-data';
import { SectionHeading } from '@/components/home/SectionHeading';
import { buttonVariants } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { cn } from '@/lib/utils';

const slotHints: Record<string, string> = {
  anchor: 'Hall tree or console',
  seating: 'Bench or lounge seat',
  storage: 'Shoe cabinet or ottoman',
  table: 'Nesting side tables',
  accent: 'Room divider or narrow console',
};

export function RoomRhythmPreview() {
  const [activeSlot, setActiveSlot] = useState<string>('anchor');
  const activeHint = slotHints[activeSlot] ?? '';

  return (
    <Section spacing="lg" background="white">
      <Container>
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-14">
          <SectionHeading
            eyebrow="Room builder"
            title="Build a coordinated space"
            description="Add an anchor, seating, storage, table and flexible accent. Each product is added separately, with approximate combined footprint. No bundled savings or fit guarantees."
          />

          <div
            className="rounded-2xl border border-border-sand bg-cloud-cream/50 p-5 shadow-soft sm:p-6"
            role="group"
            aria-label="Room builder slot preview"
          >
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-haven-blue">
              Select a slot
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3">
              {roomRhythmSlots.map((slot) => {
                const isActive = activeSlot === slot.id;

                return (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() => setActiveSlot(slot.id)}
                    aria-pressed={isActive}
                    className={cn(
                      'rounded-lg border px-3 py-3.5 text-left transition-colors sm:py-4',
                      isActive
                        ? 'border-haven-blue bg-soft-white shadow-soft'
                        : 'border-border-sand/80 bg-soft-white/80 hover:border-haven-blue/40',
                    )}
                  >
                    <p className="text-[0.7rem] font-medium uppercase tracking-wide text-haven-blue sm:text-xs">
                      {slot.label}
                    </p>
                    <p className="mt-1 text-xs leading-snug text-graphite sm:text-sm">
                      {slotHints[slot.id]}
                    </p>
                  </button>
                );
              })}
            </div>

            <div className="mt-5 rounded-lg border border-border-sand/70 bg-soft-white px-4 py-3">
              <p className="text-sm font-medium text-night-ink">
                {roomRhythmSlots.find((slot) => slot.id === activeSlot)?.label}
              </p>
              <p className="mt-1 text-sm text-graphite">{activeHint}</p>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-graphite">
              Measure room width, doorway clearance and delivery route before
              adding pieces. Combined footprint is approximate.
            </p>

            <Link
              href="/room-builder"
              className={cn(
                buttonVariants({ variant: 'primary', size: 'default' }),
                'mt-5 w-full sm:w-auto',
              )}
            >
              Open room builder
            </Link>
          </div>
        </div>
      </Container>
    </Section>
  );
}
