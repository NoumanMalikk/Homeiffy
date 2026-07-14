import type { Metadata } from 'next';
import Link from 'next/link';

import { InfoPageLayout } from '@/components/content/InfoPageLayout';
import { materialMoodGroups } from '@/components/home/home-data';
import { createInfoPageMetadata } from '@/lib/seo';

export const metadata: Metadata = createInfoPageMetadata({
  title: 'Materials and Finishes',
  description:
    'Understand Homeiffy material and finish fields, verification status, and color variation before ordering furniture.',
  path: '/materials-finishes',
});

const finishGroups = materialMoodGroups;

export default async function MaterialsFinishesPage({
  searchParams,
}: {
  searchParams: Promise<{ group?: string }>;
}) {
  const { group } = await searchParams;
  const activeGroup = finishGroups.find((item) => item.id === group);

  return (
    <InfoPageLayout
      title="Materials and Finishes"
      description="How Homeiffy documents materials, surface finishes and color variation across the catalog."
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Materials and Finishes', href: '/materials-finishes' },
      ]}
      aside={
        <nav aria-label="Finish groups" className="space-y-2">
          <p className="text-sm font-medium text-night-ink">Finish groups</p>
          <ul className="space-y-1 text-sm">
            {finishGroups.map((item) => (
              <li key={item.id}>
                <Link
                  href={`/materials-finishes?group=${item.id}`}
                  className={
                    group === item.id
                      ? 'font-medium text-haven-blue'
                      : 'text-graphite hover:text-haven-blue'
                  }
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      }
    >
      {activeGroup ? (
        <div className="rounded-lg border border-haven-blue/30 bg-haven-blue/5 px-4 py-3 text-sm text-night-ink not-prose">
          Viewing finish group: <strong>{activeGroup.title}</strong> - {' '}
          {activeGroup.finishes.join(', ')}. Development references only until
          verified product photography and finish samples are available.
        </div>
      ) : null}

      <h2>Material vs finish</h2>
      <p>
        A <strong>material</strong> describes the underlying substance or
        construction - for example frame material, wood construction, upholstery
        composition or foam specification on a product record.
      </p>
      <p>
        A <strong>finish</strong> describes the visible surface treatment - paint
        color, wood tone, metal frame finish or hardware finish shown in
        colorways and surface-finish fields.
      </p>
      <p>
        Homeiffy lists both separately so you can review what is confirmed
        versus what remains pending verification on each product page.
      </p>

      <h2>Verification fields</h2>
      <p>Catalog fields may show one of these states:</p>
      <ul>
        <li>
          <strong>Verification required</strong> - no confirmed supplier or
          physical inspection record yet.
        </li>
        <li>
          <strong>Pending manufacturing specification</strong> - awaiting
          factory documentation.
        </li>
        <li>
          <strong>Pending supplier documentation</strong> - awaiting vendor
          records.
        </li>
        <li>
          <strong>Pending physical product inspection</strong> - awaiting in-hand
          review.
        </li>
      </ul>
      <p>
        Do not treat pending fields as final material claims. Live purchase
        remains blocked until specifications are verified.
      </p>

      <h2>Wood, veneer and engineered wood</h2>
      <p>
        Wood species, wood construction and frame material are tracked per
        product. Homeiffy does not publish solid wood, hardwood or FSC
        certification claims without verified documentation - and those claims
        are not confirmed for initial catalog products.
      </p>

      <h2>Painted surfaces and metal frames</h2>
      <p>
        Painted finishes and metal frame combinations appear in product
        colorways and surface-finish fields. Exact color naming follows verified
        records when available.
      </p>

      <h2>Hardware finishes</h2>
      <p>
        Pulls, hinges, casters and other hardware finishes are documented when
        supplier records confirm them. Until then, related fields remain pending.
      </p>

      <h2>Color, grain and screen variation</h2>
      <p>
        Wood grain, fabric weave and paint sheen can vary between production
        runs. Screen colors also differ by device, brightness and room lighting.
      </p>
      <p>
        Finish swatches and lifestyle images on the website are development
        references. Exact product photography and verified finish samples are
        required before live purchase.
      </p>

      <h2>Care documentation</h2>
      <p>
        Care instructions appear on product pages when verified. Homeiffy does
        not claim scratch resistance, water resistance or heat resistance
        without confirmed documentation.
      </p>
      <p>
        For upholstery-specific fields, see the{' '}
        <Link href="/upholstery-care">Upholstery and Care</Link> page.
      </p>
    </InfoPageLayout>
  );
}
