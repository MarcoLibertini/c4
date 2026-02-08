"use client";

import { useEffect, useState } from "react";
import useLanding from "../../../data/useLanding";

export default function AdminLandingPage() {
  const { landing, save, loading } = useLanding();
  const [draft, setDraft] = useState(landing);
  const [saving, setSaving] = useState(false);

  useEffect(() => setDraft(landing), [landing]);

  // MENU
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

  // FOOTER
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
        quickLinks: [
          ...(prev.footer?.quickLinks || []),
          { label: "Nuevo", href: "#" },
        ],
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

  // HOW TO BUY
  const setHowToBuy = (patch) => {
    setDraft((prev) => ({
      ...prev,
      howToBuy: { ...(prev.howToBuy || {}), ...patch },
    }));
  };
  const updateStep = (idx, patch) => {
    setDraft((prev) => ({
      ...prev,
      howToBuy: {
        ...(prev.howToBuy || {}),
        steps: (prev.howToBuy?.steps || []).map((s, i) =>
          i === idx ? { ...s, ...patch } : s
        ),
      },
    }));
  };
  const addStep = () => {
    setDraft((prev) => ({
      ...prev,
      howToBuy: {
        ...(prev.howToBuy || {}),
        steps: [
          ...(prev.howToBuy?.steps || []),
          { title: "Paso nuevo", text: "Descripción" },
        ],
      },
    }));
  };
  const removeStep = (idx) => {
    setDraft((prev) => ({
      ...prev,
      howToBuy: {
        ...(prev.howToBuy || {}),
        steps: (prev.howToBuy?.steps || []).filter((_, i) => i !== idx),
      },
    }));
  };

  // FAQ
  const setFaq = (patch) => {
    setDraft((prev) => ({ ...prev, faq: { ...(prev.faq || {}), ...patch } }));
  };
  const updateFaqItem = (idx, patch) => {
    setDraft((prev) => ({
      ...prev,
      faq: {
        ...(prev.faq || {}),
        items: (prev.faq?.items || []).map((it, i) =>
          i === idx ? { ...it, ...patch } : it
        ),
      },
    }));
  };
  const addFaqItem = () => {
    setDraft((prev) => ({
      ...prev,
      faq: {
        ...(prev.faq || {}),
        items: [
          ...(prev.faq?.items || []),
          { q: "Nueva pregunta", a: "Respuesta" },
        ],
      },
    }));
  };
  const removeFaqItem = (idx) => {
    setDraft((prev) => ({
      ...prev,
      faq: {
        ...(prev.faq || {}),
        items: (prev.faq?.items || []).filter((_, i) => i !== idx),
      },
    }));
  };

  const f = draft?.footer || {};
  const s = f.socials || {};

  const setContact = (patch) => {
    setDraft((prev) => ({
      ...prev,
      contact: { ...(prev.contact || {}), ...patch },
    }));
  };

  const updateHour = (idx, patch) => {
    setDraft((prev) => ({
      ...prev,
      contact: {
        ...(prev.contact || {}),
        hours: (prev.contact?.hours || []).map((h, i) =>
          i === idx ? { ...h, ...patch } : h
        ),
      },
    }));
  };

  return (
    <div className="text-black">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-2xl font-semibold">Landing</h2>
          <p className="text-sm text-black/70">
            {loading ? "Cargando desde Supabase..." : "Textos, menú, FAQ y footer."}
          </p>
        </div>

        <button
          disabled={saving}
          onClick={async () => {
            if (saving) return;
            setSaving(true);
            try {
              await save(draft);
              alert("Guardado ✅ (Supabase)");
            } catch (e) {
              console.error(e);
              alert(e?.message || "Error guardando ❌");
            } finally {
              setSaving(false);
            }
          }}
          className="rounded-xl bg-black text-white px-4 py-3 text-sm font-semibold hover:opacity-90 disabled:opacity-60"
        >
          {saving ? "Guardando..." : "Guardar"}
        </button>
      </div>

      {/* ✅ Todo lo demás lo dejé igual */}
      <div className="mt-6 space-y-6">
        {/* TOP BAR */}
        <Box title="Barra superior (promo)">
          <textarea
            className="mt-3 w-full border rounded-xl px-4 py-3 outline-none min-h-[90px]"
            value={draft?.topBarText || ""}
            onChange={(e) =>
              setDraft((prev) => ({ ...prev, topBarText: e.target.value }))
            }
          />
        </Box>

        {/* MENU */}
        <Box
          title="Links del menú"
          action={
            <button
              onClick={addMenuLink}
              className="rounded-xl border px-4 py-2 text-sm font-semibold hover:bg-black/5"
            >
              + Link
            </button>
          }
        >
          <div className="mt-4 space-y-3">
            {(draft?.menuLinks || []).map((l, idx) => (
              <div key={idx} className="border rounded-xl p-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Field
                    label="Texto"
                    value={l.label || ""}
                    onChange={(v) => updateMenuLink(idx, { label: v })}
                  />
                  <Field
                    label="Href"
                    value={l.href || ""}
                    onChange={(v) => updateMenuLink(idx, { href: v })}
                  />
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
        </Box>

        {/* HOW TO BUY */}
        <Box
          title="Cómo comprar"
          action={
            <button
              onClick={addStep}
              className="rounded-xl border px-4 py-2 text-sm font-semibold hover:bg-black/5"
            >
              + Paso
            </button>
          }
        >
          <Field
            label="Título"
            value={draft?.howToBuy?.title || ""}
            onChange={(v) => setHowToBuy({ title: v })}
          />

          <div className="mt-4 space-y-3">
            {(draft?.howToBuy?.steps || []).map((st, idx) => (
              <div key={idx} className="border rounded-xl p-3">
                <Field
                  label="Título del paso"
                  value={st.title || ""}
                  onChange={(v) => updateStep(idx, { title: v })}
                />
                <div className="mt-3">
                  <label className="block text-sm font-semibold">
                    Descripción
                  </label>
                  <textarea
                    className="mt-2 w-full border rounded-xl px-4 py-3 outline-none min-h-[80px]"
                    value={st.text || ""}
                    onChange={(e) => updateStep(idx, { text: e.target.value })}
                  />
                </div>

                <button
                  onClick={() => removeStep(idx)}
                  className="mt-3 text-sm font-semibold underline hover:opacity-80"
                >
                  Eliminar paso
                </button>
              </div>
            ))}
          </div>
        </Box>

        {/* FAQ */}
        <Box
          title="Preguntas frecuentes (FAQ)"
          action={
            <button
              onClick={addFaqItem}
              className="rounded-xl border px-4 py-2 text-sm font-semibold hover:bg-black/5"
            >
              + Pregunta
            </button>
          }
        >
          <Field
            label="Título"
            value={draft?.faq?.title || ""}
            onChange={(v) => setFaq({ title: v })}
          />

          <div className="mt-4 space-y-3">
            {(draft?.faq?.items || []).map((it, idx) => (
              <div key={idx} className="border rounded-xl p-3">
                <Field
                  label="Pregunta"
                  value={it.q || ""}
                  onChange={(v) => updateFaqItem(idx, { q: v })}
                />
                <div className="mt-3">
                  <label className="block text-sm font-semibold">
                    Respuesta
                  </label>
                  <textarea
                    className="mt-2 w-full border rounded-xl px-4 py-3 outline-none min-h-[90px]"
                    value={it.a || ""}
                    onChange={(e) => updateFaqItem(idx, { a: e.target.value })}
                  />
                </div>

                <button
                  onClick={() => removeFaqItem(idx)}
                  className="mt-3 text-sm font-semibold underline hover:opacity-80"
                >
                  Eliminar pregunta
                </button>
              </div>
            ))}
          </div>
        </Box>

        <Box title="Contacto (Mapa + Horarios)">
          <Field
            label="Título"
            value={draft?.contact?.title || ""}
            onChange={(v) => setContact({ title: v })}
          />
          <Field
            label="Subtítulo"
            value={draft?.contact?.subtitle || ""}
            onChange={(v) => setContact({ subtitle: v })}
          />
          <Field
            label="Dirección"
            value={draft?.contact?.address || ""}
            onChange={(v) => setContact({ address: v })}
          />
          <Field
            label="WhatsApp (549...)"
            value={draft?.contact?.whatsapp || ""}
            onChange={(v) => setContact({ whatsapp: v })}
          />
          <div className="mt-3">
            <label className="block text-sm font-semibold">
              Mapa (Google Maps Embed URL)
            </label>
            <input
              className="w-full border rounded-xl px-4 py-3 outline-none"
              value={draft?.contact?.mapEmbedUrl || ""}
              onChange={(e) => setContact({ mapEmbedUrl: e.target.value })}
            />
            <div className="mt-2 text-xs text-black/60">
              Tip: Google Maps → “Compartir” → “Insertar un mapa”.
            </div>
          </div>

          <div className="mt-6">
            <div className="font-semibold text-sm">Horarios</div>

            <div className="mt-3 space-y-3">
              {(draft?.contact?.hours || []).map((h, idx) => (
                <div key={idx} className="border rounded-xl p-3">
                  <div className="text-sm font-semibold">{h.day}</div>

                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <Field
                      label="Desde"
                      value={h.from || ""}
                      onChange={(v) => updateHour(idx, { from: v })}
                    />
                    <Field
                      label="Hasta"
                      value={h.to || ""}
                      onChange={(v) => updateHour(idx, { to: v })}
                    />
                    <Field
                      label="Desde (2)"
                      value={h.from2 || ""}
                      onChange={(v) => updateHour(idx, { from2: v })}
                    />
                    <Field
                      label="Hasta (2)"
                      value={h.to2 || ""}
                      onChange={(v) => updateHour(idx, { to2: v })}
                    />
                  </div>

                  <div className="mt-2 text-xs text-black/60">
                    Si está cerrado, dejá los campos vacíos.
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Box>

        {/* FOOTER */}
        <Box title="Footer (marca + redes + dirección)">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field label="Marca" value={f.brand || ""} onChange={(v) => setFooter({ brand: v })} />
            <Field label="Tagline" value={f.tagline || ""} onChange={(v) => setFooter({ tagline: v })} />
            <Field label="Dirección" value={f.address || ""} onChange={(v) => setFooter({ address: v })} />
            <Field label="WhatsApp (549...)" value={f.whatsapp || ""} onChange={(v) => setFooter({ whatsapp: v })} />
            <Field label="Email" value={f.email || ""} onChange={(v) => setFooter({ email: v })} />
            <Field label="Copyright (usa {year})" value={f.copyright || ""} onChange={(v) => setFooter({ copyright: v })} />
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field label="Instagram URL" value={s.instagram || ""} onChange={(v) => setFooter({ socials: { ...s, instagram: v } })} />
            <Field label="Facebook URL" value={s.facebook || ""} onChange={(v) => setFooter({ socials: { ...s, facebook: v } })} />
            <Field label="Google Maps URL" value={s.maps || ""} onChange={(v) => setFooter({ socials: { ...s, maps: v } })} />
            <Field label="Sitio web URL" value={s.website || ""} onChange={(v) => setFooter({ socials: { ...s, website: v } })} />
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
                    <Field label="Texto" value={l.label || ""} onChange={(v) => updateFooterLink(idx, { label: v })} />
                    <Field label="Href" value={l.href || ""} onChange={(v) => updateFooterLink(idx, { href: v })} />
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
        </Box>
      </div>
    </div>
  );
}

/* UI helpers */
function Box({ title, action, children }) {
  return (
    <div className="border rounded-2xl p-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-semibold">{title}</h3>
        {action ? action : null}
      </div>
      <div className="mt-3">{children}</div>
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
