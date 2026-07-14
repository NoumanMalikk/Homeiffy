import { NextResponse, type NextRequest } from 'next/server';

import { sendQuoteNotification } from '@/lib/email';
import {
  checkRateLimit,
  formRateLimits,
  rateLimitKeys,
} from '@/lib/rate-limit';
import { quoteRequestFormSchema } from '@/lib/validators';

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
    rateLimitKeys.quoteRequest(ip),
    formRateLimits.quote,
  );

  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        error: 'Too many requests. Please try again later.',
        retryAfter: Math.ceil(rateLimit.retryAfterMs / 1000),
      },
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

  const parsed = quoteRequestFormSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Please review the form and correct any errors.' },
      { status: 400 },
    );
  }

  const emailResult = await sendQuoteNotification(parsed.data);

  return NextResponse.json({
    success: true,
    message: emailResult.sent
      ? 'Thank you. Your quote request has been received for structured review.'
      : 'Thank you. Your quote request has been recorded. Email delivery is disabled until production launch and CONTACT_EMAIL is configured.',
  });
}
