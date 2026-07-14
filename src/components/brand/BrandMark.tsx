import Image from 'next/image';
import Link from 'next/link';

import { cn } from '@/lib/utils';

import { OFFICIAL_MONOGRAM_SRC } from './assets';

export type BrandMarkProps = {
  /** Kept for API compatibility; official crest artwork is always used. */
  theme?: 'dark' | 'light' | 'single';
  size?: number;
  className?: string;
  priority?: boolean;
  linkToHome?: boolean;
};

/** Compact official Homeiffy crest (house mark) for favicons and tight spaces. */
export function BrandMark({
  size = 32,
  className,
  priority = false,
  linkToHome = false,
}: BrandMarkProps) {
  const image = (
    <Image
      src={OFFICIAL_MONOGRAM_SRC}
      alt="Homeiffy Furniture"
      width={size}
      height={size}
      priority={priority}
      className={cn('shrink-0 select-none object-contain', className)}
      sizes={`${size}px`}
    />
  );

  if (!linkToHome) {
    return image;
  }

  return (
    <Link
      href="/"
      className={cn(
        'inline-flex shrink-0 items-center transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-haven-blue focus-visible:ring-offset-2',
        className,
      )}
      aria-label="Homeiffy Furniture home"
    >
      {image}
    </Link>
  );
}
