import test from "node:test";
import assert from "node:assert/strict";
import { createHmac, createHash } from "node:crypto";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import * as payment from "../src/lib/afrique-payment.mjs";

const submissionId = "123e4567-e89b-42d3-a456-426614174000";
const successUrl = "https://finablasolution.cloud/afrique/recrutement";
const testEnv = {
  STRIPE_SECRET_KEY: "sk_test_examplekey123",
  STRIPE_ENVIRONMENT: "test",
  STRIPE_WEBHOOK_SECRET: "whsec_test_secret123",
  FINAB_AFRIQUE_FEE_CAD_CENTS: "6042",
  FINAB_AFRIQUE_FEE_CAD_APPROVED: "true",
};

function paidSession(overrides = {}) {
  return {
    id: "cs_test_checkoutABC123",
    mode: "payment",
    status: "complete",
    payment_status: "paid",
    currency: "cad",
    amount_total: 6042,
    livemode: false,
    client_reference_id: submissionId,
    metadata: { submission_id: submissionId, fee_type: "dossier_review", fee_currency: "CAD", reference_amount_xof: "25000" },
    ...overrides,
  };
}

test("keeps the XOF reference separate from a fixed, approved CAD checkout amount", () => {
  assert.equal(payment.DOSSIER_FEE_XOF, 25000);
  assert.equal(payment.PAYMENT_CURRENCY, "CAD");
  assert.equal(payment.configuredCadAmountCents(testEnv), 6042);
  assert.equal(payment.configuredCadAmountCents({ ...testEnv, FINAB_AFRIQUE_FEE_CAD_CENTS: "" }), 6042);
  assert.equal(payment.configuredCadAmountCents({}), 6042);
  assert.equal(payment.configuredCadAmountCents({ FINAB_AFRIQUE_FEE_CAD_CENTS: "abc" }), 0);
  assert.equal(payment.configuredCadAmountCents({ ...testEnv, FINAB_AFRIQUE_FEE_CAD_CENTS: "1" }), 0);
});

test("Stripe Checkout is fixed in CAD, linked to the application, and uses the hosted success placeholder", () => {
  const form = payment.buildStripeCheckoutForm({ submissionId, successUrl, cancelUrl: successUrl, amountCadCents: 6042 });
  assert.equal(form.get("mode"), "payment");
  assert.equal(form.get("line_items[0][price_data][currency]"), "cad");
  assert.equal(form.get("line_items[0][price_data][unit_amount]"), "6042");
  assert.equal(form.get("client_reference_id"), submissionId);
  assert.equal(form.get("metadata[submission_id]"), submissionId);
  assert.match(form.get("success_url"), /session_id=\{CHECKOUT_SESSION_ID\}/);
  assert.match(form.get("line_items[0][price_data][product_data][description]"), /ne garantit/i);
  assert.throws(() => payment.buildStripeCheckoutForm({ submissionId, successUrl: "https://attacker.example/", cancelUrl: successUrl, amountCadCents: 6042 }));
});

test("only exact paid CAD Checkout sessions for this application verify", () => {
  const valid = paidSession();
  const expected = { sessionId: valid.id, submissionId, amountCadCents: 6042, environment: "test" };
  assert.equal(payment.isVerifiedStripeCheckoutSession(valid, expected), true);
  assert.equal(payment.isVerifiedStripeCheckoutSession({ ...valid, payment_status: "unpaid" }, expected), false);
  assert.equal(payment.isVerifiedStripeCheckoutSession({ ...valid, amount_total: 6043 }, expected), false);
  assert.equal(payment.isVerifiedStripeCheckoutSession({ ...valid, currency: "usd" }, expected), false);
  assert.equal(payment.isVerifiedStripeCheckoutSession({ ...valid, livemode: true }, expected), false);
  assert.equal(payment.isVerifiedStripeCheckoutSession({ ...valid, metadata: { ...valid.metadata, submission_id: "other" } }, expected), false);
});

test("checkout creation is idempotently reused and payment is verified by Stripe server lookup", async () => {
  const dataDir = await mkdtemp(join(tmpdir(), "finab-afrique-stripe-"));
  const calls = [];
  const fetchImpl = async (url, init = {}) => {
    calls.push({ url: String(url), method: init.method || "GET", body: init.body || "", headers: init.headers || {} });
    if (String(url).endsWith("/checkout/sessions")) return Response.json({ id: "cs_test_checkoutABC123", url: "https://checkout.stripe.com/c/pay/cs_test_checkoutABC123" }, { status: 200 });
    if (String(url).endsWith("/checkout/sessions/cs_test_checkoutABC123")) return Response.json(paidSession());
    throw new Error(`Unexpected URL ${url}`);
  };
  try {
    const first = await payment.createStripeCheckout({ submissionId, successUrl, cancelUrl: successUrl, env: testEnv, fetchImpl, dataDir });
    const second = await payment.createStripeCheckout({ submissionId, successUrl, cancelUrl: successUrl, env: testEnv, fetchImpl, dataDir });
    assert.equal(first.sessionId, "cs_test_checkoutABC123");
    assert.equal(second.url, first.url);
    assert.equal(calls.filter((call) => call.url.endsWith("/checkout/sessions")).length, 1);
    const createCall = calls.find((call) => call.method === "POST");
    assert.match(createCall.headers["Idempotency-Key"], new RegExp(submissionId));
    assert.equal(await payment.verifyStripePayment({ sessionId: first.sessionId, submissionId, env: testEnv, fetchImpl, dataDir }), true);
  } finally {
    await rm(dataDir, { recursive: true, force: true });
  }
});

