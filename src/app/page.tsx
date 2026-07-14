import type { Metadata } from 'next';

import { SignatureHero } from '@/components/home/DayToHavenHero';
import { FeaturedFurniture } from '@/components/home/FeaturedFurniture';
import { HowOrderingWorks } from '@/components/home/HowOrderingWorks';
import { MaterialMood } from '@/components/home/MaterialMood';
import { MeasureFirstBand } from '@/components/home/MeasureFirstBand';
import { NewsletterSignup } from '@/components/home/NewsletterSignup';
import { QuoteRequestBand } from '@/components/home/QuoteRequestBand';
import { RoomRhythmPreview } from '@/components/home/RoomRhythmPreview';
import { ShopByFootprint } from '@/components/home/ShopByFootprint';
import { ShopByRoom } from '@/components/home/ShopByRoom';
import {
  ExactProductView,
  RoomEditSection,
  RoomFitPreview,
  TransformingFurniture,
} from '@/components/home/RoomEditSection';

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
      <SignatureHero />
      <ShopByRoom />
      <ShopByFootprint />
      <FeaturedFurniture />
      <ExactProductView />
      <RoomFitPreview />
      <RoomEditSection
        eyebrow="Living room"
        title="A living-room edit for everyday seating and storage"
        description="Sofa, loveseat, modular seating, lounge chair, storage ottoman, lift-top coffee table and media console."
        skus={[
          'HMF-LIV-001',
          'HMF-LIV-002',
          'HMF-LIV-003',
          'HMF-LIV-004',
          'HMF-LIV-006',
          'HMF-LIV-007',
          'HMF-LIV-009',
        ]}
        href="/collections/living-room"
      />
      <TransformingFurniture />
      <RoomEditSection
        eyebrow="Bedroom"
        title="A bedroom edit built around rest and storage"
        description="Platform bed, storage bed, nightstand, dresser, bedroom bench and compact wardrobe."
        skus={[
          'HMF-BED-001',
          'HMF-BED-002',
          'HMF-BED-003',
          'HMF-BED-004',
          'HMF-BED-005',
          'HMF-BED-006',
        ]}
        href="/collections/bedroom"
        accent="olive"
      />
      <RoomEditSection
        eyebrow="Dining"
        title="A dining edit for compact and extendable layouts"
        description="Round dining table, extendable table, chair pair, dining bench and sideboard."
        skus={[
          'HMF-DIN-001',
          'HMF-DIN-002',
          'HMF-DIN-003',
          'HMF-DIN-004',
          'HMF-DIN-005',
        ]}
        href="/collections/dining"
      />
      <RoomEditSection
        eyebrow="Entryway"
        title="An entryway edit for narrow walls and daily storage"
        description="Narrow console, shoe cabinet, storage bench, hall tree and tall shelving."
        skus={[
          'HMF-ENT-001',
          'HMF-ENT-002',
          'HMF-ENT-003',
          'HMF-ENT-004',
          'HMF-STO-001',
        ]}
        href="/collections/entryway"
        accent="olive"
      />
      <RoomRhythmPreview />
      <MaterialMood />
      <MeasureFirstBand />
      <HowOrderingWorks />
      <QuoteRequestBand />
      <NewsletterSignup />
    </>
  );
}
