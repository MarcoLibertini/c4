// src/app/api/admin/landing/route.js
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { cookies } from "next/headers";
import { isAdminFromCookies } from "@/lib/adminAuth";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function POST(req) {
  const cookieStore = await cookies(); // ✅ Next 16.1+
  if (!isAdminFromCookies(cookieStore)) return unauthorized();

  const body = await req.json().catch(() => ({}));
  const landing = body?.landing;

  if (!landing || typeof landing !== "object") {
    return NextResponse.json({ error: "Missing landing" }, { status: 400 });
  }

  const { error } = await supabaseAdmin.from("site_settings").upsert(
    {
      key: "landing",
      value: landing,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "key" }
  );

  if (error) {
    return NextResponse.json(
      { error: error.message, code: error.code },
      { status: 400 }
    );
  }

  return NextResponse.json({ ok: true });
}
