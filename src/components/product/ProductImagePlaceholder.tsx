'use client';

import Image from 'next/image';

import { cn } from '@/lib/utils';

export function ProductImagePlaceholder({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex aspect-square w-full items-center justify-center bg-white p-4 text-center',
        className,
      )}
    >
      <p className="text-xs leading-relaxed text-graphite">
        Exact product image required
      </p>
    </div>
  );
}

export function ProductCardImage({
  src,
  alt,
  verified = true,
  className,
}: {
  src: string;
  alt: string;
  /** When false and no usable src, show placeholder. Prefer showing catalog images. */
  verified?: boolean;
  className?: string;
}) {
  const hasSrc =
    Boolean(src) &&
    !src.includes('placeholder') &&
    src.trim().length > 0;

  if (!hasSrc) {
    return <ProductImagePlaceholder className={className} />;
  }

  return (
    <div
      className={cn(
        'relative aspect-square w-full overflow-hidden bg-white',
        className,
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        className="object-contain p-4 transition-transform duration-300 group-hover:scale-[1.02]"
        priority={false}
      />
      {!verified ? (
        <span className="sr-only">Catalog image pending final verification</span>
      ) : null}
    </div>
  );
}
