import { createStripeCheckout, verifyStripePayment } from '@/lib/afrique-payment.mjs';
import { recruitmentConfiguration } from '@/lib/afrique-recruitment';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
let windowStarted = Date.now();
let windowCount = 0;

function reply(data: object, status = 200) {
  return Response.json(data, { status, headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' } });
}
function allowedOrigin(request: Request, required = false) {
  const expected = process.env.FINAB_PUBLIC_ORIGIN || 'https://finablasolution.cloud';
  const origin = request.headers.get('origin');
  if ((required && origin !== expected) || (origin && origin !== expected)) return false;
  const fetchSite = request.headers.get('sec-fetch-site');
  return !fetchSite || fetchSite === 'same-origin' || fetchSite === 'none';
}
function rateLimited() {
  const now = Date.now();
  if (now - windowStarted >= 60_000) { windowStarted = now; windowCount = 0; }
  windowCount += 1;
  return windowCount > 30;
}

export async function POST(request: Request) {
  const config = recruitmentConfiguration();
  if (!config.open || !config.paymentReady) return reply({ ok: false, code: 'PAIEMENT_NON_CONFIGURE' }, 503);
  if (!allowedOrigin(request, true)) return reply({ ok: false, code: 'ORIGINE_REFUSEE' }, 403);
  if (request.headers.get('content-type')?.split(';')[0].trim().toLowerCase() !== 'application/json') return reply({ ok: false, code: 'FORMAT_INVALIDE' }, 415);
  if (rateLimited()) return reply({ ok: false, code: 'TROP_DE_TENTATIVES' }, 429);
  const declaredLength = Number(request.headers.get('content-length') || 0);
  if (declaredLength > 2048) return reply({ ok: false, code: 'CORPS_TROP_VOLUMINEUX' }, 413);
  let body: unknown;
  try {
    const text = await request.text();
    if (new TextEncoder().encode(text).byteLength > 2048) return reply({ ok: false, code: 'CORPS_TROP_VOLUMINEUX' }, 413);
    body = JSON.parse(text);
  } catch { return reply({ ok: false, code: 'DONNEES_INVALIDES' }, 400); }
  const submissionId = body && typeof body === 'object' && !Array.isArray(body) ? (body as Record<string, unknown>).submissionId : null;
  if (typeof submissionId !== 'string' || !uuid.test(submissionId)) return reply({ ok: false, code: 'IDENTIFIANT_INVALIDE' }, 400);
  const origin = process.env.FINAB_PUBLIC_ORIGIN || 'https://finablasolution.cloud';
  const callbackUrl = `${origin}/afrique/recrutement`;
  try {
    const result = await createStripeCheckout({ submissionId, successUrl: callbackUrl, cancelUrl: callbackUrl });
    return reply({ ok: true, ...result });
  } catch (error) {
    const code = error instanceof Error ? error.message : '';
    if (code === 'PAIEMENT_A_VERIFIER') return reply({ ok: false, code }, 409);
    if (code === 'PAIEMENT_EN_CREATION') return reply({ ok: false, code }, 409);
    if (code === 'PAIEMENT_NON_CONFIGURE' || code === 'MONTANT_CAD_NON_APPROUVE') return reply({ ok: false, code: 'PAIEMENT_NON_CONFIGURE' }, 503);
    return reply({ ok: false, code: 'CREATION_PAIEMENT_ECHOUEE' }, 502);
  }
}

export async function GET(request: Request) {
  const config = recruitmentConfiguration();
  if (!config.paymentReady) return reply({ ok: false, code: 'PAIEMENT_NON_CONFIGURE', paid: false }, 503);
  if (!allowedOrigin(request)) return reply({ ok: false, code: 'ORIGINE_REFUSEE', paid: false }, 403);
  const url = new URL(request.url);
  const sessionId = url.searchParams.get('sessionId') || url.searchParams.get('session_id') || '';
  const submissionId = url.searchParams.get('submissionId') || '';
  if (!/^cs_(?:test|live)_[A-Za-z0-9]+$/.test(sessionId) || !uuid.test(submissionId)) return reply({ ok: false, paid: false, code: 'PARAMETRES_INVALIDES' }, 400);
  try {
    const paid = await verifyStripePayment({ sessionId, submissionId });
    return reply({ ok: true, paid, sessionId, submissionId });
  } catch {
    return reply({ ok: false, paid: false, code: 'VERIFICATION_PAIEMENT_ECHOUEE' }, 502);
  }
}
