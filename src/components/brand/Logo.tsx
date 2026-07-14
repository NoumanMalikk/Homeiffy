import Image from 'next/image';
import Link from 'next/link';

import { cn } from '@/lib/utils';

import {
  LOGO_ASPECT,
  LOGO_DEFAULTS,
  type LogoTheme,
  type LogoVariant,
  resolveLogoAlt,
  resolveLogoSrc,
} from './assets';

export type LogoProps = {
  variant?: LogoVariant;
  /** Kept for API compatibility; official gold-on-black artwork is always used. */
  theme?: LogoTheme;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  linkToHome?: boolean;
};

export function Logo({
  variant = 'horizontal',
  theme = 'light',
  className,
  width,
  height,
  priority = false,
  linkToHome = false,
}: LogoProps) {
  const defaults = LOGO_DEFAULTS[variant];
  const resolvedWidth = width ?? defaults.width;
  const resolvedHeight =
    height ??
    (width ? Math.round(width / LOGO_ASPECT[variant]) : defaults.height);

  const src = resolveLogoSrc(variant, theme);
  const alt = resolveLogoAlt(variant);

  const mark = (
    <Image
      src={src}
      alt={alt}
      width={resolvedWidth}
      height={resolvedHeight}
      priority={priority}
      className={cn(
        'h-auto max-h-full w-auto max-w-full select-none object-contain',
        className,
      )}
      sizes={`${resolvedWidth}px`}
    />
  );

  if (!linkToHome) {
    return mark;
  }

  return (
    <Link
      href="/"
      className="inline-flex shrink-0 items-center transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-haven-blue focus-visible:ring-offset-2"
      aria-label="Homeiffy Furniture home"
    >
      {mark}
    </Link>
  );
}
