"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import useAdminSession from "./_session";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { ready, logged, logout } = useAdminSession();

  useEffect(() => {
    if (!ready) return;

    // Si no está logueado, lo único permitido es /admin/login
    if (!logged && pathname !== "/admin/login") {
      router.replace("/admin/login");
    }

    // Si está logueado y entra a /admin/login, lo mando a products
    if (logged && pathname === "/admin/login") {
      router.replace("/admin/products");
    }
  }, [ready, logged, pathname, router]);

  if (!ready) return null;

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="mx-auto max-w-6xl px-4 py-6">
        {/* Top bar admin */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h1 className="text-xl font-semibold">Admin C4 LASER</h1>
            <p className="text-sm text-black/70">Panel de control</p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="rounded-xl border px-4 py-3 text-sm font-semibold hover:bg-black/5"
            >
              ← Volver a Home
            </Link>

            {logged && (
              <button
                onClick={() => {
                  logout();
                  router.replace("/admin/login");
                }}
                className="rounded-xl bg-black text-white px-4 py-3 text-sm font-semibold hover:opacity-90"
              >
                Cerrar sesión
              </button>
            )}
          </div>
        </div>

        {/* Contenido */}
        {!logged ? (
          // Login sin sidebar
          <div className="mt-6">{children}</div>
        ) : (
          // Panel con sidebar
          <div className="mt-6 grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6">
            <aside className="border rounded-2xl p-4 h-fit">
              <div className="text-xs font-semibold text-black/60 mb-2">
                SECCIONES
              </div>

              <nav className="space-y-1">
                <SideLink href="/admin/products" label="Productos" />
                <SideLink
                  href="/admin/landing"
                  label="Landing (header + footer)"
                />
                <SideLink href="/admin/banners" label="Carrusel/Banner" />
              </nav>

              <div className="mt-4 text-xs text-black/60">
                Tip: luego migramos todo a Supabase.
              </div>
            </aside>

            <main className="min-w-0">{children}</main>
          </div>
        )}
      </div>
    </div>
  );
}

function SideLink({ href, label }) {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link
      href={href}
      className={`block rounded-xl px-3 py-2 text-sm font-semibold transition ${
        active ? "bg-black text-white" : "hover:bg-black/5 text-black"
      }`}
    >
      {label}
    </Link>
  );
}
