import type { Metadata } from 'next';
import Link from 'next/link';

import { InfoPageLayout } from '@/components/content/InfoPageLayout';
import { MeasuringUnitHelper } from '@/components/content/MeasuringUnitHelper';
import { createInfoPageMetadata } from '@/lib/seo';

export const metadata: Metadata = createInfoPageMetadata({
  title: 'Measuring Guide',
  description:
    'Measure room dimensions, doorways, stairs, elevators and package sizes before ordering Homeiffy furniture. No fit guarantees.',
  path: '/measuring-guide',
});

const checklist = [
  {
    title: 'Room dimensions',
    items: [
      'Room width',
      'Room depth',
      'Ceiling height',
      'Furniture circulation paths around existing pieces',
    ],
  },
  {
    title: 'Access route',
    items: [
      'Doorway width',
      'Doorway height',
      'Hallway width',
      'Stair width',
      'Stair turning clearance',
      'Elevator interior width, depth and door height',
    ],
  },
  {
    title: 'Product clearance',
    items: [
      'Dining-chair clearance behind seated diners',
      'Bed clearance on sides and foot',
      'Sofa and loveseat clearance in front and beside seating',
      'Desk movement clearance for chair pull-out',
    ],
  },
  {
    title: 'Packaged delivery',
    items: [
      'Product width, depth and height from the specification table',
      'Package dimensions and box count when verified',
      'Compare package size to doorway and stair measurements',
    ],
  },
];

export default function MeasuringGuidePage() {
  return (
    <InfoPageLayout
      title="Measuring Guide"
      description="Review room, route and product measurements before ordering. Homeiffy does not guarantee fit."
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Measuring Guide', href: '/measuring-guide' },
      ]}
    >
      <p>
        Measure the room and the full delivery route before ordering. Compare
        your measurements to product dimensions and package dimensions on each
        product page. Fields marked verification required are not final.
      </p>

      <MeasuringUnitHelper />

      {checklist.map((section) => (
        <section key={section.title}>
          <h2>{section.title}</h2>
          <ul>
            {section.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      ))}

      <h2>Inches and centimeters</h2>
      <p>
        Homeiffy product dimensions are recorded in inches unless otherwise
        noted. Use the helper above to convert critical clearances to
        centimeters when needed.
      </p>

      <h2>No fit guarantees</h2>
      <p>
        Homeiffy does not guarantee that furniture will fit a room, doorway,
        stairwell or elevator. This guide supports planning only - it is not
        structural, architectural or code-compliance advice.
      </p>

      <p>
        For assembly space requirements, see{' '}
        <Link href="/assembly-information">Assembly Information</Link>. For
        safety and anchoring documentation, see{' '}
        <Link href="/furniture-safety">Furniture Safety</Link>.
      </p>
    </InfoPageLayout>
  );
}
