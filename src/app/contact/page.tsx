import type { Metadata } from 'next';
import Link from 'next/link';

import { InfoPageLayout } from '@/components/content/InfoPageLayout';
import { ContactForm } from '@/components/forms/ContactForm';
import { buttonVariants } from '@/components/ui/button';
import { storeConfig } from '@/data/store-config';
import { createInfoPageMetadata } from '@/lib/seo';
import { cn, formatPhoneLink } from '@/lib/utils';

/*
 * Internal: registeredAddress.line1 includes a trailing "2" without an apartment,
 * unit, suite or floor label. Confirm exact formatting with business records
 * before enabling showFullBusinessAddress - do not publish speculative labels
 * such as "Apt 2" on the public site.
 */
export const metadata: Metadata = createInfoPageMetadata({
  title: 'Contact Homeiffy',
  description:
    'Contact Homeiffy LLC by phone for product, order, shipping and quote questions. Burkville, Alabama-based furniture retailer.',
  path: '/contact',
});

export default function ContactPage() {
  const { registeredAddress } = storeConfig;

  return (
    <InfoPageLayout
      title="Contact Homeiffy"
      description="Reach Homeiffy LLC for product, dimension, materials, assembly, safety, order and quote questions."
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Contact', href: '/contact' },
      ]}
      prose={false}
    >
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
        <div className="rounded-2xl border border-border-sand bg-soft-white p-6 sm:p-8">
          <h2 className="font-display text-xl font-medium text-night-ink">
            Send a message
          </h2>
          <p className="mt-2 text-sm text-graphite">
            Select a topic and include relevant product SKUs or order references
            when applicable.
          </p>
          <div className="mt-6">
            <ContactForm />
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-2xl border border-border-sand bg-cloud-cream/40 p-6">
            <h2 className="font-display text-lg font-medium text-night-ink">
              {storeConfig.legalName}
            </h2>
            <dl className="mt-4 space-y-3 text-sm text-graphite">
              <div>
                <dt className="font-medium text-night-ink">Phone</dt>
                <dd className="mt-1">
                  <a
                    href={`tel:${formatPhoneLink(storeConfig.phoneE164)}`}
                    className="font-medium text-haven-blue hover:underline"
                  >
                    {storeConfig.phoneDisplay}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="font-medium text-night-ink">Location</dt>
                <dd className="mt-1">{storeConfig.publicLocationLabel}</dd>
              </div>
              {storeConfig.showFullBusinessAddress ? (
                <div>
                  <dt className="font-medium text-night-ink">Address</dt>
                  <dd className="mt-1">
                    <address className="not-italic">
                      {registeredAddress.line1}
                      <br />
                      {registeredAddress.city}, {registeredAddress.state}{' '}
                      {registeredAddress.postalCode}
                    </address>
                  </dd>
                </div>
              ) : null}
              <div>
                <dt className="font-medium text-night-ink">Email</dt>
                <dd className="mt-1">
                  {storeConfig.contactEmail ? (
                    <a
                      href={`mailto:${storeConfig.contactEmail}`}
                      className="text-haven-blue hover:underline"
                    >
                      {storeConfig.contactEmail}
                    </a>
                  ) : (
                    <span className="text-graphite">
                      Email will appear here once configured.
                    </span>
                  )}
                </dd>
              </div>
            </dl>
          </div>

          <div className="rounded-2xl border border-border-sand bg-soft-white p-6">
            <h2 className="font-display text-lg font-medium text-night-ink">
              Request a quote
            </h2>
            <p className="mt-2 text-sm text-graphite">
              Planning a larger order? Submit products, quantities and
              destination details for structured review.
            </p>
            <Link
              href="/request-a-quote"
              className={cn(buttonVariants({ variant: 'secondary' }), 'mt-4 w-full')}
            >
              Request a furniture quote
            </Link>
          </div>

          <div className="rounded-2xl border border-border-sand bg-soft-white p-6 text-sm text-graphite">
            <p>
              The registered address is not a walk-in store, showroom, warehouse
              or pickup location. Store hours are not published.
            </p>
          </div>
        </aside>
      </div>
    </InfoPageLayout>
  );
}
