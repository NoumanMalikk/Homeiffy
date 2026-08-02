import Link from 'next/link';
import { notFound } from 'next/navigation';

import { InfoPageLayout } from '@/components/content/InfoPageLayout';
import { getPolicyBySlug, legalConfig } from '@/data/legal-config';
import type { PolicySection } from '@/lib/types';

function slugifyHeading(heading: string): string {
  return heading
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function PolicySectionBlock({ section }: { section: PolicySection }) {
  const id = slugifyHeading(section.heading);

  return (
    <section aria-labelledby={id} className="scroll-mt-28">
      <h2
        id={id}
        className="font-display text-xl font-medium text-wd-text sm:text-2xl"
      >
        {section.heading}
      </h2>

      {section.body?.map((paragraph) => (
        <p key={paragraph} className="mt-4 leading-relaxed text-wd-muted">
          {paragraph}
        </p>
      ))}

      {section.bullets ? (
        <ul className="mt-4 space-y-2">
          {section.bullets.map((bullet) => (
            <li key={bullet} className="flex gap-3 leading-relaxed text-wd-muted">
              <span
                aria-hidden="true"
                className="mt-2.5 size-1 shrink-0 bg-wd-accent"
              />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      ) : null}

      {section.table ? (
        <div className="mt-5 overflow-x-auto border border-wd-line">
          <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
            <thead>
              <tr className="bg-wd-elevated">
                {section.table.columns.map((column) => (
                  <th
                    key={column}
                    scope="col"
                    className="border-b border-wd-line px-4 py-3 font-medium text-wd-text"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {section.table.rows.map((row) => (
                <tr
                  key={row.join('|')}
                  className="border-b border-wd-line last:border-b-0"
                >
                  {row.map((cell, cellIndex) => (
                    <td
                      key={`${row[0]}-${cellIndex}`}
                      className={
                        cellIndex === 0
                          ? 'px-4 py-3 align-top font-medium text-wd-text'
                          : 'px-4 py-3 align-top text-wd-muted'
                      }
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </section>
  );
}

export function PolicyPageContent({ slug }: { slug: string }) {
  const policy = getPolicyBySlug(slug);

  if (!policy) {
    notFound();
  }

  const relatedPolicies = legalConfig.policies.filter(
    (entry) => entry.slug !== policy.slug,
  );

  return (
    <InfoPageLayout
      prose={false}
      title={policy.title}
      description={policy.summary}
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: policy.title, href: `/${policy.slug}` },
      ]}
      aside={
        <nav aria-label={`${policy.title} sections`} className="space-y-6">
          <div>
            <h2 className="text-xs font-medium uppercase tracking-wide text-wd-accent">
              On this page
            </h2>
            <ul className="mt-3 space-y-2 text-sm">
              {policy.sections.map((section) => (
                <li key={section.heading}>
                  <a
                    href={`#${slugifyHeading(section.heading)}`}
                    className="text-wd-muted transition-colors hover:text-wd-text"
                  >
                    {section.heading}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-wd-line pt-6">
            <h2 className="text-xs font-medium uppercase tracking-wide text-wd-accent">
              Other policies
            </h2>
            <ul className="mt-3 space-y-2 text-sm">
              {relatedPolicies.map((entry) => (
                <li key={entry.slug}>
                  <Link
                    href={`/${entry.slug}`}
                    className="text-wd-muted transition-colors hover:text-wd-text"
                  >
                    {entry.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      }
    >
      <div className="max-w-3xl space-y-10">
        <dl className="flex flex-wrap gap-x-10 gap-y-2 border-y border-wd-line py-4 text-sm">
          <div className="flex gap-2">
            <dt className="text-wd-muted">Effective</dt>
            <dd className="font-medium text-wd-text">{policy.effectiveDate}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="text-wd-muted">Last updated</dt>
            <dd className="font-medium text-wd-text">{policy.lastUpdated}</dd>
          </div>
        </dl>

        {policy.sections.map((section) => (
          <PolicySectionBlock key={section.heading} section={section} />
        ))}

        <p className="border-t border-wd-line pt-6 text-sm text-wd-muted">
          Still have a question this page does not answer? Reach us through the{' '}
          <Link href="/contact" className="text-wd-accent hover:underline">
            contact page
          </Link>{' '}
          and we will come back to you.
        </p>
      </div>
    </InfoPageLayout>
  );
}
