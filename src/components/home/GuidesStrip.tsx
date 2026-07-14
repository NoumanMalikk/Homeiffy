import Link from 'next/link';

import { Container } from '@/components/ui/container';

const GUIDES = [
  {
    category: 'Measuring',
    title: 'Measuring guide for rooms and delivery routes',
    href: '/measuring-guide',
    excerpt:
      'How to measure width, depth, doorway clearance and package access before ordering furniture.',
  },
  {
    category: 'Delivery access',
    title: 'Doorway fit guide',
    href: '/doorway-fit-guide',
    excerpt:
      'Compare package dimensions with doorways, hallways, stairs and elevators. Estimates only.',
  },
  {
    category: 'Assembly',
    title: 'Assembly information',
    href: '/assembly-information',
    excerpt:
      'Review assembly status, hardware notes and what to confirm on each product record.',
  },
  {
    category: 'Materials',
    title: 'Materials and finishes',
    href: '/materials-finishes',
    excerpt:
      'Finish groups and upholstery references used across the Homeiffy catalog.',
  },
] as const;

export function GuidesStrip() {
  return (
    <section className="border-b border-wd-line bg-wd-black py-16 sm:py-20">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <p className="wd-section-label">Furniture guides</p>
          <h2 className="wd-section-title mt-3">Plan before you order</h2>
          <p className="mt-3 text-sm text-wd-muted sm:text-base">
            Practical pages for dimensions, access, assembly and finishes.
          </p>
        </div>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {GUIDES.map((guide) => (
            <li key={guide.href}>
              <Link
                href={guide.href}
                className="group flex h-full flex-col border border-wd-line bg-wd-elevated p-5 transition hover:border-wd-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wd-accent"
              >
                <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-wd-accent">
                  {guide.category}
                </p>
                <h3 className="mt-3 font-display text-xl text-wd-text transition group-hover:text-wd-accent">
                  {guide.title}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-wd-muted">
                  {guide.excerpt}
                </p>
                <span className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-wd-text">
                  Continue reading
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
