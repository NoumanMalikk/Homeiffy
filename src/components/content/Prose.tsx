import * as React from 'react';

import { cn } from '@/lib/utils';

export function Prose({
  children,
  className,
  as: Component = 'div',
}: {
  children: React.ReactNode;
  className?: string;
  as?: 'div' | 'article';
}) {
  return (
    <Component
      className={cn(
        'space-y-6 text-base leading-relaxed text-graphite',
        '[&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-medium [&_h2]:text-night-ink [&_h2:first-child]:mt-0',
        '[&_h3]:mt-8 [&_h3]:font-display [&_h3]:text-lg [&_h3]:font-medium [&_h3]:text-night-ink',
        '[&_p]:leading-relaxed',
        '[&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5',
        '[&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-5',
        '[&_li]:leading-relaxed',
        '[&_a]:text-haven-blue [&_a]:underline-offset-4 hover:[&_a]:underline',
        '[&_strong]:font-medium [&_strong]:text-night-ink',
        className,
      )}
    >
      {children}
    </Component>
  );
}
