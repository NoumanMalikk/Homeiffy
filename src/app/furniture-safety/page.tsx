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

const pendingCount = productSafetyRecords.filter(
  (record) => record.verificationStatus === 'pending',
).length;

export default function FurnitureSafetyPage() {
  return (
    <InfoPageLayout
      title="Furniture Safety"
      description="How Homeiffy tracks safety documentation and verification status before live purchase."
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Furniture Safety', href: '/furniture-safety' },
      ]}
    >
      <p>
        Homeiffy maintains safety documentation fields for applicable products.
        Fields marked verification required or pending are not confirmed limits
        or warnings. Live purchase is blocked until required safety information
        is verified.
      </p>

      <div className="rounded-lg border border-clay-rose/40 bg-clay-rose/10 px-4 py-3 text-sm not-prose">
        <p className="font-medium text-night-ink">Verification status</p>
        <p className="mt-1 text-graphite">
          {pendingCount} of {productSafetyRecords.length} product safety records
          are currently pending verification. Homeiffy does not claim tip
          resistance, child safety, commercial grade use or fire resistance
          without verified manufacturer documentation.
        </p>
      </div>

      <h2>Documentation fields</h2>
      <p>
        The following safety topics are tracked per product when applicable:
      </p>
      <ul>
        {safetyFields.map((field) => (
          <li key={field.key}>
            <strong>{field.label}</strong>
          </li>
        ))}
      </ul>

      <h2>Product safety records</h2>
      <p>
        Review individual product pages for safety sections tied to each SKU.
        Summary status for the initial catalog:
      </p>

      <div className="overflow-x-auto not-prose">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-border-sand text-left">
              <th className="py-2 pr-4 font-medium text-night-ink">SKU</th>
              <th className="py-2 pr-4 font-medium text-night-ink">Status</th>
              <th className="py-2 font-medium text-night-ink">Notes</th>
            </tr>
          </thead>
          <tbody>
            {productSafetyRecords.map((record) => (
              <tr key={record.sku} className="border-b border-border-sand/70">
                <td className="py-3 pr-4 font-mono-data text-night-ink">
                  {record.sku}
                </td>
                <td className="py-3 pr-4 capitalize text-graphite">
                  {record.verificationStatus}
                </td>
                <td className="py-3 text-graphite">{record.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>What Homeiffy does not claim</h2>
      <p>Without verified documentation, Homeiffy does not claim products are:</p>
      <ul>
        <li>Tip resistant or anti-tip certified</li>
        <li>Child safe or suitable for climbing or standing</li>
        <li>Commercial grade</li>
        <li>Safe for sleeping on non-bed products</li>
        <li>Fire resistant</li>
        <li>Safe above a specific unpublished weight limit</li>
      </ul>

      <p>
        For assembly hardware and instruction status, see{' '}
        <Link href="/assembly-information">Assembly Information</Link>. Questions
        about a specific product can be submitted through the{' '}
        <Link href="/contact">Contact page</Link>.
      </p>
    </InfoPageLayout>
  );
}
