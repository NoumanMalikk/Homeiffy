import type { Metadata } from 'next';

import { InfoPageLayout } from '@/components/content/InfoPageLayout';
import { JsonLdScript } from '@/components/layout/JsonLdScript';
import { faqByCategory, faqItems } from '@/data/faq';
import { buildFaqJsonLd, createInfoPageMetadata } from '@/lib/seo';

export const metadata: Metadata = createInfoPageMetadata({
  title: 'Frequently Asked Questions',
  description:
    'Answers about Homeiffy dimensions, shipping, assembly, materials, quotes, safety, contact and ordering.',
  path: '/faq',
});

export default function FaqPage() {
  return (
    <>
      <JsonLdScript data={buildFaqJsonLd(faqItems)} />
      <InfoPageLayout
        title="Frequently Asked Questions"
        description="Common questions about dimensions, shipping, materials, assembly, safety, quotes and contact."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'FAQ', href: '/faq' },
        ]}
        prose={false}
      >
        <div className="space-y-10">
          {Object.entries(faqByCategory).map(([category, items]) => (
            <section key={category} aria-labelledby={`faq-${category}`}>
              <h2
                id={`faq-${category}`}
                className="font-display text-xl font-medium text-night-ink"
              >
                {category}
              </h2>
              <ul className="mt-4 space-y-3">
                {items.map((item) => (
                  <li key={item.id}>
                    <details className="group rounded-lg border border-border-sand bg-soft-white px-4 py-3">
                      <summary className="cursor-pointer list-none font-medium text-night-ink marker:content-none [&::-webkit-details-marker]:hidden">
                        <span className="flex items-start justify-between gap-4">
                          {item.question}
                          <span
                            aria-hidden="true"
                            className="text-graphite transition-transform group-open:rotate-45"
                          >
                            +
                          </span>
                        </span>
                      </summary>
                      <p className="mt-3 text-sm leading-relaxed text-graphite">
                        {item.answer}
                      </p>
                    </details>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </InfoPageLayout>
    </>
  );
}
