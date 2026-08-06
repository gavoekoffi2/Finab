import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createSession, findUser } from "@/lib/appointments";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const login = typeof body.login === "string" ? body.login : "";
  const password = typeof body.password === "string" ? body.password : "";
  const user = await findUser(login);
  if (!user || !(await import("@/lib/appointments")).verifyPassword(password, user.passwordHash)) return NextResponse.json({ error: "Identifiant ou mot de passe incorrect." }, { status: 401 });
  const cookieStore = await cookies(); cookieStore.set("finab_session", createSession(user), { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 12 });
  return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role } });
}
