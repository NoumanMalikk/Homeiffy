'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useTransition } from 'react';

import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import {
  buildCatalogQueryString,
  type CatalogFilterOptions,
} from '@/lib/catalog';
import { categories, dailyMoments, rooms, shippingClasses } from '@/lib/catalog';
import type { ExtendedCatalogFilters } from '@/lib/catalog';
import { cn } from '@/lib/utils';

interface FilterSidebarProps {
  filters: ExtendedCatalogFilters;
  options: CatalogFilterOptions;
  className?: string;
}

function toggleArrayValue(values: string[] | undefined, value: string): string[] {
  const current = values ?? [];

  if (current.includes(value)) {
    return current.filter((item) => item !== value);
  }

  return [...current, value];
}

export function FilterSidebar({
  filters,
  options,
  className,
}: FilterSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentParams = Object.fromEntries(searchParams.entries());

  const updateFilters = useCallback(
    (updates: Record<string, string | string[] | null | undefined>) => {
      const query = buildCatalogQueryString(currentParams, updates);
      startTransition(() => {
        router.push(`${pathname}${query}`, { scroll: false });
      });
    },
    [currentParams, pathname, router],
  );

  const filterableCategories = categories.filter(
    (category) => category.parentId !== null,
  );

  return (
    <aside
      className={cn(
        'space-y-8  border border-wd-line bg-wd-elevated p-5 ',
        isPending && 'opacity-70',
        className,
      )}
      aria-label="Catalog filters"
    >
      <FilterGroup title="Daily moment">
        <CheckboxList
          items={dailyMoments.map((moment) => ({
            id: moment.slug,
            label: moment.title,
          }))}
          selected={filters.dailyMoments ?? []}
          onChange={(values) => updateFilters({ moment: values })}
        />
      </FilterGroup>

      <FilterGroup title="Room">
        <CheckboxList
          items={rooms.map((room) => ({
            id: room.slug,
            label: room.title,
          }))}
          selected={filters.rooms ?? []}
          onChange={(values) => updateFilters({ room: values })}
        />
      </FilterGroup>

      <FilterGroup title="Category">
        <CheckboxList
          items={filterableCategories.map((category) => ({
            id: category.slug,
            label: category.title,
          }))}
          selected={filters.subcategories ?? []}
          onChange={(values) => updateFilters({ subcategory: values })}
        />
      </FilterGroup>

      <FilterGroup title="Width (inches)">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="minWidth" className="text-xs">
              Min
            </Label>
            <input
              id="minWidth"
              type="number"
              min={options.widthRange.min}
              max={options.widthRange.max}
              defaultValue={filters.minWidth ?? ''}
              className="mt-1 h-10 w-full  border border-wd-line px-2 text-sm"
              onBlur={(event) =>
                updateFilters({
                  minWidth: event.target.value || null,
                })
              }
            />
          </div>
          <div>
            <Label htmlFor="maxWidth" className="text-xs">
              Max
            </Label>
            <input
              id="maxWidth"
              type="number"
              min={options.widthRange.min}
              max={options.widthRange.max}
              defaultValue={filters.maxWidth ?? ''}
              className="mt-1 h-10 w-full  border border-wd-line px-2 text-sm"
              onBlur={(event) =>
                updateFilters({
                  maxWidth: event.target.value || null,
                })
              }
            />
          </div>
        </div>
      </FilterGroup>

      <FilterGroup title="Wood tone / finish">
        <CheckboxList
          items={options.finishes.map((finish) => ({
            id: finish.id,
            label: finish.label,
          }))}
          selected={filters.finishIds ?? []}
          onChange={(values) => updateFilters({ finish: values })}
        />
      </FilterGroup>

      <FilterGroup title="Upholstery">
        <CheckboxList
          items={options.upholsteries.map((upholstery) => ({
            id: upholstery.id,
            label: upholstery.label,
          }))}
          selected={filters.upholsteryIds ?? []}
          onChange={(values) => updateFilters({ upholstery: values })}
        />
      </FilterGroup>

      <FilterGroup title="Storage features">
        <ToggleRow
          label="Drawers"
          checked={filters.hasDrawers}
          onChange={(value) =>
            updateFilters({
              drawers: value === undefined ? null : String(value),
            })
          }
        />
        <ToggleRow
          label="Shelves"
          checked={filters.hasShelves}
          onChange={(value) =>
            updateFilters({
              shelves: value === undefined ? null : String(value),
            })
          }
        />
        <ToggleRow
          label="Storage"
          checked={filters.hasStorage}
          onChange={(value) =>
            updateFilters({
              storage: value === undefined ? null : String(value),
            })
          }
        />
        <ToggleRow
          label="Expandable"
          checked={filters.isExpandable}
          onChange={(value) =>
            updateFilters({
              expandable: value === undefined ? null : String(value),
            })
          }
        />
      </FilterGroup>

      <FilterGroup title="Assembly">
        <Select
          value={
            filters.assemblyRequired === undefined
              ? ''
              : String(filters.assemblyRequired)
          }
          onChange={(event) =>
            updateFilters({
              assembly: event.target.value || null,
            })
          }
        >
          <option value="">Any</option>
          <option value="true">Assembly required</option>
          <option value="false">No assembly required</option>
        </Select>
      </FilterGroup>

      <FilterGroup title="Shipping class">
        <CheckboxList
          items={shippingClasses.map((shippingClass) => ({
            id: shippingClass.id,
            label: shippingClass.name,
          }))}
          selected={filters.shippingClasses ?? []}
          onChange={(values) => updateFilters({ shipping: values })}
        />
      </FilterGroup>

      <FilterGroup title="Price range">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="minPrice" className="text-xs">
              Min
            </Label>
            <input
              id="minPrice"
              type="number"
              min={options.priceRange.min}
              max={options.priceRange.max}
              defaultValue={filters.minPrice ?? ''}
              className="mt-1 h-10 w-full  border border-wd-line px-2 text-sm"
              onBlur={(event) =>
                updateFilters({
                  minPrice: event.target.value || null,
                })
              }
            />
          </div>
          <div>
            <Label htmlFor="maxPrice" className="text-xs">
              Max
            </Label>
            <input
              id="maxPrice"
              type="number"
              min={options.priceRange.min}
              max={options.priceRange.max}
              defaultValue={filters.maxPrice ?? ''}
              className="mt-1 h-10 w-full  border border-wd-line px-2 text-sm"
              onBlur={(event) =>
                updateFilters({
                  maxPrice: event.target.value || null,
                })
              }
            />
          </div>
        </div>
      </FilterGroup>

      <button
        type="button"
        className="text-sm text-wd-accent underline-offset-4 hover:underline"
        onClick={() => router.push(pathname)}
      >
        Clear all filters
      </button>
    </aside>
  );
}

function FilterGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="font-display text-sm font-medium text-wd-text">
        {title}
      </h3>
      <div className="mt-3 space-y-2">{children}</div>
    </div>
  );
}

function CheckboxList({
  items,
  selected,
  onChange,
}: {
  items: { id: string; label: string }[];
  selected: string[];
  onChange: (values: string[] | null) => void;
}) {
  return (
    <ul className="max-h-48 space-y-2 overflow-y-auto pr-1">
      {items.map((item) => {
        const checked = selected.includes(item.id);

        return (
          <li key={item.id}>
            <label className="flex cursor-pointer items-start gap-2 text-sm">
              <input
                type="checkbox"
                checked={checked}
                className="mt-0.5 size-4 rounded border-wd-line"
                onChange={() => {
                  const next = toggleArrayValue(selected, item.id);
                  onChange(next.length > 0 ? next : null);
                }}
              />
              <span>{item.label}</span>
            </label>
          </li>
        );
      })}
    </ul>
  );
}

function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean | undefined;
  onChange: (value: boolean | undefined) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <span>{label}</span>
      <Select
        value={checked === undefined ? '' : String(checked)}
        className="w-28"
        onChange={(event) => {
          const value = event.target.value;

          if (!value) {
            onChange(undefined);
            return;
          }

          onChange(value === 'true');
        }}
      >
        <option value="">Any</option>
        <option value="true">Yes</option>
        <option value="false">No</option>
      </Select>
    </div>
  );
}
