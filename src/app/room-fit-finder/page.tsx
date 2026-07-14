import type { Metadata } from 'next';
import RoomFitFinderClient from './room-fit-finder-client';

export const metadata: Metadata = {
  title: 'Room Fit Finder',
  description:
    'Find Homeiffy furniture that matches your room width, depth and doorway measurements. Estimates only — confirm before ordering.',
};

export default function RoomFitFinderPage() {
  return <RoomFitFinderClient />;
}
