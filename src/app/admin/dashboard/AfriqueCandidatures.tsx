"use client";
import { useCallback, useEffect, useState } from "react";

type Application = Record<string, string | number | boolean> & {
  submissionId: string; reference: string; firstName: string; lastName: string; email: string; whatsapp: string;
  country: string; otherCountry: string; city: string; status: string; receivedAt: string; forwardStatus: string; paymentAmountCadCents: number;
};
type Payment = { submissionId: string; sessionId: string; status: string; paidAt?: string; payerEmail?: string; payerName?: string; amountCadCents: number; updatedAt: string };

const statusLabels: Record<string, string> = { nouvelle: "Nouvelle", en_etude: "En étude", retenue: "Retenue", non_retenue: "Non retenue" };
const details: [string, string][] = [
  ["linkedin", "LinkedIn"], ["diplomas", "Diplômes et formations"], ["profession", "Profession actuelle"], ["experience", "Expérience"],
  ["skills", "Compétences"], ["achievements", "Réalisations"], ["banks", "Banques"], ["insurance", "Assurances"], ["microfinance", "Microfinance"],
  ["investors", "Investisseurs et réseau"], ["opportunities", "Opportunités identifiées"], ["exploratory", "Disponibilité pour une mission"],
  ["hours", "Heures par semaine"], ["tools", "Outils et contraintes"], ["motivation", "Motivation"], ["plan", "Plan 30 jours"], ["results", "Résultats envisagés"],
];
const cad = (cents: number) => `${(Number(cents || 0) / 100).toFixed(2).replace(".", ",")} $`;
const date = (iso?: string) => (iso ? new Date(iso).toLocaleString("fr-CA", { dateStyle: "medium", timeStyle: "short" }) : "—");

export default function AfriqueCandidatures() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [orphans, setOrphans] = useState<Payment[]>([]);
  const [review, setReview] = useState<Payment[]>([]);
  const [denied, setDenied] = useState(false);
  const [open, setOpen] = useState<string | null>(null);

  const [version, setVersion] = useState(0);
  const load = useCallback(() => setVersion((v) => v + 1), []);
  useEffect(() => {
    let active = true;
    fetch("/api/admin/afrique-candidatures", { cache: "no-store" }).then(async (r) => {
      if (!active) return;
      if (r.status === 401) { setDenied(true); return; }
      if (!r.ok) return;
      const data = await r.json();
      if (!active) return;
      setApplications(data.applications); setOrphans(data.orphanPayments); setReview(data.pendingReview);
    }).catch(() => undefined);
    return () => { active = false; };
  }, [version]);

  async function update(submissionId: string, status: string) {
    await fetch("/api/admin/afrique-candidatures", { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ submissionId, status }) });
    load();
  }
  if (denied) return null;
  const total = applications.reduce((sum, a) => sum + Number(a.paymentAmountCadCents || 0), 0);

  return (
    <section className="dashboard-panel">
      <div className="dashboard-panel-title">
        <div><span className="admin-kicker">RECRUTEMENT AFRIQUE · PAYÉES</span><h2>Candidatures Afrique ({applications.length})</h2><small className="afrique-total">Total encaissé : {cad(total)} CAD</small></div>
        <div><a className="afrique-export" href="/api/admin/afrique-candidatures?format=csv">Exporter (Excel / CSV)</a><button onClick={() => load()}>Actualiser</button></div>
      </div>
      {orphans.length > 0 && (
        <div className="afrique-alert">
          <strong>{orphans.length} paiement(s) confirmé(s) sans formulaire reçu</strong> — la personne a payé mais n’a pas terminé l’envoi (navigateur fermé, coupure…). Contactez-la :
          <ul>{orphans.map((p) => <li key={p.sessionId}>{p.payerName || "Nom inconnu"} · {p.payerEmail || "courriel inconnu"} · {cad(p.amountCadCents)} · {date(p.paidAt || p.updatedAt)} · réf. FA27-{p.submissionId}</li>)}</ul>
        </div>
      )}
      {review.length > 0 && (
        <div className="afrique-alert">
          <strong>{review.length} paiement(s) à vérifier dans Stripe</strong> (montant ou référence inattendus) :
          <ul>{review.map((p) => <li key={p.sessionId}>{p.sessionId} · réf. FA27-{p.submissionId}</li>)}</ul>
        </div>
      )}
      {applications.length === 0 ? <p className="dashboard-empty">Aucune candidature payée pour le moment.</p> : (
        <div className="appointment-table">
          <div className="appointment-row appointment-head"><span>Candidat</span><span>Pays</span><span>Contact</span><span>Statut</span><span>Détails</span></div>
          {applications.map((a) => (
            <div key={a.submissionId}>
              <div className="appointment-row">
                <span><strong>{a.firstName} {a.lastName}</strong><small>{date(a.receivedAt)} · {cad(a.paymentAmountCadCents)} payé</small></span>
                <span>{a.country === "Autre pays africain" ? a.otherCountry : a.country}<small>{a.city}</small></span>
                <span><a href={`mailto:${a.email}`}>{a.email}</a><small>{a.whatsapp}</small></span>
                <span><select value={a.status} onChange={(e) => update(a.submissionId, e.target.value)}>{Object.entries(statusLabels).map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select></span>
                <span><button className="row-action" onClick={() => setOpen(open === a.submissionId ? null : a.submissionId)}>{open === a.submissionId ? "Fermer" : "Voir"}</button></span>
              </div>
              {open === a.submissionId && (
                <dl className="afrique-details">
                  <div><dt>Référence</dt><dd>{a.reference}</dd></div>
                  {details.map(([key, label]) => <div key={key}><dt>{label}</dt><dd>{String(a[key] ?? "") || "—"}</dd></div>)}
                  <div><dt>Outils</dt><dd>{[a.toolComputer && "Ordinateur", a.toolPhone && "Smartphone", a.toolInternet && "Internet"].filter(Boolean).join(", ") || "—"}</dd></div>
                  <div><dt>Copie Google Sheet</dt><dd>{a.forwardStatus}</dd></div>
                </dl>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
