import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

// Registre local des candidatures FINAB Afrique : c'est la source de vérité.
// Le Google Sheet (Apps Script) n'est qu'une copie : son indisponibilité ne doit jamais
// faire perdre une candidature déjà payée.
let queue = Promise.resolve();

function storeFile(dataDir, env) {
  return path.join(dataDir || env.FINAB_DATA_DIR || path.join(process.cwd(), "data"), "afrique-candidatures.json");
}

async function withStore(file, change) {
  const task = queue.then(async () => {
    await mkdir(path.dirname(file), { recursive: true, mode: 0o700 });
    let rows = [];
    try {
      const parsed = JSON.parse(await readFile(file, "utf8"));
      if (Array.isArray(parsed)) rows = parsed;
    } catch (error) {
      if (error?.code !== "ENOENT") throw error;
    }
    const before = JSON.stringify(rows);
    const result = await change(rows);
    if (JSON.stringify(rows) !== before) {
      const temporary = `${file}.${process.pid}.${Date.now()}.tmp`;
      await writeFile(temporary, JSON.stringify(rows), { encoding: "utf8", mode: 0o600 });
      await rename(temporary, file);
    }
    return result;
  });
  queue = task.catch(() => undefined);
  return task;
}

/**
 * Enregistre une candidature payée. Idempotent : un même submissionId n'est enregistré qu'une fois.
 * Retourne { created, application }.
 */
export async function saveApplication(application, { env = process.env, dataDir = undefined } = {}) {
  if (!application || typeof application.submissionId !== "string") throw new Error("CANDIDATURE_INVALIDE");
  return withStore(storeFile(dataDir, env), (rows) => {
    const existing = rows.find((row) => row.submissionId === application.submissionId);
    if (existing) return { created: false, application: existing };
    const record = { ...application, reference: `FA27-${application.submissionId}`, status: "nouvelle", forwardStatus: "en_attente", receivedAt: new Date().toISOString() };
    rows.push(record);
    return { created: true, application: record };
  });
}

export async function markForwarded(submissionId, forwardStatus, { env = process.env, dataDir = undefined } = {}) {
  return withStore(storeFile(dataDir, env), (rows) => {
    const row = rows.find((item) => item.submissionId === submissionId);
    if (row) { row.forwardStatus = forwardStatus; row.forwardedAt = new Date().toISOString(); }
    return Boolean(row);
  });
}

export const APPLICATION_STATUSES = ["nouvelle", "en_etude", "retenue", "non_retenue"];

export async function updateApplicationStatus(submissionId, status, { env = process.env, dataDir = undefined } = {}) {
  if (!APPLICATION_STATUSES.includes(status)) throw new Error("STATUT_INVALIDE");
  return withStore(storeFile(dataDir, env), (rows) => {
    const row = rows.find((item) => item.submissionId === submissionId);
    if (!row) return null;
    row.status = status;
    row.updatedAt = new Date().toISOString();
    return row;
  });
}

export async function listApplications({ env = process.env, dataDir = undefined } = {}) {
  return withStore(storeFile(dataDir, env), (rows) => [...rows].sort((a, b) => String(b.receivedAt).localeCompare(String(a.receivedAt))));
}
