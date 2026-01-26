"use client";

import { useEffect, useState } from "react";
import { products as seedProducts } from "../../../data/products";

const KEY = "c4laser_admin_products_v1";

export default function AdminProductsPage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return setItems(parsed);
      } catch {}
    }
    setItems(seedProducts);
  }, []);

  const save = () => {
    localStorage.setItem(KEY, JSON.stringify(items));
    window.dispatchEvent(new Event("c4laser-products-updated"));
    alert("Guardado ✅");
  };

  const update = (id, patch) => {
    setItems((prev) =>
      prev.map((it) => {
        if (it.id !== id) return it;

        if (patch.installments) {
          return {
            ...it,
            ...patch,
            installments: {
              ...(it.installments || { count: 3, amount: 0 }),
              ...patch.installments,
            },
          };
        }

        return { ...it, ...patch };
      })
    );
  };

  const addProduct = () => {
    const id = `prod-${Date.now()}`;
    setItems((prev) => [
      {
        id,
        name: "Nuevo producto",
        imageUrl: "/products/placeholder.jpg",
        discountPercent: 0,
        priceOld: null,
        priceNow: 0,
        transferPrice: 0,
        installments: { count: 3, amount: 0 },
      },
      ...prev,
    ]);
  };

  const removeProduct = (id) => {
    if (!confirm("¿Eliminar producto?")) return;
    setItems((prev) => prev.filter((x) => x.id !== id));
  };

  const restoreBase = () => {
    if (!confirm("¿Restaurar productos base? Se perderán cambios.")) return;
    setItems(seedProducts);
    localStorage.removeItem(KEY);
    window.dispatchEvent(new Event("c4laser-products-updated"));
  };

  return (
    <div className="text-black">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-2xl font-semibold">Productos</h2>
          <p className="text-sm text-black/70">Editá y guardá.</p>
        </div>

        <div className="flex gap-2 flex-wrap justify-end">
          <button
            onClick={addProduct}
            className="rounded-xl border px-4 py-3 text-sm font-semibold hover:bg-black/5"
          >
            + Producto
          </button>

          <button
            onClick={restoreBase}
            className="rounded-xl border px-4 py-3 text-sm font-semibold hover:bg-black/5"
          >
            Restaurar base
          </button>

          <button
            onClick={save}
            className="rounded-xl bg-black text-white px-4 py-3 text-sm font-semibold hover:opacity-90"
          >
            Guardar
          </button>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {items.map((it) => (
          <div key={it.id} className="border rounded-2xl p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="text-xs text-black/60">ID: {it.id}</div>

                <label className="block mt-3 text-sm font-semibold">Nombre</label>
                <input
                  className="w-full border rounded-xl px-4 py-3 outline-none"
                  value={it.name}
                  onChange={(e) => update(it.id, { name: e.target.value })}
                />

                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <Field
                    label="Descuento %"
                    value={it.discountPercent ?? 0}
                    onChange={(v) =>
                      update(it.id, { discountPercent: Number(v) })
                    }
                  />
                  <Field
                    label="Precio viejo"
                    value={it.priceOld ?? ""}
                    onChange={(v) =>
                      update(it.id, {
                        priceOld: v === "" ? null : Number(v),
                      })
                    }
                  />
                  <Field
                    label="Precio actual"
                    value={it.priceNow ?? 0}
                    onChange={(v) => update(it.id, { priceNow: Number(v) })}
                  />
                  <Field
                    label="Transferencia"
                    value={it.transferPrice ?? 0}
                    onChange={(v) =>
                      update(it.id, { transferPrice: Number(v) })
                    }
                  />
                </div>

                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <Field
                    label="Imagen (URL)"
                    value={it.imageUrl ?? ""}
                    onChange={(v) => update(it.id, { imageUrl: v })}
                  />
                  <Field
                    label="Cuotas (cantidad)"
                    value={it.installments?.count ?? 3}
                    onChange={(v) =>
                      update(it.id, { installments: { count: Number(v) } })
                    }
                  />
                  <Field
                    label="Valor cuota"
                    value={it.installments?.amount ?? 0}
                    onChange={(v) =>
                      update(it.id, { installments: { amount: Number(v) } })
                    }
                  />
                </div>
              </div>

              <button
                onClick={() => removeProduct(it.id)}
                className="text-sm font-semibold underline hover:opacity-80"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Field({ label, value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-semibold">{label}</label>
      <input
        className="w-full border rounded-xl px-4 py-3 outline-none"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
