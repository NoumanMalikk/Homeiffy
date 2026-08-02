import type { Metadata } from 'next';

import { PolicyPageContent } from '@/components/content/PolicyPageContent';
import { createInfoPageMetadata } from '@/lib/seo';

export const metadata: Metadata = createInfoPageMetadata({
  title: 'Return and Refund Policy',
  description:
    'Return furniture within 30 days of delivery. Damaged or defective items are replaced or refunded at no cost to you.',
  path: '/return-refund-policy',
});

export default function ReturnRefundPolicyPage() {
  return <PolicyPageContent slug="return-refund-policy" />;
}
