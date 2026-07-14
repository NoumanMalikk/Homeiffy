import { Resend } from 'resend';

import { storeConfig } from '@/data/store-config';
import { legalConfig } from '@/data/legal-config';
import type { CreateOrderPayload } from '@/lib/orders';
import type { ContactFormValues, QuoteRequestFormValues } from '@/lib/validators';

let resendClient: Resend | null = null;

function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    return null;
  }

  if (!resendClient) {
    resendClient = new Resend(apiKey);
  }

  return resendClient;
}

export function canSendProductionEmails(): boolean {
  if (!process.env.RESEND_API_KEY) {
    return false;
  }

  if (storeConfig.siteEnv === 'staging') {
    return false;
  }

  if (legalConfig.productionLaunchBlocked) {
    return false;
  }

  return true;
}

function resolveFromAddress(): string {
  return (
    process.env.RESEND_FROM_EMAIL ??
    storeConfig.contactEmail ??
    'orders@homeiffy.example'
  );
}

function resolveNotificationRecipient(): string | null {
  return process.env.CONTACT_EMAIL ?? storeConfig.contactEmail;
}

export interface EmailSendResult {
  sent: boolean;
  id?: string;
  reason?: string;
}

export async function sendOrderConfirmation(
  order: CreateOrderPayload,
): Promise<EmailSendResult> {
  if (!canSendProductionEmails()) {
    return {
      sent: false,
      reason: 'Production email delivery is disabled in staging or pre-launch mode.',
    };
  }

  const resend = getResendClient();

  if (!resend) {
    return { sent: false, reason: 'RESEND_API_KEY is not configured.' };
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ??
    'http://localhost:3000';
  const logoUrl = `${siteUrl}/brand/official-logo.png`;

  const response = await resend.emails.send({
    from: resolveFromAddress(),
    to: order.customer.email,
    subject: `Homeiffy order confirmation ${order.reference}`,
    html: [
      `<div style="font-family:Georgia,serif;color:#252A34;max-width:560px;margin:0 auto;">`,
      `<p style="margin:0 0 24px;background:#000;padding:16px;text-align:center;">`,
      `<img src="${logoUrl}" alt="Homeiffy Furniture" width="280" style="max-width:100%;height:auto;" />`,
      `</p>`,
      `<p>Thank you, ${order.customer.firstName}.</p>`,
      `<p>Your order reference is <strong>${order.reference}</strong>.</p>`,
      `<p>Total: ${order.total.toFixed(2)} ${order.currency}</p>`,
      `<p>We will follow up when fulfillment status changes.</p>`,
      `<p style="margin-top:24px;font-size:14px;color:#62666D;">Homeiffy LLC · ${storeConfig.publicLocationLabel} · ${storeConfig.phoneDisplay}</p>`,
      `</div>`,
    ].join(''),
  });

  if (response.error) {
    return { sent: false, reason: response.error.message };
  }

  return { sent: true, id: response.data?.id };
}

export async function sendContactNotification(
  payload: ContactFormValues,
): Promise<EmailSendResult> {
  if (!canSendProductionEmails()) {
    return {
      sent: false,
      reason: 'Contact notifications are disabled in staging or pre-launch mode.',
    };
  }

  const resend = getResendClient();
  const recipient = resolveNotificationRecipient();

  if (!resend || !recipient) {
    return {
      sent: false,
      reason: 'Email provider or CONTACT_EMAIL is not configured.',
    };
  }

  const response = await resend.emails.send({
    from: resolveFromAddress(),
    to: recipient,
    replyTo: payload.email,
    subject: `[Homeiffy contact] ${payload.subject}`,
    text: [
      `Name: ${payload.name}`,
      `Email: ${payload.email}`,
      payload.phone ? `Phone: ${payload.phone}` : null,
      '',
      payload.message,
    ]
      .filter(Boolean)
      .join('\n'),
  });

  if (response.error) {
    return { sent: false, reason: response.error.message };
  }

  return { sent: true, id: response.data?.id };
}

export async function sendQuoteNotification(
  payload: QuoteRequestFormValues,
): Promise<EmailSendResult> {
  if (!canSendProductionEmails()) {
    return {
      sent: false,
      reason: 'Quote notifications are disabled in staging or pre-launch mode.',
    };
  }

  const resend = getResendClient();
  const recipient = resolveNotificationRecipient();

  if (!resend || !recipient) {
    return {
      sent: false,
      reason: 'Email provider or CONTACT_EMAIL is not configured.',
    };
  }

  const lineSummary = payload.lineItems
    .map(
      (item) =>
        `${item.quantity}× ${item.title} (${item.sku}) finish=${item.finishId ?? 'default'} upholstery=${item.upholsteryId ?? 'default'}`,
    )
    .join('\n');

  const response = await resend.emails.send({
    from: resolveFromAddress(),
    to: recipient,
    replyTo: payload.email,
    subject: `[Homeiffy quote] ${payload.contactName}`,
    text: [
      `Contact: ${payload.contactName}`,
      `Email: ${payload.email}`,
      `Phone: ${payload.phone}`,
      `ZIP: ${payload.shippingPostalCode}`,
      '',
      'Requested items:',
      lineSummary,
      '',
      payload.additionalDetails ?? '',
    ].join('\n'),
  });

  if (response.error) {
    return { sent: false, reason: response.error.message };
  }

  return { sent: true, id: response.data?.id };
}
