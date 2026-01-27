"use client";

import { useState } from "react";
import useLanding from "../data/useLanding";

export default function FAQSection() {
  const { landing } = useLanding();

  const title = landing?.faq?.title || "Preguntas frecuentes";
  const items = Array.isArray(landing?.faq?.items) ? landing.faq.items : [];
  const [openIdx, setOpenIdx] = useState(0);

  return (
    <section id="faq" className="mx-auto max-w-6xl px-4 py-12 text-black">
      <div>
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="mt-1 text-sm text-black/70">
          Respuestas rápidas para comprar sin vueltas.
        </p>
      </div>

      <div className="mt-6 space-y-3">
        {items.map((it, idx) => {
          const open = idx === openIdx;
          return (
            <div key={idx} className="border rounded-2xl overflow-hidden bg-white">
              <button
                type="button"
                className="w-full flex items-center justify-between gap-3 px-4 py-4 text-left cursor-pointer"
                onClick={() => setOpenIdx(open ? -1 : idx)}
              >
                <span className="font-semibold text-sm">{it.q}</span>
                <span className="text-black/60 text-sm">{open ? "−" : "+"}</span>
              </button>

              {open && (
                <div className="px-4 pb-4 text-sm text-black/70">
                  {it.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
