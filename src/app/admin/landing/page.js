"use client";

import { useEffect, useState } from "react";
import useLanding from "../../../data/useLanding";

export default function AdminLandingPage() {
  const { landing, save } = useLanding();
  const [draft, setDraft] = useState(landing);

  useEffect(() => {
    setDraft(landing);
  }, [landing]);

  const updateMenuLink = (idx, patch) => {
    setDraft((prev) => ({
      ...prev,
      menuLinks: (prev.menuLinks || []).map((l, i) =>
        i === idx ? { ...l, ...patch } : l
      ),
    }));
  };

  const addMenuLink = () => {
    setDraft((prev) => ({
      ...prev,
      menuLinks: [...(prev.menuLinks || []), { label: "Nuevo", href: "#" }],
    }));
  };

  const removeMenuLink = (idx) => {
    setDraft((prev) => ({
      ...prev,
      menuLinks: (prev.menuLinks || []).filter((_, i) => i !== idx),
    }));
  };

  // Footer helpers
  const setFooter = (patch) => {
    setDraft((prev) => ({
      ...prev,
      footer: { ...(prev.footer || {}), ...patch },
    }));
  };

  const updateFooterLink = (idx, patch) => {
    setDraft((prev) => ({
      ...prev,
      footer: {
        ...(prev.footer || {}),
        quickLinks: (prev.footer?.quickLinks || []).map((l, i) =>
          i === idx ? { ...l, ...patch } : l
        ),
      },
    }));
  };

  const addFooterLink = () => {
    setDraft((prev) => ({
      ...prev,
      footer: {
        ...(prev.footer || {}),
        quickLinks: [...(prev.footer?.quickLinks || []), { label: "Nuevo", href: "#" }],
      },
    }));
  };

  const removeFooterLink = (idx) => {
    setDraft((prev) => ({
      ...prev,
      footer: {
        ...(prev.footer || {}),
        quickLinks: (prev.footer?.quickLinks || []).filter((_, i) => i !== idx),
      },
    }));
  };

  const f = draft?.footer || {};
  const s = f.socials || {};

  return (
    <div className="text-black">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-2xl font-semibold">Landing</h2>
          <p className="text-sm text-black/70">
            Textos, menú y footer (links + redes + dirección).
          </p>
        </div>

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

      <div className="mt-6 space-y-6">
        {/* TOP BAR */}
        <div className="border rounded-2xl p-4">
          <h3 className="font-semibold">Barra superior (promo)</h3>
          <textarea
            className="mt-3 w-full border rounded-xl px-4 py-3 outline-none min-h-[90px]"
            value={draft?.topBarText || ""}
            onChange={(e) =>
              setDraft((prev) => ({ ...prev, topBarText: e.target.value }))
            }
          />
        </div>

        {/* MENU LINKS */}
        <div className="border rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Links del menú</h3>
            <button
              onClick={addMenuLink}
              className="rounded-xl border px-4 py-2 text-sm font-semibold hover:bg-black/5"
            >
              + Link
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {(draft?.menuLinks || []).map((l, idx) => (
              <div key={idx} className="border rounded-xl p-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-semibold">Texto</label>
                    <input
                      className="w-full border rounded-xl px-4 py-3 outline-none"
                      value={l.label || ""}
                      onChange={(e) =>
                        updateMenuLink(idx, { label: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold">Href</label>
                    <input
                      className="w-full border rounded-xl px-4 py-3 outline-none"
                      value={l.href || ""}
                      onChange={(e) =>
                        updateMenuLink(idx, { href: e.target.value })
                      }
                    />
                  </div>
                </div>

                <button
                  onClick={() => removeMenuLink(idx)}
                  className="mt-3 text-sm font-semibold underline hover:opacity-80"
                >
                  Eliminar link
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* FOOTER */}
        <div className="border rounded-2xl p-4">
          <h3 className="font-semibold">Footer</h3>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field
              label="Marca (nombre)"
              value={f.brand || ""}
              onChange={(v) => setFooter({ brand: v })}
            />
            <Field
              label="Tagline"
              value={f.tagline || ""}
              onChange={(v) => setFooter({ tagline: v })}
            />
            <Field
              label="Dirección"
              value={f.address || ""}
              onChange={(v) => setFooter({ address: v })}
            />
            <Field
              label="WhatsApp (con código país, ej: 549291...)"
              value={f.whatsapp || ""}
              onChange={(v) => setFooter({ whatsapp: v })}
            />
            <Field
              label="Email (opcional)"
              value={f.email || ""}
              onChange={(v) => setFooter({ email: v })}
            />
            <Field
              label="Copyright (usa {year})"
              value={f.copyright || ""}
              onChange={(v) => setFooter({ copyright: v })}
            />
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field
              label="Instagram (URL)"
              value={s.instagram || ""}
              onChange={(v) => setFooter({ socials: { ...s, instagram: v } })}
            />
            <Field
              label="Facebook (URL)"
              value={s.facebook || ""}
              onChange={(v) => setFooter({ socials: { ...s, facebook: v } })}
            />
            <Field
              label="Google Maps (URL)"
              value={s.maps || ""}
              onChange={(v) => setFooter({ socials: { ...s, maps: v } })}
            />
            <Field
              label="Sitio web (URL)"
              value={s.website || ""}
              onChange={(v) => setFooter({ socials: { ...s, website: v } })}
            />
          </div>

          <div className="mt-6 border rounded-xl p-3">
            <div className="flex items-center justify-between">
              <div className="font-semibold text-sm">Links rápidos del footer</div>
              <button
                onClick={addFooterLink}
                className="rounded-xl border px-4 py-2 text-sm font-semibold hover:bg-black/5"
              >
                + Link
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {(f.quickLinks || []).map((l, idx) => (
                <div key={idx} className="border rounded-xl p-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-semibold">Texto</label>
                      <input
                        className="w-full border rounded-xl px-4 py-3 outline-none"
                        value={l.label || ""}
                        onChange={(e) =>
                          updateFooterLink(idx, { label: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold">Href</label>
                      <input
                        className="w-full border rounded-xl px-4 py-3 outline-none"
                        value={l.href || ""}
                        onChange={(e) =>
                          updateFooterLink(idx, { href: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => removeFooterLink(idx)}
                    className="mt-3 text-sm font-semibold underline hover:opacity-80"
                  >
                    Eliminar link
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
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