test("collection opens with one switch plus Stripe keys, and stays closed if any of them is missing", () => {
  const readyEnv = { ...testEnv, FINAB_AFRIQUE_PAYMENT_ENABLED: "true" };
  assert.deepEqual(payment.paymentReadinessIssues(readyEnv), []);
  assert.equal(payment.isPaymentCollectionReady(readyEnv), true);
  assert.equal(payment.isPaymentCollectionReady({ ...readyEnv, STRIPE_ENVIRONMENT: "" }), true);
  assert.equal(payment.isPaymentCollectionReady({ ...readyEnv, FINAB_AFRIQUE_PAYMENT_ENABLED: "false" }), false);
  assert.equal(payment.isPaymentCollectionReady({ ...readyEnv, STRIPE_WEBHOOK_SECRET: "" }), false);
  assert.equal(payment.isPaymentCollectionReady({ ...readyEnv, STRIPE_SECRET_KEY: "" }), false);
  assert.equal(payment.isPaymentCollectionReady({ ...readyEnv, STRIPE_ENVIRONMENT: "live" }), false);
  assert.equal(payment.isPaymentCollectionReady({ ...readyEnv, FINAB_AFRIQUE_FEE_CAD_APPROVED: "false" }), false);
  assert.match(payment.approvedPaymentTerms(readyEnv).text, /60,42 \$ CAD/);
});

test("webhook signature is verified and matching events are recorded idempotently", async () => {
  const dataDir = await mkdtemp(join(tmpdir(), "finab-afrique-webhook-"));
  const env = { ...testEnv };
  const now = Date.now();
  const rawBody = JSON.stringify({ id: "evt_test_123", type: "checkout.session.completed", data: { object: { id: "cs_test_checkoutABC123" } } });
  const timestamp = Math.floor(now / 1000);
  const signature = createHmac("sha256", env.STRIPE_WEBHOOK_SECRET).update(`${timestamp}.${rawBody}`).digest("hex");
  const header = `t=${timestamp},v1=${signature}`;
  assert.equal(payment.verifyStripeWebhookSignature(rawBody, header, env.STRIPE_WEBHOOK_SECRET, now), true);
  assert.equal(payment.verifyStripeWebhookSignature(rawBody, `${header}x`, env.STRIPE_WEBHOOK_SECRET, now), false);
  try {
    const created = await payment.createStripeCheckout({ submissionId, successUrl, cancelUrl: successUrl, env, fetchImpl: async () => Response.json({ id: "cs_test_checkoutABC123", url: "https://checkout.stripe.com/c/pay/cs_test_checkoutABC123" }), dataDir });
    assert.equal(created.sessionId, "cs_test_checkoutABC123");
    const fetchImpl = async () => Response.json(paidSession());
    const first = await payment.recordStripeWebhook({ rawBody, signatureHeader: header, env, dataDir, now: () => now, fetchImpl });
    const second = await payment.recordStripeWebhook({ rawBody, signatureHeader: header, env, dataDir, now: () => now, fetchImpl });
    assert.deepEqual(first, { received: true, matched: true });
    assert.deepEqual(second, first);
    const journal = await payment.listPaymentJournal({ env, dataDir });
    assert.equal(journal[0].status, "approved", "le webhook confirme le paiement même sans retour du navigateur");
    assert.equal(journal[0].checkoutUrl, undefined);
  } finally {
    await rm(dataDir, { recursive: true, force: true });
  }
});

test("a paid but mismatched Stripe session is quarantined and cannot trigger another checkout", async () => {
  const dataDir = await mkdtemp(join(tmpdir(), "finab-afrique-stripe-mismatch-"));
  let createCount = 0;
  const fetchImpl = async (url) => {
    if (String(url).endsWith("/checkout/sessions")) {
      createCount += 1;
      return Response.json({ id: "cs_test_checkoutABC123", url: "https://checkout.stripe.com/c/pay/cs_test_checkoutABC123" });
    }
    if (String(url).endsWith("/checkout/sessions/cs_test_checkoutABC123")) return Response.json(paidSession({ amount_total: 9999 }));
    throw new Error(`Unexpected URL ${url}`);
  };
  try {
    await payment.createStripeCheckout({ submissionId, successUrl, cancelUrl: successUrl, env: testEnv, fetchImpl, dataDir });
    assert.equal(await payment.verifyStripePayment({ sessionId: "cs_test_checkoutABC123", submissionId, env: testEnv, fetchImpl, dataDir }), false);
    await assert.rejects(payment.createStripeCheckout({ submissionId, successUrl, cancelUrl: successUrl, env: testEnv, fetchImpl, dataDir }), /PAIEMENT_A_VERIFIER/);
    assert.equal(createCount, 1);
  } finally {
    await rm(dataDir, { recursive: true, force: true });
  }
});
