import type { NextRequest } from 'next/server';

/** Resolve client IP for rate limiting behind proxies. */
export function getClientIp(request: NextRequest | Request): string {
  const forwarded =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip');

  return forwarded ?? 'unknown';
}

/** Return a safe, generic API error message. */
export function safeApiError(
  error: unknown,
  fallback = 'Something went wrong. Please try again.',
): string {
  if (error instanceof Error && process.env.NODE_ENV === 'development') {
    return error.message;
  }

  return fallback;
}
