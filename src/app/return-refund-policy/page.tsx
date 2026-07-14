import type { Metadata } from 'next';

import { PolicyPageContent } from '@/components/content/PolicyPageContent';
import { createInfoPageMetadata } from '@/lib/seo';

export const metadata: Metadata = createInfoPageMetadata({
  title: 'Return and Refund Policy',
  description:
    'Homeiffy return and refund policy - subject to business review before production launch.',
  path: '/return-refund-policy',
});

export default function ReturnRefundPolicyPage() {
  return <PolicyPageContent slug="return-refund-policy" />;
}
