import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req) {
  const user = req.headers.get("x-admin-user");
  const pass = req.headers.get("x-admin-pass");

  if (user !== process.env.ADMIN_USER || pass !== process.env.ADMIN_PASS) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get("file");
  const bucket = (form.get("bucket") || "products").toString();
  console.log("UPLOAD bucket:", bucket, "file:", file?.name);
/*  */


  const ALLOWED = ["products", "banners"];
  if (!ALLOWED.includes(bucket)) {
    return NextResponse.json({ error: "Invalid bucket" }, { status: 400 });
  }

  if (!file) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 });
  }

  const ext = (file.name || "png").split(".").pop();
  const fileName = `${bucket}-${Date.now()}-${Math.random().toString(16).slice(2)}.${ext}`;
  const filePath = fileName;

  const { error: upErr } = await supabaseAdmin.storage
    .from(bucket)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: true,
      contentType: file.type || "image/png",
    });

  if (upErr) {
    return NextResponse.json({ error: upErr.message }, { status: 400 });
  }

  // ✅ URL pública
  const { data } = supabaseAdmin.storage.from(bucket).getPublicUrl(filePath);
  const url = data?.publicUrl;

  if (!url) {
    return NextResponse.json({ error: "No public URL" }, { status: 500 });
  }
  
  return NextResponse.json({ url });
}
