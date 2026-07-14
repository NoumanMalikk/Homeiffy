import Link from 'next/link';

import { buttonVariants } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { cn } from '@/lib/utils';

export function MeasureFirstBand() {
  return (
    <Section spacing="default" className="border-y border-border-sand/70">
      <Container>
        <div className="flex flex-col items-start gap-5 rounded-2xl bg-gradient-to-r from-haven-blue/8 via-cloud-cream to-moss-linen/10 px-5 py-8 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-8 sm:py-9">
          <div className="max-w-2xl">
            <h2 className="font-display text-xl font-medium text-night-ink sm:text-2xl lg:text-3xl">
              Will it fit through the door?
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-graphite sm:mt-3 sm:text-base">
              Compare package dimensions with doorway, hallway, stair and elevator
              clearance. This tool provides an estimate only — confirm measurements
              before ordering.
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link
              href="/doorway-fit-checker"
              className={cn(
                buttonVariants({ variant: 'secondary', size: 'lg' }),
                'w-full shrink-0 sm:w-auto',
              )}
            >
              Open doorway fit checker
            </Link>
            <Link
              href="/measuring-guide"
              className={cn(
                buttonVariants({ variant: 'outline', size: 'lg' }),
                'w-full shrink-0 sm:w-auto',
              )}
            >
              Measuring guide
            </Link>
          </div>
        </div>
      </Container>
    </Section>
  );
}
