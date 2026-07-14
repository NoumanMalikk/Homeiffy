export type LogoVariant = 'horizontal' | 'stacked' | 'monogram' | 'seal';
export type LogoTheme = 'dark' | 'light' | 'single';

export const OFFICIAL_LOGO_SRC = '/brand/official-logo.png';
export const OFFICIAL_MONOGRAM_SRC = '/brand/monogram.png';
export const OFFICIAL_OG_SRC = '/brand/og-brand.png';

export const LOGO_ASPECT: Record<LogoVariant, number> = {
  horizontal: 1024 / 220,
  stacked: 1024 / 220,
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

export function resolveLogoSrc(
  variant: LogoVariant,
  theme: LogoTheme = 'dark',
): string {
  if (variant === 'monogram' || variant === 'seal') {
    return theme === 'light'
      ? '/brand/logo-horizontal-on-dark.png'
      : OFFICIAL_MONOGRAM_SRC;
  }

  if (theme === 'light') {
    return '/brand/logo-horizontal-on-dark.png';
  }

  return OFFICIAL_LOGO_SRC;
}

export function resolveLogoAlt(variant: LogoVariant): string {
  switch (variant) {
    case 'monogram':
      return 'Homeiffy';
    case 'seal':
      return 'Homeiffy • Furniture for Real Rooms';
    default:
      return 'Homeiffy';
  }
}
