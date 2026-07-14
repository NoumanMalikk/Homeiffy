import { orderingSteps } from '@/components/home/home-data';
import { SectionHeading } from '@/components/home/SectionHeading';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';

export function HowOrderingWorks() {
  return (
    <Section spacing="lg" className="border-b border-wd-line bg-wd-black">
      <Container>
        <SectionHeading
          title="How ordering works"
          description="A straightforward path from browsing to secure checkout, with verification gates for incomplete product records."
          align="center"
          className="mx-auto"
        />

        <ol className="mt-10 grid gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          {orderingSteps.map((step, index) => (
            <li
              key={step}
              className="relative rounded-xl border border-wd-line bg-wd-elevated p-5 shadow-soft sm:p-6"
            >
              <span
                aria-hidden
                className="font-display text-3xl font-medium text-wd-accent/40 sm:text-4xl"
              >
                {String(index + 1).padStart(2, '0')}
              </span>
              <p className="mt-2 text-sm leading-relaxed text-wd-text sm:mt-3">
                {step}
              </p>
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}
