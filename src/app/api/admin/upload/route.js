import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function POST(req) {
  const user = req.headers.get("x-admin-user");
  const pass = req.headers.get("x-admin-pass");

  if (user !== process.env.ADMIN_USER || pass !== process.env.ADMIN_PASS) {
    return unauthorized();
  }

  const form = await req.formData();
  const file = form.get("file");
  const bucket = (form.get("bucket") || "products").toString();

  if (!file)
    return NextResponse.json({ error: "Missing file" }, { status: 400 });

  const ext = (file.name?.split(".").pop() || "png").toLowerCase();
  const safeExt = ["png", "jpg", "jpeg", "webp"].includes(ext) ? ext : "png";

  const filename = `prod-${Date.now()}-${Math.random()
    .toString(16)
    .slice(2)}.${safeExt}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const { error: uploadError } = await supabaseAdmin.storage
    .from(bucket)
    .upload(filename, buffer, {
      contentType: file.type || "image/png",
      upsert: false,
    });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 400 });
  }

  const { data } = supabaseAdmin.storage
    .from("products")
    .getPublicUrl(filename);

  return NextResponse.json({ ok: true, url: data.publicUrl, path: filename });
}
