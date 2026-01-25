"use client";

import { X, Minus, Plus } from "lucide-react";
import { useCart } from "../store/cart";

function formatARS(n) {
  return n.toLocaleString("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function CartDrawer({ open, onClose }) {
  const { items, inc, dec, remove, clear, total } = useCart();

  const phone = "5492916439736";
  const msg = () => {
    const lines = items.map(
      (it) => `• ${it.name} x${it.qty} - $${formatARS(it.priceNow * it.qty)}`
    );
    const text =
      `Hola! Quiero comprar:\n` +
      (lines.length ? lines.join("\n") : "• (carrito vacío)") +
      `\n\nTotal: $${formatARS(total)}\n\n¿Me confirmás stock y forma de pago?`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className={`fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`}>
      {/* overlay */}
      <div
        className={`absolute inset-0 bg-black/40 transition ${
          open ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* panel */}
      <div
        className={`absolute right-0 top-0 h-full w-full max-w-sm bg-white text-black shadow-xl transition-transform ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-semibold text-black">Mi carrito</h3>
          <button onClick={onClose} className="p-2 hover:opacity-70">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Items */}
        <div className="p-4 space-y-4 overflow-auto h-[calc(100%-180px)]">
          {items.length === 0 ? (
            <p className="text-sm text-black/70">
              Tu carrito está vacío.
            </p>
          ) : (
            items.map((it) => (
              <div
                key={it.id}
                className="border rounded-xl p-3 text-black"
              >
                <div className="font-semibold">{it.name}</div>

                <div className="mt-1 text-sm text-black/70">
                  ${formatARS(it.priceNow)} c/u
                </div>

                <div className="mt-3 flex items-center justify-between">
                  {/* Cantidad */}
                  <div className="flex items-center gap-2">
                    <button
                      className="p-2 border rounded-lg hover:bg-black/5"
                      onClick={() => dec(it.id)}
                    >
                      <Minus className="h-4 w-4" />
                    </button>

                    <span className="w-8 text-center font-semibold">
                      {it.qty}
                    </span>

                    <button
                      className="p-2 border rounded-lg hover:bg-black/5"
                      onClick={() => inc(it.id)}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Quitar */}
                  <button
                    className="text-sm font-semibold underline hover:opacity-80"
                    onClick={() => remove(it.id)}
                  >
                    Quitar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t">
          <div className="flex items-center justify-between font-semibold text-black">
            <span>Total</span>
            <span>${formatARS(total)}</span>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              onClick={clear}
              className="rounded-xl border py-3 text-sm font-semibold text-black hover:bg-black/5"
            >
              Vaciar
            </button>

            <a
              href={msg()}
              target="_blank"
              rel="noreferrer"
              className={`rounded-xl bg-black text-white py-3 text-sm font-semibold text-center ${
                items.length === 0
                  ? "pointer-events-none opacity-40"
                  : "hover:opacity-90"
              }`}
            >
              Finalizar WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
