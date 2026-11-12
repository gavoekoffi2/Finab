import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { readSession } from "@/lib/appointments";
import { APPLICATION_STATUSES, listApplications, updateApplicationStatus } from "@/lib/afrique-applications.mjs";
import { listPaymentJournal } from "@/lib/afrique-payment.mjs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Données personnelles des candidats : réservé au propriétaire et aux administrateurs.
async function authorized() {
  const session = readSession((await cookies()).get("finab_session")?.value);
  return session && ["owner", "admin"].includes(session.role) ? session : null;
}

const csvColumns: [string, string][] = [
  ["reference", "Référence"], ["receivedAt", "Reçue le"], ["status", "Statut"], ["lastName", "Nom"], ["firstName", "Prénom"],
  ["country", "Pays"], ["otherCountry", "Autre pays"], ["city", "Ville"], ["whatsapp", "WhatsApp"], ["email", "Courriel"], ["linkedin", "LinkedIn"],
  ["diplomas", "Diplômes"], ["profession", "Profession"], ["experience", "Expérience"], ["skills", "Compétences"], ["achievements", "Réalisations"],
  ["banks", "Banques"], ["insurance", "Assurances"], ["microfinance", "Microfinance"], ["investors", "Investisseurs"], ["opportunities", "Opportunités"],
  ["exploratory", "Disponibilité mission"], ["hours", "Heures/semaine"], ["toolComputer", "Ordinateur"], ["toolPhone", "Smartphone"], ["toolInternet", "Internet"], ["tools", "Outils"],
  ["motivation", "Motivation"], ["plan", "Plan 30 jours"], ["results", "Résultats envisagés"],
  ["paymentAmountCadCents", "Montant (cents CAD)"], ["paymentSessionId", "Session Stripe"], ["paymentVerifiedAt", "Paiement vérifié le"], ["forwardStatus", "Copie Google Sheet"],
];

function csvCell(value: unknown) {
  let text = value === undefined || value === null ? "" : typeof value === "boolean" ? (value ? "oui" : "non") : String(value);
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`; // évite l'injection de formules dans Excel
  return `"${text.replace(/"/g, '""')}"`;
}

export async function GET(request: Request) {
  if (!(await authorized())) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const applications = await listApplications();
  if (new URL(request.url).searchParams.get("format") === "csv") {
    const lines = [csvColumns.map(([, label]) => csvCell(label)).join(";")];
    for (const app of applications as Record<string, unknown>[]) lines.push(csvColumns.map(([key]) => csvCell(app[key])).join(";"));
    return new Response(`﻿${lines.join("\r\n")}`, {
      headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="candidatures-finab-afrique-${new Date().toISOString().slice(0, 10)}.csv"`, "Cache-Control": "no-store" },
    });
  }
  const payments = await listPaymentJournal();
  const received = new Set((applications as { submissionId: string }[]).map((a) => a.submissionId));
  // Paiements confirmés sans formulaire reçu (navigateur fermé, etc.) : à recontacter.
  const orphanPayments = payments.filter((p: { status: string; submissionId: string }) => p.status === "approved" && !received.has(p.submissionId));
  const pendingReview = payments.filter((p: { status: string }) => p.status === "manual_review");
  return NextResponse.json({ applications, orphanPayments, pendingReview, statuses: APPLICATION_STATUSES }, { headers: { "Cache-Control": "no-store" } });
}

export async function PATCH(request: Request) {
  if (!(await authorized())) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const body = await request.json().catch(() => ({}));
  if (typeof body.submissionId !== "string" || !APPLICATION_STATUSES.includes(body.status)) return NextResponse.json({ error: "Mise à jour invalide" }, { status: 400 });
  const application = await updateApplicationStatus(body.submissionId, body.status);
  return application ? NextResponse.json({ ok: true }) : NextResponse.json({ error: "Candidature introuvable" }, { status: 404 });
}
