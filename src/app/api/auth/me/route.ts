import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ensureAdminUser, readSession } from "@/lib/appointments";
export async function GET() { const token = (await cookies()).get("finab_session")?.value; const session = readSession(token); if (!session) return NextResponse.json({ user: null }, { status: 401 }); const store = await ensureAdminUser(); const user = store.users.find((u) => u.id === session.id && u.active); if (!user) return NextResponse.json({ user: null }, { status: 401 }); return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role } }); }
