import Link from 'next/link';

import {
  materialMoodGroups,
  verifiedColorwayLabels,
} from '@/components/home/home-data';
import { SectionHeading } from '@/components/home/SectionHeading';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { cn } from '@/lib/utils';

export function MaterialMood() {
  const visibleGroups = materialMoodGroups.filter((group) =>
    group.finishes.some((finish) => verifiedColorwayLabels.has(finish)),
  );

  return (
    <Section spacing="lg" background="cream">
      <Container>
        <SectionHeading
          title="Start with the feeling of the surface."
          description="Browse verified finish and upholstery names from the catalog. Material construction claims are not published until supplier documentation is confirmed."
          align="center"
          className="mx-auto"
        />

        <ul className="mt-10 grid gap-3 sm:mt-12 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
          {visibleGroups.map((group) => {
            const finishes = group.finishes.filter((finish) =>
              verifiedColorwayLabels.has(finish),
            );

            return (
              <li key={group.id}>
                <Link
                  href={group.href}
                  className="group flex h-full flex-col rounded-xl border border-border-sand bg-soft-white p-5 shadow-soft transition-shadow hover:shadow-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-haven-blue focus-visible:ring-offset-2"
                >
                  <h3 className="font-display text-lg font-medium text-night-ink transition-colors group-hover:text-haven-blue sm:text-xl">
                    {group.title}
                  </h3>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {finishes.map((finish) => (
                      <li
                        key={finish}
                        className={cn(
                          'rounded-full border border-border-sand bg-cloud-cream/50 px-3 py-1 text-xs text-graphite',
                        )}
                      >
                        {finish}
                      </li>
                    ))}
                  </ul>
                  <span className="mt-auto pt-4 text-sm font-medium text-haven-blue">
                    View materials
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </Container>
    </Section>
  );
}
