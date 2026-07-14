import type { Metadata } from 'next';
import Link from 'next/link';

import { InfoPageLayout } from '@/components/content/InfoPageLayout';
import { createInfoPageMetadata } from '@/lib/seo';

export const metadata: Metadata = createInfoPageMetadata({
  title: 'About Homeiffy',
  description:
    'Homeiffy LLC is a Burkville, Alabama-based furniture retailer offering furniture for living rooms, bedrooms, dining areas, entryways, storage and home workspaces.',
  path: '/about',
});

export default function AboutPage() {
  return (
    <InfoPageLayout
      title="About Homeiffy"
      description="Furniture that earns its space — with clear dimensions and exact product records before checkout."
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'About', href: '/about' },
      ]}
    >
      <p>
        Homeiffy LLC is a Burkville, Alabama-based furniture retailer offering
        furniture for living rooms, bedrooms, dining areas, entryways, storage
        and home workspaces. The online catalog is designed to help customers
        review exact product images, dimensions, finishes, upholstery, assembly
        and shipping information before ordering. Product specifications and
        availability are based on current verified product records.
      </p>
      <p>
        Fields marked verification required or pending in the catalog are not
        confirmed for live purchase. Purchase eligibility is gated until images,
        specifications and safety documentation are verified.
      </p>
      <p>
        Customers can browse by room, footprint and function, compare
        configurations, check doorway access and build coordinated room groups.
        Each product remains an individual SKU.
      </p>
      <p>
        The registered business address is not presented as a walk-in showroom,
        warehouse or customer pickup location. For product, order or policy
        questions, use the{' '}
        <Link href="/contact" className="text-homeiffy-teal hover:underline">
          Contact page
        </Link>{' '}
        or the phone number listed in the site footer.
      </p>
    </InfoPageLayout>
  );
}
