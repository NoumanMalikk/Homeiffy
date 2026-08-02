import { DimensionDiagram } from '@/components/product/DimensionDiagram';
import { productSafetyByProductId } from '@/data/product-safety';
import { shippingClassById } from '@/data/shipping-classes';
import type { Product } from '@/lib/types';
import {
  formatDimensions,
  formatInchesCm,
  formatPackageDimensions,
} from '@/lib/utils';

interface ProductSpecsProps {
  product: Product;
}

/** A row is shown only when it has a real value. */
type Row = [label: string, value: string | null | undefined];

function present(rows: Row[]): [string, string][] {
  return rows.filter(
    (row): row is [string, string] =>
      typeof row[1] === 'string' && row[1].trim().length > 0,
  );
}

function countLabel(value: number | null): string | null {
  return value === null ? null : String(value);
}

export function ProductSpecs({ product }: ProductSpecsProps) {
  const safety = productSafetyByProductId[product.id];
  const shippingClass = shippingClassById[product.shippingClass];

  const sections = [
    {
      id: 'dimensions',
      title: 'Dimensions',
      rows: present([
        ['Overall', formatDimensions(product.width, product.height, product.depth)],
        ['Seat width', formatInchesCm(product.seatWidth)],
        ['Seat depth', formatInchesCm(product.seatDepth)],
        ['Seat height', formatInchesCm(product.seatHeight)],
        ['Arm height', formatInchesCm(product.armHeight)],
        ['Back height', formatInchesCm(product.backHeight)],
        ['Under-piece clearance', formatInchesCm(product.clearance)],
        ['Weight', product.weight],
      ]),
      extra: <DimensionDiagram product={product} />,
    },
    {
      id: 'materials',
      title: 'Materials and finish',
      rows: present([
        ['Materials', product.materials],
        ['Wood species', product.woodSpecies],
        ['Construction', product.woodConstruction],
        ['Frame', product.frameMaterial],
        ['Surface finish', product.surfaceFinish],
        ['Upholstery', product.upholsteryMaterial],
        ['Foam', product.foamSpecification],
        ['Country of origin', product.countryOfOrigin],
        ['Manufacturer', product.manufacturer],
      ]),
    },
    {
      id: 'storage',
      title: 'Storage and capacity',
      rows: present([
        ['Storage', product.storageType],
        ['Drawers', countLabel(product.drawerCount)],
        ['Shelves', countLabel(product.shelfCount)],
        ['Doors', countLabel(product.doorCount)],
        ['Seats', countLabel(product.seatingCapacity)],
        ['Adjustability', product.extensionMechanism],
        ['Weight capacity', product.weightCapacity],
        ['Orientation', product.orientation],
      ]),
    },
    {
      id: 'assembly',
      title: 'Assembly',
      rows: present([
        [
          'Assembly required',
          product.assemblyRequired === null
            ? null
            : product.assemblyRequired
              ? 'Yes'
              : 'No, ships ready to use',
        ],
        ['Tools', product.toolsRequired],
        ['Hardware', product.hardwareIncluded],
        ['Instructions', product.assemblyInstructions],
      ]),
    },
    {
      id: 'packaging',
      title: 'Packaging and delivery',
      rows: present([
        ['In the box', product.packageContents],
        ['Number of cartons', countLabel(product.boxCount)],
        ['Carton size', formatPackageDimensions(product.packageDimensions)],
        ['Shipping weight', product.packageWeight],
        ['Shipping class', shippingClass?.name ?? null],
        ['Handling', shippingClass?.description ?? null],
      ]),
    },
    {
      id: 'care',
      title: 'Care',
      rows: present([['Care instructions', product.careInstructions]]),
    },
    {
      id: 'safety',
      title: 'Safety and safe use',
      rows: present([
        ['Tip-over risk', safety?.tipOverRisk],
        ['Wall anchoring', safety?.wallAnchoring],
        ['Weight capacity', safety?.weightCapacity],
        ['Shelf loading', safety?.shelfLoad],
        ['Drawer use', safety?.drawerSafety],
        ['Castors', safety?.casterLocks],
        ['Folding mechanism', safety?.foldingMechanism],
        ['Extension mechanism', safety?.extensionMechanism],
        ['Pinch points', safety?.pinchPoints],
        ['Lid and hinges', safety?.storageHinges],
        ['Glass components', safety?.glassComponents],
        ['Edges', safety?.sharpCorners],
        ['Hardware', safety?.assemblyHardware],
        ['Flammability', safety?.flammabilityDocumentation],
      ]),
      warning: safety?.manufacturerWarnings ?? null,
    },
  ].filter((section) => section.rows.length > 0 || 'extra' in section);

  return (
    <div className="space-y-10">
      <nav aria-label="Product specification sections">
        <ul className="flex flex-wrap gap-2">
          {sections.map((section) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className="inline-block border border-wd-line px-3 py-1 text-sm text-wd-muted transition-colors hover:border-wd-accent hover:text-wd-text"
              >
                {section.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {sections.map((section) => (
        <section
          key={section.id}
          id={section.id}
          aria-labelledby={`${section.id}-heading`}
          className="scroll-mt-28"
        >
          <h2
            id={`${section.id}-heading`}
            className="font-display text-2xl font-medium text-wd-text"
          >
            {section.title}
          </h2>

          {'warning' in section && section.warning ? (
            <p
              role="note"
              className="mt-4 border-l-2 border-wd-accent bg-wd-elevated px-4 py-3 text-sm font-medium text-wd-text"
            >
              {section.warning}
            </p>
          ) : null}

          {'extra' in section && section.extra ? (
            <div className="mt-4">{section.extra}</div>
          ) : null}

          {section.rows.length > 0 ? (
            <div className="mt-4">
              <SpecGrid rows={section.rows} />
            </div>
          ) : null}
        </section>
      ))}
    </div>
  );
}

function SpecGrid({ rows }: { rows: [string, string][] }) {
  return (
    <dl className="divide-y divide-wd-line border border-wd-line">
      {rows.map(([label, value]) => (
        <div
          key={label}
          className="grid gap-1 px-4 py-3 text-sm sm:grid-cols-[13rem_1fr] sm:gap-2"
        >
          <dt className="font-medium text-wd-muted">{label}</dt>
          <dd className="leading-relaxed text-wd-text">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
