import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isAdminFromCookies } from "@/lib/adminAuth";

export async function GET() {
  const cookieStore = await cookies(); // ✅ Next 16.1+
  const ok = isAdminFromCookies(cookieStore);
  return NextResponse.json({ logged: !!ok });
}
