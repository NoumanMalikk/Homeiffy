import type { Metadata } from 'next';
import Link from 'next/link';

import { InfoPageLayout } from '@/components/content/InfoPageLayout';
import { storeConfig } from '@/data/store-config';
import { createInfoPageMetadata } from '@/lib/seo';

export const metadata: Metadata = createInfoPageMetadata({
  title: 'Assembly Information',
  description:
    'General assembly guidance and per-product assembly fields for Homeiffy furniture. No estimated times or paid assembly service.',
  path: '/assembly-information',
});

export default function AssemblyInformationPage() {
  return (
    <InfoPageLayout
      title="Assembly Information"
      description="How Homeiffy documents assembly requirements, hardware, tools and instructions on product pages."
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Assembly Information', href: '/assembly-information' },
      ]}
    >
      <p>
        Many Homeiffy products require customer assembly. Assembly fields on
        each product page describe what is known during development review.
        Verified instruction documentation is required before live purchase when
        assembly is required.
      </p>

      {!storeConfig.assemblyServiceEnabled ? (
        <div className="rounded-lg border border-border-sand bg-cloud-cream/40 px-4 py-3 text-sm not-prose">
          Paid assembly and installation services are not currently enabled.
        </div>
      ) : null}

      <h2>Per-product assembly fields</h2>
      <p>Product pages may include the following assembly-related fields:</p>
      <ul>
        <li>
          <strong>Assembly required</strong> - whether the product ships for
          customer assembly.
        </li>
        <li>
          <strong>Hardware included</strong> - confirmed hardware contents when
          verified.
        </li>
        <li>
          <strong>Tools required</strong> - documented tools when supplier
          records confirm them.
        </li>
        <li>
          <strong>Assembly instructions</strong> - instruction availability
          status.
        </li>
        <li>
          <strong>Package contents</strong> - listed components when verified.
        </li>
      </ul>
      <p>
        Each product page states the tools you need, the hardware supplied and
        what the instructions cover. We do not publish an estimated assembly
        time, because it varies too much by person to be a useful promise.
      </p>

      <h2>Documentation expectations</h2>
      <p>When verified, Homeiffy aims to support:</p>
      <ul>
        <li>Step-by-step instruction documentation</li>
        <li>Instruction PDFs when accurate and approved</li>
        <li>Instruction video only when accurate and approved</li>
        <li>Parts inventory lists</li>
        <li>Floor-protection guidance where applicable</li>
        <li>Wall-anchor guidance where applicable</li>
        <li>A contact route for missing parts via the Contact page</li>
      </ul>

      <h2>Estimated assembly time</h2>
      <p>
        Estimated assembly time and number of people recommended are published
        only when verified instruction documentation is available. Homeiffy
        does not invent assembly times or describe assembly as easy.
      </p>

      <h2>Before you assemble</h2>
      <ul>
        <li>Confirm you have adequate floor space and route clearance.</li>
        <li>Review the Measuring Guide for room and doorway dimensions.</li>
        <li>
          Review Furniture Safety for anchoring, hinge and mechanism documentation.
        </li>
        <li>Keep packaging until assembly is complete and inspected.</li>
      </ul>

      <p>
        See the <Link href="/measuring-guide">Measuring Guide</Link> and{' '}
        <Link href="/furniture-safety">Furniture Safety</Link> pages for related
        planning information.
      </p>
    </InfoPageLayout>
  );
}
