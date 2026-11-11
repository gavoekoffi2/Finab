import { createHmac, createHash, timingSafeEqual } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

export const DOSSIER_FEE_XOF = 25000;
export const PAYMENT_CURRENCY = "CAD";
const UUID_V4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const STRIPE_SESSION_ID = /^cs_(?:test|live)_[A-Za-z0-9]+$/;
let journalQueue = Promise.resolve();

export function configuredCadAmountCents(env = process.env) {
  const value = String(env.FINAB_AFRIQUE_FEE_CAD_CENTS || "");
  if (!/^\d{1,8}$/.test(value)) return 0;
  const amount = Number(value);
  return Number.isSafeInteger(amount) && amount >= 50 ? amount : 0;
}

export function approvedPaymentTerms(env = process.env) {
  const text = env.FINAB_AFRIQUE_PAYMENT_TERMS_TEXT || "";
  const version = env.FINAB_AFRIQUE_PAYMENT_TERMS_VERSION || "";
  const hash = createHash("sha256").update(text).digest("hex");
  const ready = text.trim().length > 0 && text.length <= 10000
    && /^[a-zA-Z0-9._-]{1,30}$/.test(version)
    && env.FINAB_AFRIQUE_PAYMENT_TERMS_APPROVED_SHA256 === hash;
  return { ready, text: ready ? text : "", version: ready ? version : "" };
}

function stripeEnvironment(env) {
  const environment = env.STRIPE_ENVIRONMENT || "";
  const secretKey = env.STRIPE_SECRET_KEY || "";
  if (!["test", "live"].includes(environment)) return null;
  if (!new RegExp(`^sk_${environment}_[A-Za-z0-9]+$`).test(secretKey)) return null;
  return { environment, secretKey };
}

export function isPaymentCollectionReady(env = process.env) {
  const stripe = stripeEnvironment(env);
  return env.FINAB_AFRIQUE_PAYMENT_ENABLED === "true"
    && Boolean(stripe)
    && /^whsec_[A-Za-z0-9_+/=-]+$/.test(env.STRIPE_WEBHOOK_SECRET || "")
    && configuredCadAmountCents(env) > 0
    && env.FINAB_AFRIQUE_FEE_CAD_APPROVED === "true"
    && /^[A-Z]{2}$/.test(env.FINAB_STRIPE_ACCOUNT_COUNTRY || "")
    && env.FINAB_STRIPE_ACCOUNT_COUNTRY_VERIFIED === "true"
    && approvedPaymentTerms(env).ready
    && env.FINAB_AFRIQUE_COLLECTION_COUNTRIES_APPROVED === "true"
    && env.FINAB_AFRIQUE_PAYMENT_DOWNSTREAM_VERIFIED === "true";
}

function validateReturnUrl(value) {
  const url = new URL(value);
  if (url.protocol !== "https:" || url.hostname !== "finablasolution.cloud" || url.pathname !== "/afrique/recrutement") {
    throw new Error("URL de retour Stripe refusée.");
  }
  return url;
}

export function buildStripeCheckoutForm({ submissionId, successUrl, cancelUrl, amountCadCents }) {
  if (!UUID_V4.test(String(submissionId || ""))) throw new Error("Identifiant de candidature invalide.");
  if (!Number.isSafeInteger(amountCadCents) || amountCadCents < 50 || amountCadCents > 99999999) throw new Error("Montant CAD invalide.");
  const success = validateReturnUrl(successUrl);
  const cancel = validateReturnUrl(cancelUrl);
  success.searchParams.set("payment", "return");
  success.searchParams.set("submissionId", submissionId);
  success.searchParams.set("session_id", "{CHECKOUT_SESSION_ID}");
  cancel.searchParams.set("payment", "cancel");
  cancel.searchParams.set("submissionId", submissionId);

  const form = new URLSearchParams({
    mode: "payment",
    success_url: success.toString().replace(/%7BCHECKOUT_SESSION_ID%7D/i, "{CHECKOUT_SESSION_ID}"),
    cancel_url: cancel.toString(),
    client_reference_id: submissionId,
    "line_items[0][quantity]": "1",
    "payment_method_types[0]": "card",
    "line_items[0][price_data][currency]": "cad",
    "line_items[0][price_data][unit_amount]": String(amountCadCents),
    "line_items[0][price_data][product_data][name]": "Frais d’étude de dossier — recrutement FINAB Afrique",
    "line_items[0][price_data][product_data][description]": "Frais d’étude de dossier uniquement. Ne garantit ni sélection, ni embauche, ni recrutement.",
    "metadata[submission_id]": submissionId,
    "metadata[fee_type]": "dossier_review",
    "metadata[reference_amount_xof]": String(DOSSIER_FEE_XOF),
    "metadata[fee_currency]": PAYMENT_CURRENCY,
    "payment_intent_data[metadata][submission_id]": submissionId,
    "payment_intent_data[metadata][fee_type]": "dossier_review",
  });
  return form;
}

