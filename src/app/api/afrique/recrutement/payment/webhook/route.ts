import { recordStripeWebhook } from '@/lib/afrique-payment.mjs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function reply(data: object, status = 200) {
  return Response.json(data, { status, headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' } });
}

export async function POST(request: Request) {
  if (request.headers.get('content-type')?.split(';')[0].trim().toLowerCase() !== 'application/json') {
    return reply({ received: false, code: 'FORMAT_INVALIDE' }, 415);
  }
  let rawBody: string;
  try {
    rawBody = await request.text();
    if (new TextEncoder().encode(rawBody).byteLength > 1_000_000) return reply({ received: false, code: 'CORPS_TROP_VOLUMINEUX' }, 413);
  } catch {
    return reply({ received: false, code: 'CORPS_INVALIDE' }, 400);
  }
  try {
    const result = await recordStripeWebhook({ rawBody, signatureHeader: request.headers.get('stripe-signature') || '' });
    return reply({ received: result.received });
  } catch (error) {
    const code = error instanceof Error ? error.message : '';
    if (code === 'SIGNATURE_WEBHOOK_INVALIDE' || code === 'EVENEMENT_STRIPE_INVALIDE') {
      return reply({ received: false, code: 'WEBHOOK_REFUSE' }, 400);
    }
    return reply({ received: false, code: 'WEBHOOK_INDISPONIBLE' }, 500);
  }
}
