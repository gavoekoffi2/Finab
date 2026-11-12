import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import * as payment from "../src/lib/afrique-payment.mjs";
import { listApplications } from "../src/lib/afrique-applications.mjs";
import { DEFAULT_NOTICE_TEXT, DEFAULT_NOTICE_VERSION, createHandlers, recruitmentConfiguration } from "../src/lib/afrique-recruitment.ts";

const submissionId = "123e4567-e89b-42d3-a456-426614174000";
const origin = "https://finablasolution.cloud";
const sessionId = "cs_test_flowABC123";
const approvedNoticeHash = createHash("sha256").update(DEFAULT_NOTICE_TEXT).digest("hex");
const approvedTerms = payment.defaultPaymentTerms(6042);
const approvedTermsHash = createHash("sha256").update(approvedTerms).digest("hex");

function approvedEnv(dataDir = "") {
  return {
    STRIPE_SECRET_KEY: "sk_test_flowFake123",
    STRIPE_ENVIRONMENT: "test",
    STRIPE_WEBHOOK_SECRET: "whsec_flow123",
    FINAB_AFRIQUE_PAYMENT_ENABLED: "true",
    FINAB_AFRIQUE_OPEN: "true",
    FINAB_AFRIQUE_FEE_CAD_CENTS: "6042",
    FINAB_AFRIQUE_FEE_CAD_APPROVED: "true",
    FINAB_AFRIQUE_PAYMENT_TERMS_TEXT: approvedTerms,
    FINAB_AFRIQUE_PAYMENT_TERMS_VERSION: "2026-11-v1",
    FINAB_AFRIQUE_PAYMENT_TERMS_APPROVED_SHA256: approvedTermsHash,
    FINAB_STRIPE_ACCOUNT_COUNTRY: "CA",
    FINAB_STRIPE_ACCOUNT_COUNTRY_VERIFIED: "true",
    FINAB_AFRIQUE_NOTICE_TEXT: DEFAULT_NOTICE_TEXT,
    FINAB_AFRIQUE_NOTICE_VERSION: DEFAULT_NOTICE_VERSION,
    FINAB_AFRIQUE_NOTICE_APPROVED_SHA256: approvedNoticeHash,
    FINAB_AFRIQUE_COLLECTION_COUNTRIES_APPROVED: "true",
    FINAB_AFRIQUE_COLLECTION_COUNTRIES_JSON: '["Togo"]',
    FINAB_AFRIQUE_PAYMENT_DOWNSTREAM_VERIFIED: "true",
    FINAB_DATA_DIR: dataDir,
  };
}

function application(privacyVersion) {
  return {
    submissionId, lastName: "Kouassi", firstName: "Awa", country: "Togo", otherCountry: "", city: "Lomé", whatsapp: "+228 90 00 00 00",
    email: "awa@example.com", linkedin: "", diplomas: "Master finance", profession: "Analyste", experience: "4 à 7 ans", skills: "Analyse",
    achievements: "Projets", banks: "Banques locales", insurance: "Assureurs", microfinance: "IMF", investors: "Réseau", opportunities: "PME",
    exploratory: "À discuter", hours: 20, toolComputer: true, toolPhone: true, toolInternet: false, tools: "Ordinateur portable",
    motivation: "Contribuer", plan: "Rencontres", results: "Clients", truth: true, privacy: true, consent: true,
    paymentSessionId: sessionId, website: "", privacyVersion,
  };
}

test("parcours complet : paiement vérifié, candidature enregistrée localement même si le Google Sheet est en panne", async () => {
  const dataDir = await mkdtemp(join(tmpdir(), "finab-afrique-flow-"));
  const env = approvedEnv(dataDir);
  let sheetCalls = 0;
  const fetchImpl = async (url) => {
    const target = String(url);
    if (target.endsWith("/checkout/sessions")) return Response.json({ id: sessionId, url: `https://checkout.stripe.com/c/pay/${sessionId}` });
    if (target.endsWith(`/checkout/sessions/${sessionId}`)) return Response.json({
      id: sessionId, mode: "payment", status: "complete", payment_status: "paid", currency: "cad", amount_total: 6042, livemode: false,
      client_reference_id: submissionId, customer_details: { email: "awa@example.com", name: "Awa K" },
      metadata: { submission_id: submissionId, fee_type: "dossier_review", fee_currency: "CAD", reference_amount_xof: "25000" },
    });
    if (target.startsWith("https://script.google.com/")) { sheetCalls += 1; return new Response("panne", { status: 500 }); }
    throw new Error(`URL inattendue ${target}`);
  };
  try {
    const config = recruitmentConfiguration(env);
    assert.equal(config.open, true);
    assert.equal(config.feeCad, "60.42");
    assert.ok(config.notice.length > 50 && config.paymentTerms.length > 50);

    await payment.createStripeCheckout({ submissionId, successUrl: `${origin}/afrique/recrutement`, cancelUrl: `${origin}/afrique/recrutement`, env, fetchImpl });
    const { POST } = createHandlers({ env, fetch: fetchImpl });
    const send = () => POST(new Request(`${origin}/api/afrique/recrutement`, {
      method: "POST", headers: { origin, "content-type": "application/json", "idempotency-key": submissionId },
      body: JSON.stringify(application(config.privacyVersion)),
    }));
    const response = await send();
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { ok: true, reference: `FA27-${submissionId}` });
    const retry = await send();
    assert.equal(retry.status, 200, "un nouvel essai renvoie la même confirmation");
    const saved = await listApplications({ env });
    assert.equal(saved.length, 1);
    assert.equal(saved[0].firstName, "Awa");
    assert.equal(saved[0].forwardStatus, "erreur_500");
    assert.equal(sheetCalls, 1);
  } finally {
    await rm(dataDir, { recursive: true, force: true });
  }
});

