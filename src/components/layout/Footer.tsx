import Link from 'next/link';

import { Logo } from '@/components/brand/Logo';
import { Container } from '@/components/ui/container';
import { categories } from '@/data/categories';
import { dailyMoments } from '@/data/daily-moments';
import { legalConfig } from '@/data/legal-config';
import { footerCustomerLinks } from '@/data/navigation';
import { rooms } from '@/data/rooms';
import { storeConfig } from '@/data/store-config';
import { formatPhoneLink } from '@/lib/utils';

const FOOTER_ROOMS = rooms.filter((room) =>
  [
    'living-room',
    'bedroom',
    'dining-room',
    'entryway',
    'home-office',
    'reading-area',
  ].includes(room.id),
);

const FOOTER_CATEGORIES = categories.filter(
  (cat) => cat.parentId === null && cat.id !== 'living-room',
).concat(
  categories.filter((cat) =>
    ['lounge-chairs', 'beds', 'dining-tables', 'entry-benches', 'writing-desks', 'bookcases'].includes(
      cat.id,
    ),
  ),
);

const UNIQUE_CATEGORIES = Array.from(
  new Map(FOOTER_CATEGORIES.map((c) => [c.collectionPath, c])).values(),
);

export function Footer() {
  const year = new Date().getFullYear();
  const { registeredAddress } = storeConfig;

  return (
    <footer className="mt-auto border-t border-border-sand bg-soft-white/80">
      <Container className="py-12 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="sm:col-span-2 lg:col-span-1">
            <Logo variant="horizontal" width={180} linkToHome className="max-h-14" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-graphite">
              {storeConfig.tagline}
            </p>
            <div className="mt-4 space-y-1 text-sm text-graphite">
              <p>
                <a
                  href={`tel:${formatPhoneLink(storeConfig.phoneE164)}`}
                  className="font-medium text-night-ink hover:text-haven-blue"
                >
                  {storeConfig.phoneDisplay}
                </a>
              </p>
              <p>{storeConfig.publicLocationLabel}</p>
              {storeConfig.showFullBusinessAddress ? (
                <address className="not-italic">
                  {registeredAddress.line1}
                  <br />
                  {registeredAddress.city}, {registeredAddress.state}{' '}
                  {registeredAddress.postalCode}
                </address>
              ) : null}
              {storeConfig.contactEmail ? (
                <p>
                  <a
                    href={`mailto:${storeConfig.contactEmail}`}
                    className="hover:text-haven-blue"
                  >
                    {storeConfig.contactEmail}
                  </a>
                </p>
              ) : null}
            </div>
          </div>

          <div>
            <h2 className="font-display text-sm font-medium uppercase tracking-wide text-night-ink">
              Daily Moments
            </h2>
            <ul className="mt-3 space-y-2">
              {dailyMoments.map((moment) => (
                <li key={moment.slug}>
                  <Link
                    href={`/moments/${moment.slug}`}
                    className="text-sm text-graphite hover:text-haven-blue"
                  >
                    {moment.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-display text-sm font-medium uppercase tracking-wide text-night-ink">
              Rooms
            </h2>
            <ul className="mt-3 space-y-2">
              {FOOTER_ROOMS.map((room) => (
                <li key={room.id}>
                  <Link
                    href={room.collectionPath}
                    className="text-sm text-graphite hover:text-haven-blue"
                  >
                    {room.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-display text-sm font-medium uppercase tracking-wide text-night-ink">
              Furniture
            </h2>
            <ul className="mt-3 space-y-2">
              {UNIQUE_CATEGORIES.map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={cat.collectionPath}
                    className="text-sm text-graphite hover:text-haven-blue"
                  >
                    {cat.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-display text-sm font-medium uppercase tracking-wide text-night-ink">
              Customer Information
            </h2>
            <ul className="mt-3 space-y-2">
              {footerCustomerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-graphite hover:text-haven-blue"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <h2 className="mt-6 font-display text-sm font-medium uppercase tracking-wide text-night-ink">
              Legal
            </h2>
            <ul className="mt-3 space-y-2">
              {legalConfig.policies.map((policy) => (
                <li key={policy.slug}>
                  <Link
                    href={`/${policy.slug}`}
                    className="text-sm text-graphite hover:text-haven-blue"
                  >
                    {policy.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border-sand pt-6 text-center text-xs text-graphite sm:text-left">
          <p>
            © {year} {storeConfig.legalName}. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}
