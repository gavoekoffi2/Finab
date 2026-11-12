import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const html = readFileSync(new URL("../public/finab-afrique/index.html", import.meta.url), "utf8");
const app = readFileSync(new URL("../public/finab-afrique/app.js", import.meta.url), "utf8");
const compose = readFileSync(new URL("../docker-compose.prod.yml", import.meta.url), "utf8");

test("the closed public page presents the proposed amount as indicative, never due", () => {
  assert.match(html, /Montant indicatif|tarif envisagé/i);
  assert.match(html, /aucun paiement n['’]est accepté/i);
  assert.doesNotMatch(html, /frais d’étude de dossier obligatoires|à régler avant l’envoi définitif|paiement est requis avant la transmission/i);
});

test("the open UI uses only the server-approved countries and published terms", () => {
  assert.match(html, /id="countries-list"/);
  assert.match(html, /id="fee-open-status"/);
  assert.match(html, /id="fee-faq"/);
  assert.match(app, /config\.collectionCountries/);
  assert.match(app, /approvedCountries/);
  assert.match(app, /public-fee-conditions/);
  assert.match(app, /fee-faq/);
});

test("the production Compose file does not inject the private Africa Stripe credentials", () => {
  assert.match(compose, /\/opt\/finablasolution\/\.env/);
  assert.doesNotMatch(compose, /\/opt\/finablasolution\/afrique\.env/);
});

test("the API-driven closed state says collection is unavailable without demanding a fee", () => {
  assert.match(app, /Candidatures temporairement fermées/);
  assert.match(app, /aucun paiement n['’]est accepté/i);
  assert.doesNotMatch(app, /les frais obligatoires seront/i);
});
