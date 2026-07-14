import { NextResponse, type NextRequest } from 'next/server';

import { sendContactNotification } from '@/lib/email';
import {
  checkRateLimit,
  formRateLimits,
  rateLimitKeys,
} from '@/lib/rate-limit';
import { contactFormSchema } from '@/lib/validators';

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
    rateLimitKeys.contactForm(ip),
    formRateLimits.contact,
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

  const parsed = contactFormSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Please review the form and correct any errors.' },
      { status: 400 },
    );
  }

  const emailResult = await sendContactNotification(parsed.data);

  return NextResponse.json({
    success: true,
    message: emailResult.sent
      ? 'Thank you. Your message has been received.'
      : 'Thank you. Your inquiry has been recorded. Email delivery is disabled until production launch and CONTACT_EMAIL is configured.',
  });
}
