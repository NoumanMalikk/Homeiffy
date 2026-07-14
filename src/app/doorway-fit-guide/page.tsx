import type { Metadata } from 'next';
import Link from 'next/link';

import { InfoPageLayout } from '@/components/content/InfoPageLayout';
import { Prose } from '@/components/content/Prose';

export const metadata: Metadata = {
  title: 'Doorway Fit Guide',
  description:
    'How to measure doorways, hallways, stairs and elevators before ordering furniture from Homeiffy LLC.',
};

export default function DoorwayFitGuidePage() {
  return (
    <InfoPageLayout
      title="Doorway fit guide"
      description="Use this guide with the doorway fit checker to review delivery access. Measurements are customer-supplied and do not guarantee fit."
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Doorway Fit Guide', href: '/doorway-fit-guide' },
      ]}
    >
      <Prose>
        <h2>What to measure</h2>
        <ul>
          <li>Entry doorway width and height</li>
          <li>Interior doorways along the delivery path</li>
          <li>Hallway width at the narrowest point</li>
          <li>Stair width and turning depth, when applicable</li>
          <li>Elevator width, height and depth, when applicable</li>
          <li>Package width, height and depth from the product record</li>
        </ul>
        <h2>How to use the estimate</h2>
        <p>
          Compare the smallest package faces with the smallest openings on the
          delivery route. Allow extra clearance for corners, handrails and
          protective packaging.
        </p>
        <p>
          Open the{' '}
          <Link href="/doorway-fit-checker">doorway fit checker</Link> to
          calculate an estimate. The tool never claims guaranteed delivery fit.
        </p>
        <h2>Before ordering</h2>
        <p>
          Review the product package count, shipping class and assembly notes on
          each product page. If any measurement is uncertain, request shipping
          review before completing checkout.
        </p>
      </Prose>
    </InfoPageLayout>
  );
}
