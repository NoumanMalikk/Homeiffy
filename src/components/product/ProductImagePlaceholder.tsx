'use client';

import Image from 'next/image';

import { getBlurDataUrl } from '@/data/image-blur';
import { cn } from '@/lib/utils';

/**
 * Shown only when a product has no studio photography path on file.
 */
export function ProductImagePlaceholder({
  className,
  label = 'Studio photography in progress',
}: {
  className?: string;
  label?: string;
}) {
  return (
    <div
      className={cn(
        'flex aspect-square w-full flex-col items-center justify-center gap-3 bg-gradient-to-b from-wd-hover to-wd-black p-6 text-center',
        className,
      )}
    >
      <svg
        viewBox="0 0 48 48"
        aria-hidden="true"
        className="size-10 text-wd-accent/50"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="5" y="14" width="38" height="26" rx="2" />
        <path d="M5 33l10-9 7 6 6-7 15 12" />
        <circle cx="17" cy="22" r="2.5" />
        <path d="M14 14V9h20v5" />
      </svg>
      <p className="text-xs leading-relaxed text-wd-muted">{label}</p>
    </div>
  );
}

export function ProductCardImage({
  src,
  alt,
  verified = true,
  priority = false,
  className,
}: {
  src: string;
  alt: string;
  /** When false and no usable src, show placeholder. Prefer showing catalog images. */
  verified?: boolean;
  /** Set on above-the-fold cards so they load eagerly instead of lazily. */
  priority?: boolean;
  className?: string;
}) {
  const hasSrc =
    Boolean(src) && !src.includes('placeholder') && src.trim().length > 0;

  if (!hasSrc) {
    return <ProductImagePlaceholder className={className} />;
  }

  const blurDataURL = getBlurDataUrl(src);

  return (
    <div
      className={cn(
        'product-image-box relative aspect-square w-full overflow-hidden bg-gradient-to-b from-[#242424] to-[#121212]',
        className,
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        className="object-contain p-3 transition-transform duration-300 group-hover:scale-[1.03] sm:p-4"
        priority={priority}
        loading={priority ? 'eager' : 'lazy'}
        // Catalog WebPs are already optimized. Serving them statically avoids
        // blank cards when the image optimizer/CDN fails on a subset of files.
        unoptimized
        {...(blurDataURL ? { placeholder: 'blur' as const, blurDataURL } : {})}
      />
      {!verified ? (
        <span className="sr-only">Catalog image pending final verification</span>
      ) : null}
    </div>
  );
}
