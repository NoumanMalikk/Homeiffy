import type { MetadataRoute } from 'next';

import { isStagingMode } from '@/data/store-config';

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ??
  'http://localhost:3000';

export default function robots(): MetadataRoute.Robots {
  if (isStagingMode()) {
    return {
      rules: [
        {
          userAgent: '*',
          disallow: '/',
        },
      ],
    };
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/cart',
          '/checkout',
          '/order/success',
          '/track-order',
          '/wishlist',
          '/compare',
          '/room-builder',
          '/room-rhythm-builder',
          '/room-board',
          '/room-fit-finder',
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
