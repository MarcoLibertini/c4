"use client";

import { useEffect, useMemo, useState } from "react";
import useBanners from "../data/useBanners";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function BannerCarousel() {
  const { banners } = useBanners();
  const slides = useMemo(() => (Array.isArray(banners) ? banners : []), [banners]);
  const [i, setI] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const t = setInterval(() => setI((p) => (p + 1) % slides.length), 4500);
    return () => clearInterval(t);
  }, [slides.length]);

  useEffect(() => {
    if (i > slides.length - 1) setI(0);
  }, [slides.length, i]);

  if (!slides.length) return null;

  const current = slides[i];

  const prev = () => setI((p) => (p - 1 + slides.length) % slides.length);
  const next = () => setI((p) => (p + 1) % slides.length);

  return (
    <section className="bg-white border-b">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="relative overflow-hidden rounded-2xl border bg-white">
          {/* Imagen */}
          <div className="relative h-[180px] sm:h-[220px] md:h-[260px] bg-neutral-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={current.imageUrl}
              alt={current.title}
              className="h-full w-full object-cover"
              onError={(e) => {
                e.currentTarget.src =
                  "https://via.placeholder.com/1600x600.png?text=C4+LASER+Banner";
              }}
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>

          {/* Texto */}
          <div className="absolute inset-0 flex items-center">
            <div className="px-5 sm:px-10 text-white max-w-2xl">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold">
                {current.title}
              </h2>
              {current.subtitle ? (
                <p className="mt-2 text-sm sm:text-base text-white/90">
                  {current.subtitle}
                </p>
              ) : null}

              {current.ctaLabel && current.ctaHref ? (
                <a
                  href={current.ctaHref}
                  target={current.ctaHref.startsWith("http") ? "_blank" : undefined}
                  rel={current.ctaHref.startsWith("http") ? "noreferrer" : undefined}
                  className="mt-4 inline-flex rounded-xl bg-white text-black px-4 py-3 text-sm font-semibold hover:opacity-90"
                >
                  {current.ctaLabel}
                </a>
              ) : null}
            </div>
          </div>

          {/* Controles */}
          {slides.length > 1 ? (
            <>
              <button
                onClick={prev}
                className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 flex items-center justify-center hover:opacity-90"
                aria-label="Anterior"
              >
                <ChevronLeft className="h-5 w-5 text-black" />
              </button>

              <button
                onClick={next}
                className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 flex items-center justify-center hover:opacity-90"
                aria-label="Siguiente"
              >
                <ChevronRight className="h-5 w-5 text-black" />
              </button>

              <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setI(idx)}
                    className={`h-2 w-2 rounded-full ${
                      idx === i ? "bg-white" : "bg-white/50"
                    }`}
                    aria-label={`Slide ${idx + 1}`}
                  />
                ))}
              </div>
            </>
          ) : null}
        </div>
      </div>
    </section>
  );
}
