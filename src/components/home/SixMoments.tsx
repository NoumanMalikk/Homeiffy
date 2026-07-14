import Link from 'next/link';

import { SectionHeading } from '@/components/home/SectionHeading';
import { dailyMoments } from '@/data/daily-moments';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { cn } from '@/lib/utils';

export function SixMoments() {
  return (
    <Section spacing="lg" background="cream">
      <Container>
        <SectionHeading
          eyebrow="Daily moments"
          title="Six rhythms that shape the home."
          description="Browse furniture organized around how rooms actually change through the day, from arrival to reset."
        />

        <ul className="mt-10 grid grid-cols-1 gap-4 sm:mt-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {dailyMoments.map((moment) => (
            <li key={moment.slug} className="flex">
              <Link
                href={`/moments/${moment.slug}`}
                className="group flex h-full w-full min-h-[12.5rem] flex-col rounded-xl border border-border-sand bg-soft-white p-6 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-haven-blue focus-visible:ring-offset-2 sm:min-h-[13.5rem]"
              >
                <div
                  aria-hidden
                  className="mb-5 h-1 w-12 rounded-full transition-all duration-300 group-hover:w-16"
                  style={{ backgroundColor: moment.accentColor }}
                />
                <h3 className="font-display text-xl font-medium text-night-ink transition-colors group-hover:text-haven-blue sm:text-2xl">
                  {moment.title}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-graphite">
                  {moment.shortCopy}
                </p>
                <span
                  className={cn(
                    'mt-5 inline-flex items-center text-sm font-medium text-haven-blue',
                    'group-hover:underline group-hover:underline-offset-4',
                  )}
                >
                  Explore {moment.title}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