test("sans paiement confirmé, la candidature est refusée et rien n'est enregistré", async () => {
  const dataDir = await mkdtemp(join(tmpdir(), "finab-afrique-unpaid-"));
  const env = approvedEnv(dataDir);
  try {
    const config = recruitmentConfiguration(env);
    const { POST } = createHandlers({ env, fetch: async () => { throw new Error("aucun appel attendu"); } });
    const response = await POST(new Request(`${origin}/api/afrique/recrutement`, {
      method: "POST", headers: { origin, "content-type": "application/json", "idempotency-key": submissionId },
      body: JSON.stringify(application(config.privacyVersion)),
    }));
    assert.equal(response.status, 402);
    assert.equal((await listApplications({ env })).length, 0);
  } finally {
    await rm(dataDir, { recursive: true, force: true });
  }
});

test("fermé par défaut tant que l'interrupteur et les clés ne sont pas en place", () => {
  assert.equal(recruitmentConfiguration({}).open, false);
  assert.equal(recruitmentConfiguration({ STRIPE_SECRET_KEY: "sk_live_abc", STRIPE_WEBHOOK_SECRET: "whsec_x" }).open, false);
  assert.equal(recruitmentConfiguration({ STRIPE_SECRET_KEY: "sk_live_abc", STRIPE_WEBHOOK_SECRET: "whsec_x", FINAB_AFRIQUE_PAYMENT_ENABLED: "true", FINAB_AFRIQUE_OPEN: "false" }).open, false);
});

test("collecte reste fermée tant que chaque approbation explicite ne correspond pas", () => {
  const approved = approvedEnv();
  assert.equal(recruitmentConfiguration(approved).open, true);
  assert.deepEqual(recruitmentConfiguration(approved).collectionCountries, ["Togo"]);
  assert.equal(recruitmentConfiguration({ ...approved, FINAB_AFRIQUE_COLLECTION_COUNTRIES_JSON: "[]" }).open, false);
  const missingOpenSwitch = { ...approved };
  delete missingOpenSwitch.FINAB_AFRIQUE_OPEN;
  assert.equal(recruitmentConfiguration(missingOpenSwitch).open, false);
  assert.equal(recruitmentConfiguration({ ...approved, FINAB_AFRIQUE_NOTICE_APPROVED_SHA256: "" }).open, false);
  for (const change of [
    { FINAB_AFRIQUE_PAYMENT_TERMS_APPROVED_SHA256: "" },
    { FINAB_STRIPE_ACCOUNT_COUNTRY_VERIFIED: "false" },
    { FINAB_STRIPE_ACCOUNT_COUNTRY: "" },
    { FINAB_AFRIQUE_COLLECTION_COUNTRIES_APPROVED: "false" },
    { FINAB_AFRIQUE_PAYMENT_DOWNSTREAM_VERIFIED: "false" },
    { FINAB_AFRIQUE_FEE_CAD_APPROVED: "false" },
  ]) {
    const config = recruitmentConfiguration({ ...approved, ...change });
    assert.equal(config.open, false);
    assert.equal(config.paymentReady, false);
  }
  assert.equal(recruitmentConfiguration({ ...approved, FINAB_AFRIQUE_PAYMENT_DOWNSTREAM_VERIFIED: "false" }).paymentDownstreamReady, false);
});

test("les candidatures hors de la liste approuvée sont rejetées avant tout appel Stripe", async () => {
  const dataDir = await mkdtemp(join(tmpdir(), "finab-afrique-country-gate-"));
  const env = approvedEnv(dataDir);
  let stripeCalls = 0;
  try {
    const config = recruitmentConfiguration(env);
    const { POST } = createHandlers({ env, fetch: async () => { stripeCalls += 1; throw new Error("aucun appel attendu"); } });
    const outsideApprovedList = { ...application(config.privacyVersion), country: "Guinée" };
    const response = await POST(new Request(`${origin}/api/afrique/recrutement`, {
      method: "POST", headers: { origin, "content-type": "application/json", "idempotency-key": submissionId },
      body: JSON.stringify(outsideApprovedList),
    }));
    assert.equal(response.status, 400);
    assert.equal(stripeCalls, 0);
    assert.equal((await listApplications({ env })).length, 0);
  } finally {
    await rm(dataDir, { recursive: true, force: true });
  }
});
