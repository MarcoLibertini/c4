"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminBannersPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("banners")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) {
      console.error(error);
      alert("Error cargando banners (mirá consola)");
      setLoading(false);
      return;
    }

    setItems(data || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const uploadBanner = async (file) => {
    const form = new FormData();
    form.append("file", file);
    form.append("bucket", "banners");

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

    const url = out?.url;
    if (!url) {
      console.error("Upload response sin URL:", out);
      alert("Subió el archivo pero no recibí la URL. Revisá /api/admin/upload");
      return null;
    }
    return url;
  };
  const add = () => {
    const id = globalThis.crypto?.randomUUID?.() || `banner-${Date.now()}`;
    setItems((prev) => [
      {
        id,
        title: "",
        image_url: "",
        link_url: "",
        sort_order: prev.length,
        is_active: true,
      },
      ...prev,
    ]);
  };

  const update = (id, patch) => {
    setItems((prev) => prev.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  };

  const save = async () => {
    const invalid = items.find((b) => !b.image_url);
    if (invalid) {
      alert("Hay banners sin imagen. Subí la imagen o eliminá ese banner.");
      return;
    }

    const res = await fetch("/api/admin/banners", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    });

    const out = await res.json().catch(() => ({}));
    if (!res.ok) {
      console.error("Save error:", out);
      alert("Error guardando ❌ (mirá consola)");
      return;
    }

    alert("Guardado ✅");
    window.dispatchEvent(new Event("c4laser-banners-updated"));
    await load();
  };

  const remove = async (id) => {
    if (!confirm("¿Eliminar banner?")) return;

    const res = await fetch("/api/admin/banners", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    const out = await res.json().catch(() => ({}));
    if (!res.ok) {
      console.error("Delete error:", out);
      alert("Error eliminando ❌ (mirá consola)");
      return;
    }

    setItems((prev) => prev.filter((x) => x.id !== id));
    window.dispatchEvent(new Event("c4laser-banners-updated"));
  };

  return (
    <div className="text-black">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-2xl font-semibold">Banners</h2>
          <p className="text-sm text-black/70">
            {loading ? "Cargando..." : "Carrusel debajo del header."}
          </p>
        </div>

        <div className="flex gap-2 flex-wrap justify-end">
          <button
            onClick={add}
            className="rounded-xl border px-4 py-3 text-sm font-semibold hover:bg-black/5"
          >
            + Banner
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

                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold">
                      Título (opcional)
                    </label>
                    <input
                      className="w-full border rounded-xl px-4 py-3 outline-none"
                      value={it.title ?? ""}
                      onChange={(e) => update(it.id, { title: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold">
                      Link (opcional)
                    </label>
                    <input
                      className="w-full border rounded-xl px-4 py-3 outline-none"
                      value={it.link_url ?? ""}
                      onChange={(e) =>
                        update(it.id, { link_url: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold">
                      Orden (0 = primero)
                    </label>
                    <input
                      type="number"
                      className="w-full border rounded-xl px-4 py-3 outline-none"
                      value={it.sort_order ?? 0}
                      onChange={(e) =>
                        update(it.id, { sort_order: Number(e.target.value) })
                      }
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="text-sm font-semibold">Activo</label>
                    <input
                      type="checkbox"
                      checked={!!it.is_active}
                      onChange={(e) =>
                        update(it.id, { is_active: e.target.checked })
                      }
                    />
                  </div>
                </div>

                <div className="mt-3">
                  <label className="block text-sm font-semibold">Imagen</label>
                  <div className="mt-2 flex flex-col gap-2">
                    <input
                      className="w-full border rounded-xl px-4 py-3 outline-none"
                      value={it.image_url ?? ""}
                      onChange={(e) =>
                        update(it.id, { image_url: e.target.value })
                      }
                      placeholder="URL o subí una imagen"
                    />

                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={async (e) => {
                        const input = e.currentTarget; // ✅ guardo referencia estable
                        const file = input.files?.[0];
                        if (!file) return;

                        const url = await uploadBanner(file);
                        if (url) update(it.id, { image_url: url });

                        input.value = ""; // ✅ reset sin romper
                      }}
                    />

                    {!!it.image_url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={it.image_url}
                        alt="banner"
                        className="mt-2 w-full max-w-xl rounded-xl border object-cover"
                      />
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={() => remove(it.id)}
                className="text-sm font-semibold underline hover:opacity-80"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}

        {!loading && items.length === 0 && (
          <div className="text-sm text-black/70">No hay banners todavía.</div>
        )}
      </div>
    </div>
  );
}
