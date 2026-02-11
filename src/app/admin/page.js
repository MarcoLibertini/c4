"use client";

import Link from "next/link";

export default function AdminHome() {
  return (
    <div className="text-black space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Panel de administración</h2>
        <p className="text-sm text-black/70">
          Elegí qué querés administrar.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <AdminCard
          title="Productos"
          desc="Editar precios, imágenes y cuotas"
          href="/admin/products"
        />

        <AdminCard
          title="Landing"
          desc="Header, textos, FAQ, footer y contacto"
          href="/admin/landing"
        />

        <AdminCard
          title="Carrusel"
          desc="Banners principales del sitio"
          href="/admin/banners"
        />
      </div>
    </div>
  );
}

function AdminCard({ title, desc, href }) {
  return (
    <Link
      href={href}
      className="border rounded-2xl p-4 hover:bg-black/5 transition"
    >
      <div className="font-semibold">{title}</div>
      <div className="text-sm text-black/70 mt-1">{desc}</div>
    </Link>
  );
}
