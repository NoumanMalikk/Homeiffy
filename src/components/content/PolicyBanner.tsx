import { legalConfig } from '@/data/legal-config';

export function PolicyBanner() {
  if (!legalConfig.productionLaunchBlocked) {
    return null;
  }

  return (
    <div
      role="status"
      className="rounded-lg border border-clay-rose/40 bg-clay-rose/10 px-4 py-3 text-sm text-night-ink"
    >
      <p className="font-medium">Policy pending business review</p>
      <p className="mt-1 text-graphite">
        This page contains placeholder language from the legal configuration and
        must not be treated as final policy until approved by Homeiffy LLC.
      </p>
    </div>
  );
}
