// src/middleware.js
import { NextResponse } from "next/server";
import { isAdminFromRequestEdge } from "@/lib/adminAuthEdge";

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  const isAdminRoute = pathname.startsWith("/admin");
  const isAdminApi = pathname.startsWith("/api/admin");

  // Dejar pasar login y logout siempre
  if (pathname === "/admin/login") return NextResponse.next();
  if (pathname === "/api/admin/login") return NextResponse.next();
  if (pathname === "/api/admin/logout") return NextResponse.next();

  if (isAdminRoute || isAdminApi) {
    const ok = await isAdminFromRequestEdge(req);

    if (!ok) {
      // 🔒 API: responder 401 JSON
      if (isAdminApi) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      // 🔒 UI: redirigir al login
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
