import { NextResponse } from "next/server";

export function middleware(req) {
  const cookieName = process.env.ADMIN_COOKIE_NAME || "c4_admin";
  const token = req.cookies.get(cookieName)?.value;

  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
  if (!isAdminRoute) return NextResponse.next();

  // permitir /admin/login siempre
  if (req.nextUrl.pathname === "/admin/login") {
    return NextResponse.next();
  }

  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
