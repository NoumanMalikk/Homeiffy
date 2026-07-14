export type LogoVariant = 'horizontal' | 'stacked' | 'monogram' | 'seal';
/** `light` = light mark for dark backgrounds; `dark` = dark mark for light backgrounds. */
export type LogoTheme = 'dark' | 'light' | 'single';

export const OFFICIAL_LOGO_SRC = '/brand/logo-horizontal-on-dark.png';
export const OFFICIAL_MONOGRAM_SRC = '/brand/monogram.png';
export const OFFICIAL_OG_SRC = '/brand/og-brand.png';

export const LOGO_ASPECT: Record<LogoVariant, number> = {
  horizontal: 1024 / 205,
  stacked: 1024 / 205,
  monogram: 1,
  seal: 320 / 80,
};

export const LOGO_DEFAULTS: Record<
  LogoVariant,
  { width: number; height: number }
> = {
  horizontal: { width: 180, height: 39 },
  stacked: { width: 180, height: 39 },
  monogram: { width: 40, height: 40 },
  seal: { width: 160, height: 40 },
};

/**
 * Resolve logo artwork.
 * Dark storefront should pass theme="light" (cream wordmark on transparent).
 */
export function resolveLogoSrc(
  variant: LogoVariant,
  theme: LogoTheme = 'light',
): string {
  if (variant === 'monogram') {
    return theme === 'dark' ? '/brand/monogram-dark.png' : OFFICIAL_MONOGRAM_SRC;
  }

  if (variant === 'seal') {
    return '/brand/seal.png';
  }

  // Light-colored wordmark for dark surfaces (transparent PNG).
  if (theme === 'light' || theme === 'single') {
    return '/brand/logo-horizontal-on-dark.png';
  }

  // Dark-colored wordmark for light surfaces.
  return '/brand/official-logo.png';
}

export function resolveLogoAlt(variant: LogoVariant): string {
  switch (variant) {
    case 'monogram':
      return 'Homeiffy';
    case 'seal':
      return 'Homeiffy Furniture for Real Rooms';
    default:
      return 'Homeiffy';
  }
}
