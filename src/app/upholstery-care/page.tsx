import type { Metadata } from 'next';
import Link from 'next/link';

import { InfoPageLayout } from '@/components/content/InfoPageLayout';
import { createInfoPageMetadata } from '@/lib/seo';

export const metadata: Metadata = createInfoPageMetadata({
  title: 'Upholstery and Care',
  description:
    'How Homeiffy documents upholstery composition, cushion construction, care instructions and color variation without unverified performance claims.',
  path: '/upholstery-care',
});

export default function UpholsteryCarePage() {
  return (
    <InfoPageLayout
      title="Upholstery and Care"
      description="Upholstery fields, care documentation structure and verification guidance for Homeiffy products."
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Upholstery and Care', href: '/upholstery-care' },
      ]}
    >
      <h2>Upholstery material fields</h2>
      <p>
        Each upholstered product tracks upholstery material, upholstery color,
        foam specification and related colorways. These fields describe what is
        entered for development review - not necessarily what is confirmed for
        live sale.
      </p>

      <h2>Fabric composition</h2>
      <p>
        Our upholstered pieces use a woven polyester-blend performance fabric
        over high-resilience foam on a kiln-dried hardwood frame. The exact
        composition for each product is listed under Materials and finish on its
        product page.
      </p>

      <h2>Leather and synthetic materials</h2>
      <p>
        Leather or synthetic upholstery types are recorded only when confirmed.
        Homeiffy does not claim genuine leather, vegan leather or performance
        fabric without verified documentation.
      </p>

      <h2>Rub-count and cleaning codes</h2>
      <p>
        Rub-count documentation and manufacturer cleaning codes are published
        when available from verified supplier records. Absent fields are not
        treated as confirmed durability or cleaning guidance.
      </p>

      <h2>Cushion construction and foam</h2>
      <p>
        Cushion construction and foam specification fields describe internal
        upholstery structure when documented. Homeiffy does not claim
        high-density foam or specific comfort performance without verified
        records.
      </p>

      <h2>Color variation and seam details</h2>
      <p>
        Upholstery color can vary by dye lot, lighting and screen calibration.
        Seam, channel and tufting details are shown in verified photography when
        available.
      </p>

      <h2>Manufacturer care instructions</h2>
      <p>
        Care instructions and spot-cleaning guidance appear on product pages
        when verified. Homeiffy does not claim stain resistance, spill
        resistance, pet friendliness, child safety or flame resistance without
        confirmed documentation.
      </p>

      <h2>Replacement covers</h2>
      <p>
        Replacement-cover availability is documented per product when confirmed
        by the supplier. Unverified fields must not be interpreted as an
        available replacement program.
      </p>

      <p>
        Review surface-finish and wood documentation on the{' '}
        <Link href="/materials-finishes">Materials and Finishes</Link> page. For
        product-specific dimensions and package sizes, use the{' '}
        <Link href="/measuring-guide">Measuring Guide</Link>.
      </p>
    </InfoPageLayout>
  );
}
