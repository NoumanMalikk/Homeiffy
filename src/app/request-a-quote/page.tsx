import type { Metadata } from 'next';

import { InfoPageLayout } from '@/components/content/InfoPageLayout';
import { QuoteRequestForm } from '@/components/forms/QuoteRequestForm';
import { createInfoPageMetadata } from '@/lib/seo';

export const metadata: Metadata = createInfoPageMetadata({
  title: 'Request a Furniture Quote',
  description:
    'Submit products, quantities and destination details for a structured Homeiffy quote review. No guaranteed pricing or delivery timing.',
  path: '/request-a-quote',
});

export default function RequestAQuotePage() {
  return (
    <InfoPageLayout
      title="Request a furniture quote"
      description="Submit the products, quantities and destination details you are considering for structured review."
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Request a quote', href: '/request-a-quote' },
      ]}
      prose={false}
    >
      <div className="max-w-3xl rounded-2xl border border-border-sand bg-soft-white p-6 sm:p-8">
        <QuoteRequestForm />
      </div>
    </InfoPageLayout>
  );
}
