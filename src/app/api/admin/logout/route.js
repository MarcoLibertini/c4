// src/app/api/admin/logout/route.js
import { NextResponse } from "next/server";

export async function POST() {
  const cookieName = process.env.ADMIN_COOKIE_NAME || "c4_admin";
  const res = NextResponse.json({ ok: true });

  res.cookies.set(cookieName, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(0),
  });

  return res;
}
