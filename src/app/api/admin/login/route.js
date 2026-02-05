// src/app/api/admin/login/route.js
import { NextResponse } from "next/server";
import crypto from "crypto";

const COOKIE_NAME = process.env.ADMIN_COOKIE_NAME || "c4_admin";
const SECRET = process.env.ADMIN_COOKIE_SECRET || "dev_secret";

function sign(value) {
  return crypto.createHmac("sha256", SECRET).update(value).digest("hex");
}

export async function POST(req) {
  const { user, pass } = await req.json().catch(() => ({}));

  const ok = user === process.env.ADMIN_USER && pass === process.env.ADMIN_PASS;
  if (!ok) {
    return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });
  }

  const payload = `${Date.now()}`;
  const token = `${payload}.${sign(payload)}`;

  const res = NextResponse.json({ ok: true });

  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return res;
}
