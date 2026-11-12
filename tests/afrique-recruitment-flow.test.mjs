import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import * as payment from "../src/lib/afrique-payment.mjs";
import { listApplications } from "../src/lib/afrique-applications.mjs";
import { createHandlers, recruitmentConfiguration } from "../src/lib/afrique-recruitment.ts";

const submissionId = "123e4567-e89b-42d3-a456-426614174000";
const origin = "https://finablasolution.cloud";
const sessionId = "cs_test_flowABC123";

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
  const env = { STRIPE_SECRET_KEY: "sk_test_flowkey123", STRIPE_WEBHOOK_SECRET: "whsec_flow123", FINAB_AFRIQUE_PAYMENT_ENABLED: "true", FINAB_DATA_DIR: dataDir };
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
  const env = { STRIPE_SECRET_KEY: "sk_test_flowkey123", STRIPE_WEBHOOK_SECRET: "whsec_flow123", FINAB_AFRIQUE_PAYMENT_ENABLED: "true", FINAB_DATA_DIR: dataDir };
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
