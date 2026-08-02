import type { Metadata } from 'next';
import { IBM_Plex_Mono, Manrope, Newsreader } from 'next/font/google';

import { Providers } from '@/components/providers';
import { SiteShell } from '@/components/layout/SiteShell';
import { isStagingMode } from '@/data/store-config';

import './globals.css';

const newsreader = Newsreader({
  variable: '--font-display',
  subsets: ['latin'],
  display: 'swap',
});

const manrope = Manrope({
  variable: '--font-body',
  subsets: ['latin'],
  display: 'swap',
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ?? 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default:
      'Furniture for Living, Bedroom, Dining & Home Office | Homeiffy LLC',
    template: '%s | Homeiffy LLC',
  },
  description:
    'Shop furniture with exact product images, clear dimensions, finish options and practical room-fit tools from Homeiffy LLC.',
  robots: isStagingMode()
    ? { index: false, follow: false }
    : { index: true, follow: true },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-32.png', type: 'image/png', sizes: '32x32' },
      { url: '/icon.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: [{ url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  openGraph: {
    title:
      'Furniture for Living, Bedroom, Dining & Home Office | Homeiffy LLC',
    description:
      'Shop furniture with exact product images, clear dimensions, finish options and practical room-fit tools from Homeiffy LLC.',
    images: [
      {
        url: '/brand/og-brand.png',
        width: 1200,
        height: 630,
        alt: 'Homeiffy',
      },
    ],
    type: 'website',
    locale: 'en_US',
    siteName: 'Homeiffy LLC',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${newsreader.variable} ${manrope.variable} ${ibmPlexMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Providers>
          <SiteShell>{children}</SiteShell>
        </Providers>
      </body>
    </html>
  );
}