export function isVerifiedStripeCheckoutSession(session, { sessionId, submissionId, amountCadCents, environment }) {
  if (!session || typeof session !== "object") return false;
  const metadata = session.metadata && typeof session.metadata === "object" ? session.metadata : {};
  return String(session.id || "") === String(sessionId)
    && STRIPE_SESSION_ID.test(String(session.id || ""))
    && session.mode === "payment"
    && session.status === "complete"
    && session.payment_status === "paid"
    && String(session.currency || "").toLowerCase() === "cad"
    && Number(session.amount_total) === amountCadCents
    && Boolean(session.livemode) === (environment === "live")
    && session.client_reference_id === submissionId
    && metadata.submission_id === submissionId
    && metadata.fee_type === "dossier_review"
    && metadata.fee_currency === PAYMENT_CURRENCY
    && Number(metadata.reference_amount_xof) === DOSSIER_FEE_XOF;
}

function journalPath(dataDir, env) {
  return path.join(dataDir || env.FINAB_DATA_DIR || path.join(process.cwd(), "data"), "afrique-payment-sessions.json");
}

async function withJournal(file, change) {
  const task = journalQueue.then(async () => {
    await mkdir(path.dirname(file), { recursive: true, mode: 0o700 });
    let rows = [];
    try {
      const parsed = JSON.parse(await readFile(file, "utf8"));
      if (Array.isArray(parsed)) rows = parsed;
    } catch (error) {
      if (error?.code !== "ENOENT") throw error;
    }
    const result = await change(rows);
    const temporary = `${file}.${process.pid}.${Date.now()}.tmp`;
    await writeFile(temporary, JSON.stringify(rows), { encoding: "utf8", mode: 0o600 });
    await rename(temporary, file);
    return result;
  });
  journalQueue = task.catch(() => undefined);
  return task;
}

async function stripeJson(fetchImpl, url, secretKey, init = {}) {
  const response = await fetchImpl(url, {
    ...init,
    headers: { Authorization: `Bearer ${secretKey}`, ...(init.headers || {}) },
    cache: "no-store",
    signal: AbortSignal.timeout(20000),
  });
  let body;
  try { body = await response.json(); } catch { throw new Error("REPONSE_STRIPE_INVALIDE"); }
  if (!response.ok) throw new Error("REQUETE_STRIPE_REFUSEE");
  return body;
}

function requireStripeConfig(env) {
  const stripe = stripeEnvironment(env);
  if (!stripe) throw new Error("PAIEMENT_NON_CONFIGURE");
  return stripe;
}

export async function createStripeCheckout({ submissionId, successUrl, cancelUrl, env = process.env, fetchImpl = globalThis.fetch, dataDir = undefined }) {
  const { secretKey } = requireStripeConfig(env);
  const amountCadCents = configuredCadAmountCents(env);
  if (!amountCadCents || env.FINAB_AFRIQUE_FEE_CAD_APPROVED !== "true") throw new Error("MONTANT_CAD_NON_APPROUVE");
  if (!UUID_V4.test(String(submissionId || ""))) throw new Error("IDENTIFIANT_INVALIDE");
  const file = journalPath(dataDir, env);
  const reservation = await withJournal(file, (rows) => {
    const current = rows.find((row) => row.submissionId === submissionId);
    if (current?.status === "manual_review") return { kind: "review", record: current };
    if (current?.status === "approved" && current.sessionId) return { kind: "paid", record: current };
    if (current?.status === "pending" && current.amountCadCents !== amountCadCents) return { kind: "review", record: current };
    if (current?.status === "creating" && Date.now() - Date.parse(current.updatedAt || current.createdAt) < 60000) return { kind: "busy", record: current };
    if (current?.status === "pending" && current.checkoutUrl) return { kind: "ready", record: current };
    if (current?.status === "creating" && current.attempt) return { kind: "retry", record: current };
    const attempt = (current?.attempt || 0) + 1;
    if (attempt > 5) return { kind: "limit", record: current };
    const record = { submissionId, attempt, amountCadCents, status: "creating", sessionId: "", checkoutUrl: "", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    if (current) rows[rows.indexOf(current)] = record;
    else rows.push(record);
    return { kind: "create", record };
  });
  if (reservation.kind === "review") throw new Error("PAIEMENT_A_VERIFIER");
  if (reservation.kind === "paid") return { alreadyPaid: true, sessionId: reservation.record.sessionId };
  if (reservation.kind === "busy") throw new Error("PAIEMENT_EN_CREATION");
  if (reservation.kind === "limit") throw new Error("TROP_DE_TENTATIVES");
  if (reservation.kind === "ready") return { url: reservation.record.checkoutUrl, sessionId: reservation.record.sessionId };

  const record = reservation.record;
  const idempotencyKey = `finab-afrique-dossier-${submissionId}-${record.attempt}`;
  const form = buildStripeCheckoutForm({ submissionId, successUrl, cancelUrl, amountCadCents: record.amountCadCents });
  try {
    const session = await stripeJson(fetchImpl, "https://api.stripe.com/v1/checkout/sessions", secretKey, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded", "Idempotency-Key": idempotencyKey },
      body: form.toString(),
    });
    if (!STRIPE_SESSION_ID.test(String(session?.id || "")) || typeof session.url !== "string" || !/^https:\/\/checkout\.stripe\.com\//.test(session.url)) {
      throw new Error("SESSION_STRIPE_INVALIDE");
    }
    const updated = { ...record, sessionId: session.id, checkoutUrl: session.url, status: "pending", updatedAt: new Date().toISOString() };
    await withJournal(file, (rows) => {
      const index = rows.findIndex((row) => row.submissionId === submissionId);
      if (index >= 0 && rows[index].attempt === record.attempt) rows[index] = updated;
    });
    return { url: updated.checkoutUrl, sessionId: updated.sessionId };
  } catch (error) {
    await withJournal(file, (rows) => {
      const current = rows.find((row) => row.submissionId === submissionId && row.attempt === record.attempt);
      if (current) { current.status = "creating"; current.updatedAt = new Date(0).toISOString(); }
    });
    throw error;
  }
}

