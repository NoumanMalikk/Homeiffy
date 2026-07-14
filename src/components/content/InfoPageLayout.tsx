import * as React from 'react';

import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import type { BreadcrumbItem } from '@/lib/seo';
import { cn } from '@/lib/utils';

import { Prose } from './Prose';

export function InfoPageLayout({
  title,
  description,
  breadcrumbs,
  children,
  aside,
  prose = true,
  className,
}: {
  title: string;
  description?: string;
  breadcrumbs: BreadcrumbItem[];
  children: React.ReactNode;
  aside?: React.ReactNode;
  prose?: boolean;
  className?: string;
}) {
  const body = prose ? <Prose>{children}</Prose> : children;

  return (
    <>
      <Section spacing="default" background="subtle">
        <Container size="md">
          <Breadcrumbs items={breadcrumbs} className="mb-6" />
          <header className="max-w-3xl">
            <h1 className="font-display text-3xl font-medium text-night-ink sm:text-4xl">
              {title}
            </h1>
            {description ? (
              <p className="mt-4 text-lg leading-relaxed text-graphite">
                {description}
              </p>
            ) : null}
          </header>
        </Container>
      </Section>
      <Section spacing="default" className={className}>
        <Container size="md">
          {aside ? (
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_16rem] lg:items-start">
              <div>{body}</div>
              <aside className="space-y-6 lg:sticky lg:top-24">{aside}</aside>
            </div>
          ) : (
            <div className={cn(!prose && 'max-w-3xl')}>{body}</div>
          )}
        </Container>
      </Section>
    </>
  );
}
