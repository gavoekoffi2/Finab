import { createHash } from 'node:crypto';
import { approvedPaymentTerms, configuredCadAmountCents, CONTACT_EMAIL, DOSSIER_FEE_XOF, isPaymentCollectionReady, PAYMENT_CURRENCY, verifyStripePayment } from './afrique-payment.mjs';
import { markForwarded, saveApplication } from './afrique-applications.mjs';

// Exact endpoint supplied by FINAB. No client-provided destination is accepted.
export const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzEU0-qsRP4MgZGEqKUM7VQ6wC4loIQi2g9aU4oN7Gz-oboKLaI-_T8DVb4rCECXq1vww/exec';
const countries = ['Guinée','Burkina Faso','Togo','Bénin',"Côte d'Ivoire",'Sénégal','Mali','Niger','Cameroun','Tchad','Gabon','Congo-Brazzaville','République démocratique du Congo','République centrafricaine','Madagascar','Burundi','Rwanda','Djibouti','Comores','Mauritanie','Autre pays africain'];
const limits: Record<string, number> = { lastName:100, firstName:100, country:100, otherCountry:100, city:100, whatsapp:25, email:180, linkedin:250, diplomas:2000, profession:150, experience:30, skills:3000, achievements:3000, banks:2000, insurance:2000, microfinance:2000, investors:2000, opportunities:3000, exploratory:100, tools:2000, motivation:3000, plan:5000, results:3000, privacyVersion:100 };
const bools = ['toolComputer','toolPhone','toolInternet','truth','privacy','consent'];
const allowed = new Set([...Object.keys(limits),...bools,'hours','submissionId','paymentSessionId','website']);
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
const maxBytes = 65536;

export const DEFAULT_NOTICE_VERSION = '2026-11-v1';
export const DEFAULT_NOTICE_TEXT = 'FINAB La Solution utilise les informations de ce formulaire uniquement pour étudier votre candidature au recrutement de conseillers financiers en Afrique et pour vous recontacter. '
  + 'Elles sont enregistrées sur le serveur de FINAB et dans un tableur interne accessible à la seule équipe de recrutement, et conservées au plus 24 mois après la fin du processus. '
  + 'Le paiement est traité par Stripe : FINAB ne reçoit jamais vos coordonnées bancaires. '
  + `Vous pouvez demander l’accès, la correction ou la suppression de vos données en écrivant à ${CONTACT_EMAIL}.`;

// Un seul interrupteur : FINAB_AFRIQUE_PAYMENT_ENABLED=true (+ clés Stripe). FINAB_AFRIQUE_OPEN=false permet de fermer sans toucher à Stripe.
export function recruitmentConfiguration(env: NodeJS.ProcessEnv = process.env) {
  const customText = (env.FINAB_AFRIQUE_NOTICE_TEXT || '').trim();
  const text = customText || DEFAULT_NOTICE_TEXT;
  const version = customText ? (env.FINAB_AFRIQUE_NOTICE_VERSION || 'personnalise') : DEFAULT_NOTICE_VERSION;
  const hash = createHash('sha256').update(text).digest('hex');
  const noticeReady = env.FINAB_AFRIQUE_OPEN !== 'false' && text.length <= 20000 && /^[a-zA-Z0-9._-]{1,30}$/.test(version);
  const terms = approvedPaymentTerms(env);
  const paymentReady = isPaymentCollectionReady(env);
  const open = noticeReady && paymentReady;
  const feeCadCents = configuredCadAmountCents(env);
  return {open, paymentReady, paymentDownstreamReady:true, feeXof:DOSSIER_FEE_XOF, currency:PAYMENT_CURRENCY, feeCadCents, feeCad:feeCadCents ? (feeCadCents / 100).toFixed(2) : '', privacyVersion:noticeReady ? `${version}:${hash.slice(0, 16)}` : '', notice:noticeReady ? text : '', paymentTermsVersion:terms.version, paymentTerms:terms.text};
}
function json(data: object, status = 200, extra: Record<string,string> = {}) {
  return Response.json(data, {status, headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff',...extra}});
}
async function boundedText(stream: ReadableStream<Uint8Array> | null) {
  if (!stream) return '';
  const reader = stream.getReader(); const chunks: Uint8Array[] = []; let size = 0;
  try {
    while (true) {
      const chunk = await reader.read(); if (chunk.done) break;
      size += chunk.value.byteLength;
      if (size > maxBytes) { await reader.cancel(); throw new Error('TOO_LARGE'); }
      chunks.push(chunk.value);
    }
  } finally {reader.releaseLock();}
  return Buffer.concat(chunks).toString('utf8');
}
function valid(value: unknown, version: string): value is Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const d = value as Record<string, unknown>;
  if (Object.keys(d).some(k => !allowed.has(k)) || typeof d.submissionId !== 'string' || !uuid.test(d.submissionId) || d.website !== '' || d.privacyVersion !== version) return false;
  for (const [k,max] of Object.entries(limits)) {
    const v=d[k];
    if (typeof v !== 'string' || v.length>max || /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(v) || (!['otherCountry','linkedin'].includes(k) && !v.trim())) return false;
  }
  if (bools.some(k=>typeof d[k]!=='boolean') || ['truth','privacy','consent'].some(k=>d[k]!==true)) return false;
  if (typeof d.paymentSessionId !== 'string' || !/^cs_(?:test|live)_[A-Za-z0-9]+$/.test(d.paymentSessionId)) return false;
  if (!Number.isInteger(d.hours) || Number(d.hours)<1 || Number(d.hours)>168) return false;
  if (!countries.includes(String(d.country)) || (d.country==='Autre pays africain') !== Boolean(String(d.otherCountry).trim())) return false;
  if (!['Moins de 1 an','1 à 3 ans','4 à 7 ans','8 à 15 ans','Plus de 15 ans'].includes(String(d.experience)) || !['Oui, sous réserve des conditions de mission','À discuter','Non'].includes(String(d.exploratory))) return false;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(d.email)) || !/^\+[0-9][0-9 ()\-]{5,22}[0-9]$/.test(String(d.whatsapp))) return false;
  if (d.linkedin && !/^https:\/\/(www\.)?linkedin\.com\/in\/[A-Za-z0-9_%.-]+\/?$/.test(String(d.linkedin))) return false;
  return true;
}

