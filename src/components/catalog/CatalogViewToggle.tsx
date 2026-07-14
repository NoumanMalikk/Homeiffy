'use client';

import { LayoutGrid, LayoutList, Rows3 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useUiStore, type CatalogView } from '@/stores/ui-store';
import { cn } from '@/lib/utils';

const VIEW_OPTIONS: {
  value: CatalogView;
  label: string;
  icon: typeof LayoutGrid;
}[] = [
  { value: 'editorial', label: 'Editorial grid', icon: LayoutGrid },
  { value: 'technical', label: 'Technical grid', icon: Rows3 },
  { value: 'list', label: 'List view', icon: LayoutList },
];

export function CatalogViewToggle({ className }: { className?: string }) {
  const catalogView = useUiStore((state) => state.catalogView);
  const setCatalogView = useUiStore((state) => state.setCatalogView);

  return (
    <div
      className={cn('inline-flex  border border-wd-line', className)}
      role="group"
      aria-label="Catalog view"
    >
      {VIEW_OPTIONS.map((option) => {
        const Icon = option.icon;
        const isActive = catalogView === option.value;

        return (
          <Button
            key={option.value}
            type="button"
            variant={isActive ? 'primary' : 'ghost'}
            size="icon"
            aria-pressed={isActive}
            aria-label={option.label}
            className="rounded-none first:rounded-l-md last:rounded-r-md"
            onClick={() => setCatalogView(option.value)}
          >
            <Icon />
          </Button>
        );
      })}
    </div>
  );
}
