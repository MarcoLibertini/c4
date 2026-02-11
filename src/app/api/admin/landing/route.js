// src/app/api/admin/landing/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { revalidatePath, revalidateTag } from "next/cache";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { isAdminFromCookies } from "@/lib/adminAuth";
import { landingDefaults } from "@/data/landingDefaults";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

function mergeLanding(v) {
  return { ...landingDefaults, ...(v || {}) };
}

export async function GET() {
  const cookieStore = await cookies();
  if (!isAdminFromCookies(cookieStore)) return unauthorized();

  const { data, error } = await supabaseAdmin
    .from("site_settings")
    .select("value")
    .eq("key", "landing")
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ landing: mergeLanding(data?.value || {}) });
}

export async function POST(req) {
  const cookieStore = await cookies();
  if (!isAdminFromCookies(cookieStore)) return unauthorized();

  const body = await req.json().catch(() => ({}));
  const landing = mergeLanding(body?.landing || {});

  const { error } = await supabaseAdmin
    .from("site_settings")
    .upsert({ key: "landing", value: landing }, { onConflict: "key" });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  // ✅ Instantáneo: invalida cache por TAG (esto es lo importante)
  revalidateTag("landing");

  // ✅ opcional: también invalida paths (no hace daño)
  revalidatePath("/");
  revalidatePath("/admin/landing");

  return NextResponse.json({ ok: true });
}
