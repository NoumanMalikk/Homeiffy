import Link from 'next/link';

import { JsonLdScript } from '@/components/layout/JsonLdScript';
import { buildBreadcrumbJsonLd, type BreadcrumbItem } from '@/lib/seo';
import { cn } from '@/lib/utils';

export function Breadcrumbs({
  items,
  className,
}: {
  items: BreadcrumbItem[];
  className?: string;
}) {
  if (items.length === 0) {
    return null;
  }

  return (
    <>
      <JsonLdScript data={buildBreadcrumbJsonLd(items)} />
      <nav aria-label="Breadcrumb" className={cn('text-sm', className)}>
        <ol className="flex flex-wrap items-center gap-1.5 text-wd-muted">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;

            return (
              <li key={item.href} className="flex items-center gap-1.5">
                {index > 0 ? (
                  <span aria-hidden="true" className="text-border-sand">
                    /
                  </span>
                ) : null}
                {isLast ? (
                  <span
                    aria-current="page"
                    className="font-medium text-wd-text"
                  >
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="transition-colors hover:text-wd-accent"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
