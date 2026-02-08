import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { cookies } from "next/headers";
import { isAdminFromCookies } from "@/lib/adminAuth";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function POST(req) {
  const cookieStore = await cookies();
  if (!isAdminFromCookies(cookieStore)) return unauthorized();

  const body = await req.json().catch(() => ({}));
  const items = Array.isArray(body?.items) ? body.items : [];

  const { error } = await supabaseAdmin
    .from("banners")
    .upsert(items, { onConflict: "id" });

  if (error) {
    return NextResponse.json(
      { error: error.message, code: error.code },
      { status: 400 }
    );
  }

  return NextResponse.json({ ok: true, count: items.length });
}

export async function DELETE(req) {
  const cookieStore = await cookies();
  if (!isAdminFromCookies(cookieStore)) return unauthorized();

  const body = await req.json().catch(() => ({}));
  const id = body?.id;

  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const { error } = await supabaseAdmin.from("banners").delete().eq("id", id);

  if (error) {
    return NextResponse.json(
      { error: error.message, code: error.code },
      { status: 400 }
    );
  }

  return NextResponse.json({ ok: true });
}
