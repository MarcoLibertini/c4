// src/app/api/admin/upload/route.js
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { cookies } from "next/headers";
import { getAdminToken, isValidAdminToken } from "@/lib/adminAuth";

export async function POST(req) {
  const cookieStore = await cookies();
  const token = getAdminToken(cookieStore);
  if (!isValidAdminToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get("file");
  const bucket = (form.get("bucket") || "products").toString();

  const ALLOWED = ["products", "banners"];
  if (!ALLOWED.includes(bucket)) {
    return NextResponse.json({ error: "Invalid bucket" }, { status: 400 });
  }
  if (!file) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 });
  }

  const ext = (file.name || "png").split(".").pop();
  const fileName = `${bucket}-${Date.now()}-${Math.random()
    .toString(16)
    .slice(2)}.${ext}`;

  const { error: upErr } = await supabaseAdmin.storage
    .from(bucket)
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: true,
      contentType: file.type || "image/png",
    });

  if (upErr) {
    return NextResponse.json({ error: upErr.message }, { status: 400 });
  }

  const { data } = supabaseAdmin.storage.from(bucket).getPublicUrl(fileName);
  const url = data?.publicUrl;

  if (!url) {
    return NextResponse.json({ error: "No public URL" }, { status: 500 });
  }

  return NextResponse.json({ url });
}
