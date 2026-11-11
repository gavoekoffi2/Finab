import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const read = (file) => readFileSync(join(root, file), "utf8");

test("owner-only appointment reset is protected and keeps an archive", () => {
  const dashboard = read("src/app/admin/dashboard/page.tsx");
  const route = read("src/app/api/appointments/route.ts");
  const store = read("src/lib/appointments.ts");

  assert.match(dashboard, /user\?\.role === "owner"/);
  assert.match(dashboard, /Réinitialiser les candidatures/);
  assert.match(dashboard, /window\.confirm/);
  assert.match(dashboard, /method:\s*"DELETE"/);
  assert.match(route, /export async function DELETE/);
  assert.match(route, /session\.role !== "owner"/);
  assert.match(store, /archiveAndClearAppointments/);
  assert.match(store, /appointments-archive-/);
});
