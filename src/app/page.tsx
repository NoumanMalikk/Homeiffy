import type { Metadata } from 'next';

import { AboutStoreBand } from '@/components/home/AboutStoreBand';
import { DarkHeroSlider } from '@/components/home/DarkHeroSlider';
import { FeaturedCategories } from '@/components/home/FeaturedCategories';
import { FeaturedFurniture } from '@/components/home/FeaturedFurniture';
import { GuidesStrip } from '@/components/home/GuidesStrip';
import { NewsletterSignup } from '@/components/home/NewsletterSignup';
import { ProductSpotlights } from '@/components/home/ProductSpotlights';
import { HowOrderingWorks } from '@/components/home/HowOrderingWorks';

export const metadata: Metadata = {
  title: {
    absolute:
      'Furniture for Living, Bedroom, Dining & Home Office | Homeiffy LLC',
  },
  description:
    'Shop furniture with exact product images, clear dimensions, finish options and practical room-fit tools from Homeiffy LLC.',
  openGraph: {
    title:
      'Furniture for Living, Bedroom, Dining & Home Office | Homeiffy LLC',
    description:
      'Shop furniture with exact product images, clear dimensions, finish options and practical room-fit tools from Homeiffy LLC.',
  },
};

export default function HomePage() {
  return (
    <>
      <DarkHeroSlider />
      <FeaturedCategories />
      <FeaturedFurniture />
      <ProductSpotlights />
      <AboutStoreBand />
      <HowOrderingWorks />
      <GuidesStrip />
      <NewsletterSignup />
    </>
  );
}
