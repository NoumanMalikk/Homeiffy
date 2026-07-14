interface RateLimitEntry {
  count: number;
  resetAt: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterMs: number;
}

export interface RateLimitOptions {
  limit?: number;
  windowMs?: number;
}

const buckets = new Map<string, RateLimitEntry>();

function now(): number {
  return Date.now();
}

function getOrCreateBucket(key: string, windowMs: number): RateLimitEntry {
  const existing = buckets.get(key);
  const current = now();

  if (!existing || existing.resetAt <= current) {
    const entry: RateLimitEntry = {
      count: 0,
      resetAt: current + windowMs,
    };
    buckets.set(key, entry);
    return entry;
  }

  return existing;
}

/**
 * Simple in-memory rate limiter for server actions and route handlers.
 * Resets on process restart; suitable for staging and single-instance deployments.
 */
export function checkRateLimit(
  key: string,
  options: RateLimitOptions = {},
): RateLimitResult {
  const limit = options.limit ?? 5;
  const windowMs = options.windowMs ?? 15 * 60 * 1000;
  const bucket = getOrCreateBucket(key, windowMs);
  const current = now();

  if (bucket.resetAt <= current) {
    bucket.count = 0;
    bucket.resetAt = current + windowMs;
  }

  if (bucket.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterMs: Math.max(bucket.resetAt - current, 0),
    };
  }

  bucket.count += 1;

  return {
    allowed: true,
    remaining: Math.max(limit - bucket.count, 0),
    retryAfterMs: 0,
  };
}

export function resetRateLimit(key: string): void {
  buckets.delete(key);
}

export const rateLimitKeys = {
  contactForm: (ip: string) => `contact:${ip}`,
  quoteRequest: (ip: string) => `quote:${ip}`,
  newsletter: (ip: string) => `newsletter:${ip}`,
  trackOrder: (ip: string) => `track-order:${ip}`,
  checkout: (ip: string) => `checkout:${ip}`,
} as const;

export const formRateLimits = {
  contact: { limit: 5, windowMs: 15 * 60 * 1000 },
  quote: { limit: 3, windowMs: 30 * 60 * 1000 },
  newsletter: { limit: 3, windowMs: 60 * 60 * 1000 },
  trackOrder: { limit: 10, windowMs: 15 * 60 * 1000 },
  checkout: { limit: 10, windowMs: 15 * 60 * 1000 },
} as const;
