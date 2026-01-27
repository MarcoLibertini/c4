"use client";

import useLanding from "../data/useLanding";

export default function HowToBuySection() {
  const { landing } = useLanding();

  const title = landing?.howToBuy?.title || "Cómo comprar";
  const steps = Array.isArray(landing?.howToBuy?.steps) ? landing.howToBuy.steps : [];

  return (
    <section id="comprar" className="mx-auto max-w-6xl px-4 py-12 text-black">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">{title}</h2>
          <p className="mt-1 text-sm text-black/70">
            Proceso simple: elegís, enviás, confirmamos y coordinamos.
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {steps.map((s, idx) => (
          <div key={idx} className="border rounded-2xl p-4 bg-white">
            <div className="font-semibold text-sm">{s.title}</div>
            <div className="mt-2 text-sm text-black/70">{s.text}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
