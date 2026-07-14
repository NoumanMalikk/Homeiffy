import type { Product } from '@/lib/types';
import { formatDimensionValue } from '@/lib/utils';

interface DimensionField {
  key: string;
  label: string;
  value: number | null;
  axis: 'horizontal' | 'vertical' | 'depth';
}

interface DimensionDiagramProps {
  product: Product;
}

export function DimensionDiagram({ product }: DimensionDiagramProps) {
  const fields = (
    [
      { key: 'width', label: 'Width', value: product.width, axis: 'horizontal' as const },
      { key: 'depth', label: 'Depth', value: product.depth, axis: 'depth' as const },
      { key: 'height', label: 'Height', value: product.height, axis: 'vertical' as const },
      {
        key: 'seatWidth',
        label: 'Seat width',
        value: product.seatWidth,
        axis: 'horizontal' as const,
      },
      {
        key: 'seatDepth',
        label: 'Seat depth',
        value: product.seatDepth,
        axis: 'depth' as const,
      },
      {
        key: 'seatHeight',
        label: 'Seat height',
        value: product.seatHeight,
        axis: 'vertical' as const,
      },
      {
        key: 'armHeight',
        label: 'Arm height',
        value: product.armHeight,
        axis: 'vertical' as const,
      },
      {
        key: 'backHeight',
        label: 'Back height',
        value: product.backHeight,
        axis: 'vertical' as const,
      },
      {
        key: 'clearance',
        label: 'Clearance',
        value: product.clearance,
        axis: 'vertical' as const,
      },
    ] satisfies DimensionField[]
  ).filter((field) => field.value !== null);

  if (fields.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border-sand bg-cloud-cream/40 p-6 text-sm text-graphite">
        Dimension diagram unavailable until verified measurements are recorded.
      </div>
    );
  }

  const width = product.width ?? product.seatWidth ?? 48;
  const height = product.height ?? product.backHeight ?? product.seatHeight ?? 32;
  const depth = product.depth ?? product.seatDepth ?? 24;

  const scale = 180 / Math.max(width, height, depth);

  return (
    <figure className="rounded-lg border border-border-sand bg-soft-white p-6">
      <figcaption className="sr-only">
        Dimension diagram for {product.title}
      </figcaption>

      <svg
        viewBox="0 0 320 240"
        role="img"
        aria-labelledby="dimension-diagram-title"
        className="mx-auto w-full max-w-md"
      >
        <title id="dimension-diagram-title">
          {product.title} dimension diagram
        </title>

        <rect
          x="70"
          y="40"
          width={width * scale}
          height={height * scale}
          fill="#F6F1E9"
          stroke="#4A6170"
          strokeWidth="2"
        />

        <polygon
          points={`${70 + width * scale},${40 + height * scale} ${70 + width * scale + depth * scale * 0.35},${40 + height * scale - depth * scale * 0.2} ${70 + depth * scale * 0.35},${40 + height * scale - depth * scale * 0.2}`}
          fill="#D8D0C4"
          stroke="#4A6170"
          strokeWidth="1.5"
        />

        {product.width !== null ? (
          <DimensionLine
            x1={70}
            y1={24}
            x2={70 + width * scale}
            y2={24}
            label={`W ${formatDimensionValue(product.width) ?? ''}`}
          />
        ) : null}

        {product.height !== null ? (
          <DimensionLine
            x1={52}
            y1={40}
            x2={52}
            y2={40 + height * scale}
            label={`H ${formatDimensionValue(product.height) ?? ''}`}
            vertical
          />
        ) : null}

        {product.depth !== null ? (
          <DimensionLine
            x1={70 + width * scale + 8}
            y1={40 + height * scale}
            x2={70 + width * scale + depth * scale * 0.35 + 8}
            y2={40 + height * scale - depth * scale * 0.2}
            label={`D ${formatDimensionValue(product.depth) ?? ''}`}
          />
        ) : null}
      </svg>

      <dl className="mt-6 grid gap-2 sm:grid-cols-2">
        {fields.map((field) => (
          <div
            key={field.key}
            className="flex items-baseline justify-between gap-3 border-b border-border-sand/60 pb-2 text-sm"
          >
            <dt className="text-graphite">{field.label}</dt>
            <dd className="font-mono-data text-night-ink">
              {formatDimensionValue(field.value) ?? '-'}
            </dd>
          </div>
        ))}
      </dl>
    </figure>
  );
}

function DimensionLine({
  x1,
  y1,
  x2,
  y2,
  label,
  vertical = false,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  label: string;
  vertical?: boolean;
}) {
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;

  return (
    <g aria-hidden="true">
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#252A34" strokeWidth="1.5" />
      <text
        x={vertical ? midX - 10 : midX}
        y={vertical ? midY : midY - 6}
        textAnchor="middle"
        className="fill-night-ink text-[10px]"
      >
        {label}
      </text>
    </g>
  );
}