// Injectable transport is used ONLY by local tests; production exports use global fetch.
export function createHandlers(deps: {env?:NodeJS.ProcessEnv; fetch?:typeof fetch; now?:()=>number} = {}) {
  const env = deps.env ?? process.env;
  const transport = deps.fetch ?? globalThis.fetch;
  const now = deps.now ?? Date.now;
  const buckets = new Map<string,{count:number;until:number}>();
  function consume(key:string, limit:number) {
    const time=now();
    for (const [k,b] of buckets) if(b.until<=time) buckets.delete(k);
    const bucket=buckets.get(key) ?? {count:0,until:time+600000};
    if(bucket.count>=limit || buckets.size>=10000) return false;
    bucket.count++; buckets.set(key,bucket); return true;
  }
  return {
    async GET() { return json(recruitmentConfiguration(env)); },
    async POST(request: Request) {
      const config=recruitmentConfiguration(env);
      if(!config.open) return json({ok:false,code:'COLLECTE_FERMEE'},503);
      const origin=env.FINAB_PUBLIC_ORIGIN || 'https://finablasolution.cloud';
      if(request.headers.get('origin')!==origin) return json({ok:false,code:'ORIGINE_REFUSEE'},403);
      if(request.headers.get('content-type')?.split(';')[0].trim().toLowerCase()!=='application/json') return json({ok:false,code:'FORMAT_INVALIDE'},415);
      // Traefik remplace X-Real-Ip. L'envoi exige de toute façon un paiement Stripe vérifié.
      const trustedHeader=env.FINAB_AFRIQUE_TRUSTED_IP_HEADER || 'x-real-ip';
      const ip = request.headers.get(trustedHeader)?.slice(0,128) || 'unknown';
      if(!consume('global',300) || !consume(`client:${ip}`,20)) return json({ok:false,code:'TROP_DE_TENTATIVES'},429,{'Retry-After':'600'});
      if(Number(request.headers.get('content-length')||0)>maxBytes) return json({ok:false,code:'CORPS_TROP_VOLUMINEUX'},413);
      let data: unknown;
      try { data=JSON.parse(await boundedText(request.body)); }
      catch(e) { return json({ok:false,code:'DONNEES_INVALIDES'},e instanceof Error && e.message==='TOO_LARGE'?413:400); }
      if(!valid(data,config.privacyVersion) || request.headers.get('idempotency-key')!==data.submissionId) return json({ok:false,code:'DONNEES_INVALIDES'},400);
      const paymentId=String(data.paymentSessionId);
      try {
        const paid=await verifyStripePayment({sessionId:paymentId,submissionId:String(data.submissionId),env,fetchImpl:transport});
        if(!paid) return json({ok:false,code:'PAIEMENT_NON_CONFIRME'},402);
      } catch { return json({ok:false,code:'PAIEMENT_NON_CONFIRME'},402); }
      const reference=`FA27-${data.submissionId}`;
      const applicationData={...data};
      delete applicationData.paymentSessionId;
      delete applicationData.website;
      const verifiedApplication={...applicationData,paymentSessionId:paymentId,paymentStatus:'approved',paymentAmountReferenceXof:DOSSIER_FEE_XOF,paymentAmountCadCents:config.feeCadCents,paymentCurrency:PAYMENT_CURRENCY,paymentVerifiedAt:new Date(now()).toISOString()};
      let saved;
      try {
        saved=await saveApplication(verifiedApplication,{env});
      } catch (error) {
        console.error('[finab-afrique] Enregistrement local de la candidature impossible :', error instanceof Error ? error.message : error);
        return json({ok:false,code:'ENREGISTREMENT_NON_CONFIRME'},502);
      }
      if(saved.created && env.FINAB_AFRIQUE_APPS_SCRIPT_ENABLED!=='false') {
        // Copie vers le Google Sheet : best effort, n'empêche jamais la confirmation au candidat.
        try {
          const response=await transport(env.FINAB_AFRIQUE_APPS_SCRIPT_URL || APPS_SCRIPT_URL,{
            method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...verifiedApplication,reference}),
            redirect:'follow',cache:'no-store',signal:AbortSignal.timeout(20000),
          });
          await markForwarded(String(data.submissionId),response.ok?'envoyee':`erreur_${response.status}`,{env});
        } catch (error) {
          console.error('[finab-afrique] Copie vers Google Sheet impossible :', error instanceof Error ? error.message : error);
          await markForwarded(String(data.submissionId),'erreur',{env}).catch(()=>undefined);
        }
      }
      return json({ok:true,reference});
    },
  };
}
const handlers=createHandlers();
export const GET=handlers.GET;
export const POST=handlers.POST;
