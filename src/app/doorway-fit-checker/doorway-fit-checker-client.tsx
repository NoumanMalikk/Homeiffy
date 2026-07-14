'use client';

import { useMemo, useState } from 'react';

import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Container } from '@/components/ui/container';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Section } from '@/components/ui/section';

type FitResult = 'likely-clear' | 'careful-review' | 'shipping-review';

function evaluateFit(values: Record<string, number>): FitResult {
  const {
    packageWidth,
    packageHeight,
    packageDepth,
    doorwayWidth,
    doorwayHeight,
    hallwayWidth,
    stairWidth,
    stairTurnDepth,
    elevatorWidth,
    elevatorHeight,
    elevatorDepth,
  } = values;

  const packageMinFace = Math.min(packageWidth, packageHeight, packageDepth);
  const packageMidFace = [packageWidth, packageHeight, packageDepth].sort(
    (a, b) => a - b,
  )[1]!;

  if (
    packageMinFace >= doorwayWidth ||
    packageMidFace >= doorwayHeight ||
    packageMinFace >= hallwayWidth
  ) {
    return 'shipping-review';
  }

  const tightDoor = packageMinFace > doorwayWidth - 2;
  const tightHall = packageMinFace > hallwayWidth - 2;
  const tightStair =
    stairWidth > 0 &&
    (packageMinFace > stairWidth - 2 ||
      (stairTurnDepth > 0 && packageMidFace > stairTurnDepth - 2));
  const tightElevator =
    elevatorWidth > 0 &&
    (packageMinFace > elevatorWidth - 2 ||
      packageMidFace > elevatorHeight - 2 ||
      packageMidFace > elevatorDepth - 2);

  if (tightDoor || tightHall || tightStair || tightElevator) {
    return 'careful-review';
  }

  return 'likely-clear';
}

const fields = [
  { id: 'packageWidth', label: 'Package width (in)', defaultValue: '30' },
  { id: 'packageHeight', label: 'Package height (in)', defaultValue: '28' },
  { id: 'packageDepth', label: 'Package depth (in)', defaultValue: '18' },
  { id: 'doorwayWidth', label: 'Doorway width (in)', defaultValue: '32' },
  { id: 'doorwayHeight', label: 'Doorway height (in)', defaultValue: '80' },
  { id: 'hallwayWidth', label: 'Hallway width (in)', defaultValue: '36' },
  { id: 'stairWidth', label: 'Stair width (in)', defaultValue: '0' },
  { id: 'stairTurnDepth', label: 'Stair turning space (in)', defaultValue: '0' },
  { id: 'elevatorWidth', label: 'Elevator width (in)', defaultValue: '0' },
  { id: 'elevatorHeight', label: 'Elevator height (in)', defaultValue: '0' },
  { id: 'elevatorDepth', label: 'Elevator depth (in)', defaultValue: '0' },
] as const;

export default function DoorwayFitCheckerClient() {
  const [form, setForm] = useState<Record<string, string>>(
    Object.fromEntries(fields.map((field) => [field.id, field.defaultValue])),
  );

  const result = useMemo(() => {
    const numeric = Object.fromEntries(
      Object.entries(form).map(([key, value]) => [key, Number(value) || 0]),
    );
    return evaluateFit(numeric);
  }, [form]);

  const resultCopy = {
    'likely-clear': {
      title: 'Likely clear',
      body: 'Based on the numbers entered, the smallest package faces appear smaller than the primary openings.',
    },
    'careful-review': {
      title: 'Requires careful review',
      body: 'Clearances look tight. Re-measure doorways, turns and elevator openings before ordering.',
    },
    'shipping-review': {
      title: 'Shipping review required',
      body: 'Configured dimensions suggest the package may not clear one or more openings. Contact Homeiffy for shipping review before ordering.',
    },
  }[result];

  return (
    <Section spacing="default" background="white">
      <Container size="md">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Doorway Fit Checker', href: '/doorway-fit-checker' },
          ]}
          className="mb-6"
        />
        <header className="mb-8">
          <h1 className="font-display text-3xl font-medium text-room-ink sm:text-4xl">
            Doorway fit checker
          </h1>
          <p className="mt-3 text-base leading-relaxed text-soft-graphite">
            This tool provides an estimate only. Confirm package and access
            measurements before ordering. Homeiffy does not guarantee fit.
          </p>
        </header>

        <form
          className="grid gap-4 sm:grid-cols-2"
          onSubmit={(event) => event.preventDefault()}
        >
          {fields.map((field) => (
            <div key={field.id} className="space-y-2">
              <Label htmlFor={field.id}>{field.label}</Label>
              <Input
                id={field.id}
                type="number"
                min={0}
                value={form[field.id]}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    [field.id]: event.target.value,
                  }))
                }
              />
            </div>
          ))}
        </form>

        <div
          className="mt-8 rounded-2xl border border-border-sand bg-canvas-cream/50 p-6"
          role="status"
          aria-live="polite"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-warm-mustard">
            Estimate
          </p>
          <h2 className="mt-2 font-display text-2xl text-room-ink">
            {resultCopy.title}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-soft-graphite">
            {resultCopy.body}
          </p>
        </div>
      </Container>
    </Section>
  );
}
