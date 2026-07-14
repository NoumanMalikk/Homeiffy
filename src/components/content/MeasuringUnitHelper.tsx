'use client';

import { useState } from 'react';

import { inchesToCm } from '@/lib/utils';

export function MeasuringUnitHelper() {
  const [inches, setInches] = useState('36');

  const numeric = Number.parseFloat(inches);
  const cm =
    Number.isFinite(numeric) && numeric >= 0
      ? inchesToCm(numeric)
      : null;

  return (
    <div className="rounded-lg border border-border-sand bg-cloud-cream/40 p-4 not-prose">
      <p className="text-sm font-medium text-night-ink">
        Inches and centimeters helper
      </p>
      <p className="mt-1 text-sm text-graphite">
        Enter a measurement in inches to see the centimeter equivalent. Product
        dimensions on Homeiffy use inches unless otherwise noted.
      </p>
      <div className="mt-4 flex flex-wrap items-end gap-3">
        <div className="space-y-1">
          <label htmlFor="measuring-inches" className="text-sm text-graphite">
            Inches
          </label>
          <input
            id="measuring-inches"
            type="number"
            min={0}
            step={0.1}
            value={inches}
            onChange={(event) => setInches(event.target.value)}
            className="flex h-11 min-h-[2.75rem] w-32 rounded-md border border-border-sand bg-soft-white px-3 text-sm text-night-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-haven-blue focus-visible:ring-offset-2"
          />
        </div>
        <p className="pb-2 text-sm text-night-ink" aria-live="polite">
          {cm !== null ? (
            <>
              = <strong>{cm} cm</strong>
            </>
          ) : (
            'Enter a valid number'
          )}
        </p>
      </div>
    </div>
  );
}
