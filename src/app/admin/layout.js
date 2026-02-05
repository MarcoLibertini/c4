"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const isLogin = pathname === "/admin/login";

  const doLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login"; // ✅ hard reload
  };

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

            {!isLogin && (
              <button
                onClick={doLogout}
                className="rounded-xl bg-black text-white px-4 py-3 text-sm font-semibold hover:opacity-90"
              >
                Cerrar sesión
              </button>
            )}
          </div>
        </div>

        {/* Contenido */}
        {isLogin ? (
          <div className="mt-6">{children}</div>
        ) : (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6">
            <aside className="border rounded-2xl p-4 h-fit">
              <div className="text-xs font-semibold text-black/60 mb-2">
                SECCIONES
              </div>

              <nav className="space-y-1">
                <SideLink href="/admin/products" label="Productos" />
                <SideLink href="/admin/landing" label="Landing (header + footer)" />
                <SideLink href="/admin/banners" label="Carrusel/Banner" />
              </nav>

              <div className="mt-4 text-xs text-black/60">
                Tip: ya estamos con Supabase + Storage ✅
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
