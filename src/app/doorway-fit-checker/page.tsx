import type { Metadata } from 'next';
import DoorwayFitCheckerClient from './doorway-fit-checker-client';

export const metadata: Metadata = {
  title: 'Doorway Fit Checker',
  description:
    'Estimate whether furniture packaging may clear doorways, hallways, stairs and elevators. Estimate only — confirm measurements before ordering.',
};

export default function DoorwayFitCheckerPage() {
  return <DoorwayFitCheckerClient />;
}
