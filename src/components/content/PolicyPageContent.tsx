import { notFound } from 'next/navigation';
import Link from 'next/link';

import { InfoPageLayout } from '@/components/content/InfoPageLayout';
import { PolicyBanner } from '@/components/content/PolicyBanner';
import { getPolicyBySlug } from '@/data/legal-config';

export function PolicyPageContent({ slug }: { slug: string }) {
  const policy = getPolicyBySlug(slug);

  if (!policy) {
    notFound();
  }

  return (
    <InfoPageLayout
      title={policy.title}
      description="Review terms that govern orders, shipping, privacy and accessibility on Homeiffy."
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: policy.title, href: `/${policy.slug}` },
      ]}
    >
      <div className="space-y-8 not-prose">
        <PolicyBanner />
        <div className="rounded-lg border border-border-sand bg-cloud-cream/50 px-5 py-4 font-mono-data text-sm text-night-ink">
          {policy.content}
        </div>
        {policy.requiresBusinessReview ? (
          <p className="text-sm text-graphite">
            Final policy language, effective dates and operational details require
            business review before production launch. For questions, use the{' '}
            <Link href="/contact">Contact page</Link> or call the phone number
            listed in the site footer.
          </p>
        ) : null}
      </div>
    </InfoPageLayout>
  );
}
