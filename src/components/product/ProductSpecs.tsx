import { productSafetyByProductId } from '@/data/product-safety';
import { shippingClassById } from '@/data/shipping-classes';
import { imageCreditsByProductId } from '@/data/image-credits';
import { DimensionDiagram } from '@/components/product/DimensionDiagram';
import type { Product } from '@/lib/types';
import {
  formatDimensions,
  formatInchesCm,
  formatPackageDimensions,
  isVerificationRequired,
} from '@/lib/utils';

interface ProductSpecsProps {
  product: Product;
}

export function ProductSpecs({ product }: ProductSpecsProps) {
  const safety = productSafetyByProductId[product.id];
  const imageCredit = imageCreditsByProductId[product.id];
  const shippingClass = shippingClassById[product.shippingClass];

  const sections = [
    {
      id: 'overview',
      title: 'Overview',
      content: (
        <SpecGrid
          rows={[
            ['Style', product.style],
            ['Category', product.category],
            ['Subcategory', product.subcategory],
            ['Supplier SKU', String(product.supplierSku)],
          ]}
        />
      ),
    },
    {
      id: 'dimensions',
      title: 'Dimensions',
      content: (
        <div className="space-y-6">
          <DimensionDiagram product={product} />
          <SpecGrid
            rows={[
              ['Overall', formatDimensions(product.width, product.height, product.depth)],
              ['Seat width', formatInchesCm(product.seatWidth)],
              ['Seat depth', formatInchesCm(product.seatDepth)],
              ['Seat height', formatInchesCm(product.seatHeight)],
              ['Arm height', formatInchesCm(product.armHeight)],
              ['Back height', formatInchesCm(product.backHeight)],
              ['Clearance', formatInchesCm(product.clearance)],
              ['Weight', String(product.weight)],
            ]}
          />
        </div>
      ),
    },
    {
      id: 'materials',
      title: 'Materials',
      content: (
        <SpecGrid
          rows={[
            ['Materials', String(product.materials)],
            ['Wood species', String(product.woodSpecies)],
            ['Wood construction', String(product.woodConstruction)],
            ['Frame material', String(product.frameMaterial)],
            ['Surface finish', String(product.surfaceFinish)],
            ['Upholstery material', String(product.upholsteryMaterial)],
            ['Foam specification', String(product.foamSpecification)],
            ['Country of origin', String(product.countryOfOrigin)],
            ['Manufacturer', String(product.manufacturer)],
          ]}
        />
      ),
    },
    {
      id: 'finish-upholstery',
      title: 'Finish & upholstery',
      content: (
        <ul className="space-y-2">
          {product.colorways.map((colorway) => (
            <li
              key={colorway.id}
              className="flex items-center justify-between border-b border-border-sand/60 py-2 text-sm"
            >
              <span>
                {colorway.label}{' '}
                <span className="text-graphite">({colorway.type})</span>
              </span>
              <span
                className="size-5 rounded-full border border-border-sand"
                style={{ backgroundColor: colorway.hex }}
                aria-hidden="true"
              />
            </li>
          ))}
        </ul>
      ),
    },
    {
      id: 'storage',
      title: 'Storage',
      content: (
        <SpecGrid
          rows={[
            ['Storage type', product.storageType ? String(product.storageType) : 'Not applicable'],
            ['Drawer count', product.drawerCount === null ? 'Verification required' : String(product.drawerCount)],
            ['Shelf count', product.shelfCount === null ? 'Verification required' : String(product.shelfCount)],
            ['Door count', product.doorCount === null ? 'Verification required' : String(product.doorCount)],
            ['Orientation', product.orientation ?? 'Not applicable'],
          ]}
        />
      ),
    },
    {
      id: 'assembly',
      title: 'Assembly',
      content: (
        <SpecGrid
          rows={[
            ['Assembly required', String(product.assemblyRequired)],
            ['Instructions', String(product.assemblyInstructions)],
            ['Hardware included', String(product.hardwareIncluded)],
            ['Tools required', String(product.toolsRequired)],
            ['Weight capacity', String(product.weightCapacity)],
            ['Seating capacity', product.seatingCapacity === null ? 'Not applicable' : String(product.seatingCapacity)],
            ['Extension mechanism', product.extensionMechanism ? String(product.extensionMechanism) : 'Not applicable'],
          ]}
        />
      ),
    },
    {
      id: 'package-contents',
      title: 'Package contents',
      content: (
        <SpecGrid
          rows={[
            ['Contents', String(product.packageContents)],
            ['Box count', String(product.boxCount)],
            ['Package dimensions', formatPackageDimensions(product.packageDimensions)],
            ['Package weight', String(product.packageWeight)],
          ]}
        />
      ),
    },
    {
      id: 'care',
      title: 'Care',
      content: <p className="text-sm leading-relaxed text-graphite">{String(product.careInstructions)}</p>,
    },
    {
      id: 'safety',
      title: 'Safety',
      content: safety ? (
        <SpecGrid
          rows={[
            ['Weight capacity', String(safety.weightCapacity)],
            ['Tip-over risk', String(safety.tipOverRisk)],
            ['Wall anchoring', String(safety.wallAnchoring)],
            ['Drawer safety', String(safety.drawerSafety)],
            ['Shelf load', String(safety.shelfLoad)],
            ['Recall status', String(safety.recallStatus)],
            ['Verification status', safety.verificationStatus],
            ['Notes', safety.notes],
          ]}
        />
      ) : (
        <p className="text-sm text-graphite">
          Safety record pending for this product.
        </p>
      ),
    },
    {
      id: 'shipping',
      title: 'Shipping',
      content: (
        <SpecGrid
          rows={[
            ['Shipping class', shippingClass?.name ?? product.shippingClass],
            ['Description', shippingClass?.description ?? 'Verification required'],
            ['Freight review', shippingClass?.requiresFreightReview ? 'May be required' : 'Standard handling'],
            ['Upholstered handling', shippingClass?.upholsteredHandling ? 'Yes' : 'No'],
            ['Fragile handling', shippingClass?.fragileHandling ? 'Yes' : 'No'],
          ]}
        />
      ),
    },
    {
      id: 'verification',
      title: 'Product verification',
      content: (
        <SpecGrid
          rows={[
            ['Image verification', product.imageVerificationStatus],
            ['Image source record', String(product.imageSourceRecord)],
            ['Specification verification', product.specificationVerificationStatus],
            ['Safety verification', product.safetyVerificationStatus],
            ['Production ready', product.productionReady ? 'Yes' : 'No'],
            [
              'Exact dimensions on file',
              imageCredit?.exactDimensions ?? 'Pending verification',
            ],
            [
              'Exact configuration on file',
              imageCredit?.exactConfiguration ?? 'Pending verification',
            ],
            [
              'Exact finish on file',
              imageCredit?.exactFinish ?? 'Pending verification',
            ],
            [
              'Exact upholstery on file',
              imageCredit?.exactUpholstery ?? 'Pending verification',
            ],
            ['Warnings', String(product.warnings)],
          ]}
        />
      ),
    },
  ];

  return (
    <div className="space-y-10">
      <nav aria-label="Product specification sections">
        <ul className="flex flex-wrap gap-2">
          {sections.map((section) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className="rounded-full border border-border-sand px-3 py-1 text-sm text-haven-blue hover:bg-cloud-cream"
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
            className="font-display text-2xl font-medium text-night-ink"
          >
            {section.title}
          </h2>
          <div className="mt-4">{section.content}</div>
        </section>
      ))}
    </div>
  );
}

function SpecGrid({ rows }: { rows: [string, string][] }) {
  return (
    <dl className="divide-y divide-border-sand/60 rounded-lg border border-border-sand">
      {rows.map(([label, value]) => (
        <div
          key={label}
          className="grid gap-2 px-4 py-3 text-sm sm:grid-cols-[12rem_1fr]"
        >
          <dt className="font-medium text-graphite">{label}</dt>
          <dd className="text-night-ink">
            {isVerificationRequired(value) ? (
              <span className="text-graphite">{value}</span>
            ) : (
              value
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}
