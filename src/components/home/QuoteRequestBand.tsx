import Link from 'next/link';

import { buttonVariants } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { cn } from '@/lib/utils';

export function QuoteRequestBand() {
  return (
    <Section spacing="default">
      <Container>
        <div className="rounded-2xl border border-border-sand bg-night-ink px-5 py-8 text-cloud-cream sm:px-8 sm:py-9">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
            <div className="max-w-2xl">
              <h2 className="font-display text-xl font-medium sm:text-2xl lg:text-3xl">
                Planning a larger furniture order?
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-cloud-cream/85 sm:mt-3 sm:text-base">
                Submit the products, quantities and destination details you are
                considering for a structured quote review.
              </p>
              <p className="mt-2 text-xs text-cloud-cream/65 sm:mt-3 sm:text-sm">
                Quote requests do not guarantee trade pricing, quantity
                discounts, installation, delivery timing or quote approval.
              </p>
            </div>
            <Link
              href="/request-a-quote"
              className={cn(
                buttonVariants({ variant: 'secondary', size: 'lg' }),
                'w-full shrink-0 bg-cloud-cream text-night-ink hover:bg-cloud-cream/90 sm:w-auto',
              )}
            >
              Request a Furniture Quote
            </Link>
          </div>
        </div>
      </Container>
    </Section>
  );
}
