import { NextResponse, type NextRequest } from 'next/server';

import {
  checkRateLimit,
  formRateLimits,
  rateLimitKeys,
} from '@/lib/rate-limit';
import { newsletterSchema } from '@/lib/validators';

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    'unknown'
  );
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const rateLimit = checkRateLimit(
    rateLimitKeys.newsletter(ip),
    formRateLimits.newsletter,
  );

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      {
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil(rateLimit.retryAfterMs / 1000)),
        },
      },
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body.' },
      { status: 400 },
    );
  }

  const parsed = newsletterSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Enter a valid email address.' },
      { status: 400 },
    );
  }

  // Double-opt-in ready: acknowledge without sending until provider is configured.
  return NextResponse.json({
    success: true,
    message:
      'Thank you. You will receive a confirmation email when double opt-in is enabled.',
  });
}
