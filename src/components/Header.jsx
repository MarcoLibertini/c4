"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, HelpCircle, User, ShoppingCart } from "lucide-react";
import CartDrawer from "./CartDrawer";
import { useCart } from "../store/cart";
import useLanding from "../data/useLanding";

export default function Header({ query, setQuery }) {
  const router = useRouter();
  const [openCart, setOpenCart] = useState(false);
  const { count, hydrated } = useCart();

  const { landing } = useLanding();

  return (
    <header className="w-full">
      {/* Barra superior (editable desde /admin/landing) */}
      <div className="bg-black text-white text-xs py-2">
        <div className="mx-auto max-w-6xl px-4 text-center">
          {landing?.topBarText ||
            "3 y 6 CUOTAS SIN INTERÉS! 20% OFF TRANSFERENCIA - 3x2 y 4x3 etiquetas y dijes"}
        </div>
      </div>

      {/* Header principal */}
      <div className="border-b bg-white">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center gap-4">
          {/* Buscador */}
          <div className="flex-1">
            <div className="flex items-center gap-2 rounded-full border px-4 py-2">
              <input
                className="w-full outline-none text-sm text-black"
                placeholder="¿Qué estás buscando?"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <Search className="h-5 w-5 text-neutral-700" />
            </div>
          </div>

          {/* Logo (placeholder) */}
          <div className="flex items-center justify-center">
            <div className="h-10 w-10 rounded-full bg-yellow-300 flex items-center justify-center font-bold text-black">
              C4
            </div>
          </div>

          {/* Botones derecha */}
          <div className="hidden sm:flex items-center gap-6 text-sm text-black">
            <button className="flex items-center gap-2 hover:opacity-80">
              <HelpCircle className="h-5 w-5" />
              <span>Ayuda</span>
            </button>

            <button
              onClick={() => router.push("/admin")}
              className="flex items-center gap-2 hover:opacity-80"
            >
              <User className="h-5 w-5" />
              <span>Mi cuenta</span>
            </button>

            <button
              onClick={() => setOpenCart(true)}
              className="relative flex items-center gap-2 hover:opacity-80"
            >
              <ShoppingCart className="h-5 w-5" />
              <span>Mi carrito</span>

              {hydrated && count > 0 && (
                <span className="absolute -top-2 -right-3 h-5 min-w-5 px-1 rounded-full bg-black text-white text-xs flex items-center justify-center">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Menú inferior (editable desde /admin/landing) */}
      <nav className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-4 flex gap-8 text-sm overflow-x-auto">
          {(landing?.menuLinks?.length
            ? landing.menuLinks
            : [
                { label: "Inicio", href: "#" },
                { label: "Productos", href: "#productos" },
                { label: "Contacto", href: "#contacto" },
                { label: "Preguntas Frecuentes", href: "#faq" },
                { label: "Catálogo de Materiales", href: "#materiales" },
                { label: "Cómo Comprar", href: "#comprar" },
              ]
          ).map((l, idx) => (
            <a
              key={idx}
              className="whitespace-nowrap hover:opacity-80 text-black"
              href={l.href || "#"}
            >
              {l.label || "Link"}
            </a>
          ))}
        </div>
      </nav>

      {/* Drawer del carrito */}
      <CartDrawer open={openCart} onClose={() => setOpenCart(false)} />
    </header>
  );
}
