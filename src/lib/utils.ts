import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import type { PackageDimensions } from '@/lib/types';

/** Merge Tailwind class names with conflict resolution. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

const INCHES_TO_CM = 2.54;

/** Format a price in USD for customer display. */
export function formatPrice(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/** Format a single dimension value with unit label. */
export function formatDimensionValue(
  value: number | null | undefined,
  unit: 'in' | 'cm' = 'in',
): string | null {
  if (value === null || value === undefined) {
    return null;
  }

  const suffix = unit === 'in' ? '"' : ' cm';
  return `${value}${suffix}`;
}

/** Format available W × D × H dimensions. Omits unknown values. */
export function formatDimensions(
  width: number | null,
  height: number | null,
  depth: number | null,
  unit: 'in' | 'cm' = 'in',
): string {
  const parts: string[] = [];
  const w = formatDimensionValue(width, unit);
  const d = formatDimensionValue(depth, unit);
  const h = formatDimensionValue(height, unit);

  if (w) parts.push(`${w} W`);
  if (d) parts.push(`${d} D`);
  if (h) parts.push(`${h} H`);

  if (parts.length === 0) {
    return '';
  }

  return parts.join(' × ');
}

/** Format package dimensions. */
export function formatPackageDimensions(dims: PackageDimensions): string {
  return formatDimensions(dims.width, dims.height, dims.depth, dims.unit);
}

/** Convert inches to centimeters with one decimal place. */
export function inchesToCm(inches: number): number {
  return Math.round(inches * INCHES_TO_CM * 10) / 10;
}

/** Format a dimension in both inches and centimeters. */
export function formatInchesCm(inches: number | null): string {
  if (inches === null) {
    return '';
  }

  return `${inches}" (${inchesToCm(inches)} cm)`;
}

/** Create a URL-safe slug from a string. */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/** Normalize a SKU for comparison. */
export function normalizeSku(sku: string): string {
  return sku.trim().toUpperCase();
}

/** Format a phone number for tel: links. */
export function formatPhoneLink(e164: string): string {
  return e164.startsWith('+') ? e164 : `+${e164}`;
}

/** Truncate text to a maximum length with ellipsis. */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength - 1).trimEnd()}…`;
}

/** Check whether a value represents pending verification. */
export function isVerificationRequired(
  value: string | null | undefined,
): boolean {
  if (value === null || value === undefined) {
    return true;
  }

  return (
    value === 'Verification required' ||
    value.startsWith('Pending ')
  );
}

/** Sum numeric values, ignoring null. */
export function sumNullable(...values: (number | null)[]): number {
  return values.reduce<number>((acc, value) => {
    if (value === null) {
      return acc;
    }
    return acc + value;
  }, 0);
}

/** Clamp a number between min and max. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
