import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

export type AppointmentStatus = "new" | "confirmed" | "completed" | "cancelled";
export type Appointment = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  whatsapp: string;
  date: string;
  time: string;
  timezone: "America/Toronto";
  message: string;
  status: AppointmentStatus;
  createdAt: string;
};
export type DashboardUser = { id: string; name: string; email: string; phone: string; role: "owner" | "partner" | "admin"; active: boolean; passwordHash: string; createdAt: string };

type Store = { appointments: Appointment[]; users: DashboardUser[] };
const dataDir = process.env.FINAB_DATA_DIR || path.join(process.cwd(), "data");
const dataFile = path.join(dataDir, "appointments.json");
const secret = process.env.FINAB_SESSION_SECRET || "change-this-finab-session-secret";

async function ensureStore(): Promise<Store> {
  await mkdir(dataDir, { recursive: true });
  try { return JSON.parse(await readFile(dataFile, "utf8")) as Store; } catch { const empty = { appointments: [], users: [] }; await writeFile(dataFile, JSON.stringify(empty, null, 2), "utf8"); return empty; }
}
async function saveStore(store: Store) { const tmp = `${dataFile}.tmp`; await writeFile(tmp, JSON.stringify(store, null, 2), "utf8"); await rename(tmp, dataFile); }
export async function listAppointments() { return (await ensureStore()).appointments.sort((a, b) => `${b.date} ${b.time}`.localeCompare(`${a.date} ${a.time}`)); }
export async function addAppointment(input: Omit<Appointment, "id" | "status" | "createdAt" | "timezone">) { const store = await ensureStore(); const appointment: Appointment = { ...input, id: randomBytes(10).toString("hex"), status: "new", timezone: "America/Toronto", createdAt: new Date().toISOString() }; store.appointments.push(appointment); await saveStore(store); return appointment; }
export async function updateAppointment(id: string, status: AppointmentStatus) { const store = await ensureStore(); const item = store.appointments.find((a) => a.id === id); if (!item) return null; item.status = status; await saveStore(store); return item; }
export function hashPassword(password: string) { const salt = randomBytes(16).toString("hex"); return `${salt}:${scryptSync(password, salt, 64).toString("hex")}`; }
export function verifyPassword(password: string, stored: string) { const [salt, hash] = stored.split(":"); if (!salt || !hash) return false; const actual = scryptSync(password, salt, 64); return timingSafeEqual(actual, Buffer.from(hash, "hex")); }
export async function ensureAdminUser() { const store = await ensureStore(); const email = (process.env.FINAB_ADMIN_EMAIL || "").toLowerCase().trim(); const password = process.env.FINAB_ADMIN_PASSWORD || ""; if (email && password && !store.users.some((u) => u.email === email)) { store.users.push({ id: randomBytes(10).toString("hex"), name: process.env.FINAB_ADMIN_NAME || "Administrateur FINAB", email, phone: process.env.FINAB_ADMIN_PHONE || "", role: "owner", active: true, passwordHash: hashPassword(password), createdAt: new Date().toISOString() }); await saveStore(store); } return store; }
export async function findUser(login: string) { const store = await ensureAdminUser(); const normalized = login.toLowerCase().trim(); return store.users.find((u) => u.active && (u.email === normalized || u.phone === login.trim())) || null; }
export async function createDashboardUser(input: { name: string; email: string; phone: string; password: string; role: "partner" | "admin" }) { const store = await ensureAdminUser(); const email = input.email.toLowerCase().trim(); if (store.users.some((u) => u.email === email || (input.phone && u.phone === input.phone))) throw new Error("Cet utilisateur existe déjà."); const user: DashboardUser = { id: randomBytes(10).toString("hex"), name: input.name.trim(), email, phone: input.phone.trim(), role: input.role, active: true, passwordHash: hashPassword(input.password), createdAt: new Date().toISOString() }; store.users.push(user); await saveStore(store); return { ...user, passwordHash: undefined };
}
export async function listUsers() { return (await ensureAdminUser()).users.map(({ passwordHash: _, ...u }) => u); }
export function createSession(user: Pick<DashboardUser, "id" | "email" | "role">) { const payload = Buffer.from(JSON.stringify({ id: user.id, email: user.email, role: user.role, exp: Date.now() + 1000 * 60 * 60 * 12 })).toString("base64url"); const sig = createHmac("sha256", secret).update(payload).digest("base64url"); return `${payload}.${sig}`; }
export function readSession(token?: string) { try { if (!token) return null; const [payload, sig] = token.split("."); const expected = createHmac("sha256", secret).update(payload).digest("base64url"); if (!sig || sig.length !== expected.length || !timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null; const data = JSON.parse(Buffer.from(payload, "base64url").toString()) as { id: string; email: string; role: string; exp: number }; return data.exp > Date.now() ? data : null; } catch { return null; } }
export const allowedWindows: Record<number, [number, number][]> = { 1: [[12, 18]], 2: [[10, 14], [18, 21]], 3: [[10, 14], [18, 21]], 4: [[10, 14]] };
export function isAllowedSlot(date: string, time: string) { const [y, m, d] = date.split("-").map(Number); const weekday = new Date(Date.UTC(y, m - 1, d)).getUTCDay(); const hour = Number(time.split(":")[0]) + Number(time.split(":")[1]) / 60; return (allowedWindows[weekday] || []).some(([from, to]) => hour >= from && hour < to); }