export async function verifyStripePayment({ sessionId, submissionId, env = process.env, fetchImpl = globalThis.fetch, dataDir = undefined }) {
  const { environment, secretKey } = requireStripeConfig(env);
  if (!STRIPE_SESSION_ID.test(String(sessionId || "")) || !UUID_V4.test(String(submissionId || ""))) return false;
  const file = journalPath(dataDir, env);
  const record = await withJournal(file, (rows) => rows.find((row) => row.submissionId === submissionId && row.sessionId === String(sessionId)) || null);
  if (!record || !record.sessionId) return false;
  const session = await stripeJson(fetchImpl, `https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}`, secretKey);
  const verified = isVerifiedStripeCheckoutSession(session, { sessionId, submissionId, amountCadCents: record.amountCadCents, environment });
  await withJournal(file, (rows) => {
    const current = rows.find((row) => row.submissionId === submissionId && row.sessionId === String(sessionId));
    if (current) {
      const providerStatus = String(session?.payment_status || session?.status || "unverified").toLowerCase();
      current.status = verified ? "approved" : (session?.payment_status === "paid" || session?.status === "complete") ? "manual_review" : session?.status === "open" ? "pending" : providerStatus;
      current.updatedAt = new Date().toISOString();
    }
  });
  return verified;
}

export function verifyStripeWebhookSignature(rawBody, signatureHeader, secret, now = Date.now()) {
  if (typeof rawBody !== "string" || !signatureHeader || !/^whsec_[A-Za-z0-9_+/=-]+$/.test(secret || "")) return false;
  const parts = signatureHeader.split(",").map((part) => part.split("=", 2));
  const timestamp = parts.find(([key]) => key === "t")?.[1];
  const signatures = parts.filter(([key]) => key === "v1").map(([, value]) => value);
  if (!timestamp || !/^\d+$/.test(timestamp) || Math.abs(Math.floor(now / 1000) - Number(timestamp)) > 300) return false;
  const expected = createHmac("sha256", secret).update(`${timestamp}.${rawBody}`).digest("hex");
  const expectedBytes = Buffer.from(expected, "hex");
  return signatures.some((signature) => {
    if (!/^[a-f0-9]{64}$/i.test(signature)) return false;
    const actualBytes = Buffer.from(signature, "hex");
    return actualBytes.length === expectedBytes.length && timingSafeEqual(actualBytes, expectedBytes);
  });
}

export async function recordStripeWebhook({ rawBody, signatureHeader, env = process.env, dataDir = undefined, now = Date.now }) {
  const secret = env.STRIPE_WEBHOOK_SECRET || "";
  if (!verifyStripeWebhookSignature(rawBody, signatureHeader, secret, now())) throw new Error("SIGNATURE_WEBHOOK_INVALIDE");
  let event;
  try { event = JSON.parse(rawBody); } catch { throw new Error("EVENEMENT_STRIPE_INVALIDE"); }
  if (typeof event?.id !== "string" || typeof event?.type !== "string") throw new Error("EVENEMENT_STRIPE_INVALIDE");
  const session = event.data?.object;
  if (!session || typeof session !== "object" || !STRIPE_SESSION_ID.test(String(session.id || ""))) return { received: true, matched: false };
  const file = journalPath(dataDir, env);
  return withJournal(file, (rows) => {
    const record = rows.find((row) => row.sessionId === session.id);
    if (!record) return { received: true, matched: false };
    record.webhookEventIds = Array.isArray(record.webhookEventIds) ? record.webhookEventIds : [];
    if (!record.webhookEventIds.includes(event.id)) {
      record.webhookEventIds.push(event.id);
      record.webhookEventIds = record.webhookEventIds.slice(-100);
      record.webhookNotice = ["checkout.session.completed", "checkout.session.async_payment_succeeded"].includes(event.type) ? "completion_notice" : event.type;
      record.updatedAt = new Date().toISOString();
    }
    return { received: true, matched: true };
  });
}
