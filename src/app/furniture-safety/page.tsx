import type { Metadata } from 'next';
import Link from 'next/link';

import { InfoPageLayout } from '@/components/content/InfoPageLayout';
import { productSafetyRecords } from '@/data/product-safety';
import { createInfoPageMetadata } from '@/lib/seo';
export const metadata: Metadata = createInfoPageMetadata({
  title: 'Furniture Safety',
  description:
    'Documentation expectations for weight capacity, tip-over risk, anchoring, mechanisms and manufacturer warnings on Homeiffy products.',
  path: '/furniture-safety',
});

const safetyFields = [
  { key: 'weightCapacity', label: 'Weight capacity' },
  { key: 'tipOverRisk', label: 'Tip-over risk' },
  { key: 'wallAnchoring', label: 'Wall anchoring' },
  { key: 'drawerSafety', label: 'Drawer safety' },
  { key: 'shelfLoad', label: 'Shelf load' },
  { key: 'casterLocks', label: 'Caster locks' },
  { key: 'foldingMechanism', label: 'Folding mechanisms' },
  { key: 'extensionMechanism', label: 'Extension mechanisms' },
  { key: 'pinchPoints', label: 'Pinch points' },
  { key: 'storageHinges', label: 'Storage hinges' },
  { key: 'glassComponents', label: 'Glass components' },
  { key: 'sharpCorners', label: 'Sharp corners' },
  { key: 'assemblyHardware', label: 'Assembly hardware' },
  {
    key: 'flammabilityDocumentation',
    label: 'Upholstered-product flammability documentation',
  },
  { key: 'manufacturerWarnings', label: 'Manufacturer warnings' },
  { key: 'recallStatus', label: 'Recall status' },
] as const;

const anchoringRequiredSkus = productSafetyRecords
  .filter((record) => /required/i.test(record.wallAnchoring ?? ''))
  .map((record) => record.sku);

export default function FurnitureSafetyPage() {
  return (
    <InfoPageLayout
      title="Furniture Safety"
      description="How to use Homeiffy furniture safely: anchoring, load limits, mechanisms and what to check before you assemble."
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Furniture Safety', href: '/furniture-safety' },
      ]}
    >
      <div className="border-l-2 border-wd-accent bg-wd-elevated px-4 py-3 not-prose">
        <p className="font-medium text-wd-text">
          Tip-over hazard: anchor tall furniture to the wall
        </p>
        <p className="mt-1 text-sm text-wd-muted">
          A falling dresser, bookcase or wardrobe can kill a child. Every tall
          storage piece we sell ships with an anti-tip restraint kit, and it is
          not optional. Fit it before you put anything in the drawers.
        </p>
      </div>

      <h2>Anchor these pieces before use</h2>
      <p>
        {anchoringRequiredSkus.length} products in our catalog are tall relative
        to their depth and must be anchored to a wall stud before they are
        loaded. The restraint kit is supplied in the carton at no extra cost.
        Each product page states the requirement in its safety section.
      </p>
      <ul>
        <li>Dressers and tall chests</li>
        <li>Wardrobes, including the open frame wardrobe</li>
        <li>Bookcases and room divider shelving</li>
        <li>Hall trees and glass front display cabinets</li>
        <li>Any wall-mounted piece, which relies entirely on its fixing</li>
      </ul>
      <p>
        The supplied fixings suit timber studs. If you have masonry, plaster and
        lath, or metal studs, buy fixings rated for your wall construction. If
        you are not sure what your wall is made of, use a stud finder or ask a
        contractor before drilling.
      </p>

      <h2>Safety topics on every product page</h2>
      <p>
        Where a topic applies to a product, it appears in the safety section of
        that product page:
      </p>
      <ul>
        {safetyFields.map((field) => (
          <li key={field.key}>
            <strong>{field.label}</strong>
          </li>
        ))}
      </ul>

      <h2>Before you assemble</h2>
      <ul>
        <li>Inspect every component for transit damage. Do not use a part with a split or splintered edge.</li>
        <li>Use only the hardware supplied. Substituted or over-tightened fixings are the most common cause of a wobbly piece.</li>
        <li>Assemble on a soft surface such as the flattened carton to avoid scratching the finish.</li>
        <li>Retighten all fixings after the first month, then every six months.</li>
      </ul>

      <h2>In everyday use</h2>
      <ul>
        <li>Open one drawer at a time, and never let a child climb on an open drawer.</li>
        <li>Put heavier items in lower drawers and on lower shelves.</li>
        <li>Do not stand or sit on anything not designed to carry that load.</li>
        <li>Engage castor locks before loading, unloading or sitting on a mobile piece.</li>
        <li>Keep fingers clear of folding and extension mechanisms, and confirm they are latched before applying load.</li>
        <li>Keep upholstered furniture away from open flame and heat sources.</li>
      </ul>

      <h2>What we do not claim</h2>
      <p>
        We publish a load rating only where the supplier documents one. Where a
        product page does not show a weight capacity, we have not published a
        figure, and you should not infer one. We make no claim that any product
        is anti-tip certified, child safe, commercial grade, fire resistant, or
        safe to sleep on where it is not a bed.
      </p>

      <h2>Reporting a safety concern</h2>
      <p>
        If you believe a product has a safety defect, stop using it and contact
        us immediately with your order reference and photographs. We will
        arrange collection or replacement, and we report confirmed defects to
        the Consumer Product Safety Commission as required.
      </p>

      <p>
        For assembly hardware and instruction status, see{' '}
        <Link href="/assembly-information">Assembly Information</Link>. Questions
        about a specific product can be submitted through the{' '}
        <Link href="/contact">Contact page</Link>.
      </p>
    </InfoPageLayout>
  );
}
