"use client";

import { useEffect, useState } from "react";
import { products as seedProducts } from "../../../data/products";

import { supabase } from "@/lib/supabase";

export default function AdminProductsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- Helpers: UI <-> DB
  const toDb = (p) => ({
    id: p.id,
    name: p.name,
    image_url: p.imageUrl,
    discount_percent: Number(p.discountPercent ?? 0),
    price_old:
      p.priceOld === "" || p.priceOld == null ? null : Number(p.priceOld),
    price_now: Number(p.priceNow ?? 0),
    transfer_price: Number(p.transferPrice ?? 0),
    installments_count: Number(p.installments?.count ?? 3),
    installments_amount: Number(p.installments?.amount ?? 0),
  });

  const fromDb = (p) => ({
    id: p.id,
    name: p.name ?? "",
    imageUrl: p.image_url ?? "",
    discountPercent: p.discount_percent ?? 0,
    priceOld: p.price_old,
    priceNow: p.price_now ?? 0,
    transferPrice: p.transfer_price ?? 0,
    installments: {
      count: p.installments_count ?? 3,
      amount: p.installments_amount ?? 0,
    },
  });

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("products").select("*");
    if (error) {
      console.error("Supabase load error:", error);
      alert("Error cargando productos (mirá la consola).");
      setLoading(false);
      return;
    }
    setItems((data || []).map(fromDb));
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const save = async () => {
    const payload = items.map(toDb);

    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: payload }),
    });

    const out = await res.json();

    if (!res.ok) {
      console.error("API save error:", out);
      alert("Error guardando ❌ (mirá consola)");
      return;
    }

    alert("Guardado ✅");
    window.dispatchEvent(new Event("c4laser-products-updated"));
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
    const id = globalThis.crypto?.randomUUID?.() || `prod-${Date.now()}`;
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

  const removeProduct = async (id) => {
    if (!confirm("¿Eliminar producto?")) return;

    const res = await fetch("/api/admin/products", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    const out = await res.json().catch(() => ({}));

    if (!res.ok) {
      console.error("API delete error:", out);
      alert(out?.error || "Error eliminando ❌ (mirá consola)");
      return;
    }

    setItems((prev) => prev.filter((x) => x.id !== id));
    window.dispatchEvent(new Event("c4laser-products-updated"));
  };

  //agrego el subir imagen
  const uploadImage = async (file) => {
    const form = new FormData();
    form.append("file", file);
    form.append("bucket", "products");
  
    const res = await fetch("/api/admin/upload", {
      method: "POST",
      body: form,
    });
  
    const out = await res.json().catch(() => ({}));
    if (!res.ok) {
      console.error("Upload error:", out);
      alert(out?.error || "Error subiendo imagen ❌");
      return null;
    }
    return out.url;
  };
  

  const restoreBase = async () => {
    if (!confirm("¿Restaurar productos base? Esto reemplaza/crea por ID."))
      return;

    // Ojo: si tus seedProducts no tienen id únicos, agregalos.
    const base = seedProducts.map((p) => ({
      ...p,
      id:
        p.id ||
        globalThis.crypto?.randomUUID?.() ||
        `seed-${Date.now()}-${Math.random()}`,
    }));

    const payload = base.map(toDb);

    const { error } = await supabase
      .from("products")
      .upsert(payload, { onConflict: "id" });

    if (error) {
      console.error("Supabase restore error:", error);
      alert("Error restaurando base (mirá la consola).");
      return;
    }

    alert("Base restaurada ✅");
    await load();
    window.dispatchEvent(new Event("c4laser-products-updated"));
  };

  return (
    <div className="text-black">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-2xl font-semibold">Productos</h2>
          <p className="text-sm text-black/70">
            {loading ? "Cargando..." : "Editá y guardá en Supabase."}
          </p>
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

                <label className="block mt-3 text-sm font-semibold">
                  Nombre
                </label>
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
                      update(it.id, { priceOld: v === "" ? null : Number(v) })
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
                  <div>
                    <label className="block text-sm font-semibold">
                      Imagen
                    </label>

                    <div className="mt-2 flex flex-col gap-2">
                      <input
                        className="w-full border rounded-xl px-4 py-3 outline-none"
                        value={it.imageUrl ?? ""}
                        onChange={(e) =>
                          update(it.id, { imageUrl: e.target.value })
                        }
                        placeholder="URL o subí una imagen"
                      />

                      <div className="flex items-center gap-2">
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/webp"
                          onChange={async (e) => {
                            const input = e.currentTarget;
                            const file = input.files?.[0];
                            if (!file) return;

                            const url = await uploadImage(file);
                            if (url) update(it.id, { imageUrl: url });

                            input.value = "";
                          }}
                        />

                        <span className="text-xs text-black/60">
                          PNG/JPG/WEBP
                        </span>
                      </div>
                    </div>
                  </div>
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

        {!loading && items.length === 0 && (
          <div className="text-sm text-black/70">
            No hay productos. Tocá “+ Producto” o “Restaurar base”.
          </div>
        )}
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
