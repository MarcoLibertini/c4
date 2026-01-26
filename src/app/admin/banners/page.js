"use client";

import { useEffect, useState } from "react";
import useBanners from "../../../data/useBanners";

export default function AdminBannersPage() {
  const { banners, save } = useBanners();
  const [draft, setDraft] = useState(banners);

  useEffect(() => setDraft(banners), [banners]);

  const update = (id, patch) => {
    setDraft((prev) => prev.map((b) => (b.id === id ? { ...b, ...patch } : b)));
  };

  const add = () => {
    const id = `b-${Date.now()}`;
    setDraft((prev) => [
      {
        id,
        title: "Nuevo banner",
        subtitle: "",
        imageUrl: "/banners/banner.jpg",
        ctaLabel: "Ver más",
        ctaHref: "#productos",
      },
      ...prev,
    ]);
  };

  const remove = (id) => {
    if (!confirm("¿Eliminar banner?")) return;
    setDraft((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    <div className="text-black">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-2xl font-semibold">Carrusel / Banner</h2>
          <p className="text-sm text-black/70">
            Editá los slides del banner debajo del header.
          </p>
        </div>

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={add}
            className="rounded-xl border px-4 py-3 text-sm font-semibold hover:bg-black/5"
          >
            + Banner
          </button>
          <button
            onClick={() => {
              save(draft);
              alert("Guardado ✅");
            }}
            className="rounded-xl bg-black text-white px-4 py-3 text-sm font-semibold hover:opacity-90"
          >
            Guardar
          </button>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {draft.map((b) => (
          <div key={b.id} className="border rounded-2xl p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="text-xs text-black/60">ID: {b.id}</div>

                <Field
                  label="Título"
                  value={b.title || ""}
                  onChange={(v) => update(b.id, { title: v })}
                />
                <Field
                  label="Subtítulo"
                  value={b.subtitle || ""}
                  onChange={(v) => update(b.id, { subtitle: v })}
                />
                <Field
                  label="Imagen (URL)"
                  value={b.imageUrl || ""}
                  onChange={(v) => update(b.id, { imageUrl: v })}
                />

                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Field
                    label="Texto botón (CTA)"
                    value={b.ctaLabel || ""}
                    onChange={(v) => update(b.id, { ctaLabel: v })}
                  />
                  <Field
                    label="Link botón (CTA href)"
                    value={b.ctaHref || ""}
                    onChange={(v) => update(b.id, { ctaHref: v })}
                  />
                </div>

                <div className="mt-3 text-xs text-black/60">
                  Tip: para WhatsApp poné un link tipo{" "}
                  <span className="font-semibold">https://wa.me/5492916439736</span>
                </div>
              </div>

              <button
                onClick={() => remove(b.id)}
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
    <div className="mt-3">
      <label className="block text-sm font-semibold">{label}</label>
      <input
        className="w-full border rounded-xl px-4 py-3 outline-none"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
