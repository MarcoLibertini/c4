import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function POST(req) {
  // Auth simple por headers (lo manda el Admin UI)
  const user = req.headers.get("x-admin-user");
  const pass = req.headers.get("x-admin-pass");

  if (user !== process.env.ADMIN_USER || pass !== process.env.ADMIN_PASS) {
    return unauthorized();
  }

  const body = await req.json();
  const items = Array.isArray(body?.items) ? body.items : [];

  // Validación mínima
  if (!items.length) {
    return NextResponse.json({ ok: true, count: 0 });
  }

  // Upsert con Service Role (bypassea RLS)
  const { error } = await supabaseAdmin
    .from("products")
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
  const user = req.headers.get("x-admin-user");
  const pass = req.headers.get("x-admin-pass");

  if (user !== process.env.ADMIN_USER || pass !== process.env.ADMIN_PASS) {
    return unauthorized();
  }

  const body = await req.json();
  const id = body?.id;

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const { error } = await supabaseAdmin.from("products").delete().eq("id", id);

  if (error) {
    return NextResponse.json(
      { error: error.message, code: error.code },
      { status: 400 }
    );
  }

  return NextResponse.json({ ok: true });
}
