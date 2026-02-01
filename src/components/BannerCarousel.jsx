"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import useBanners from "@/data/useBanners";

export default function BannerCarousel() {
  const { items, loading } = useBanners();
  const banners = useMemo(() => (Array.isArray(items) ? items : []), [items]);

  const [idx, setIdx] = useState(0);
  const timerRef = useRef(null);

  // Reiniciar índice si cambian banners
  useEffect(() => {
    setIdx(0);
  }, [banners.length]);

  // Auto-play
  useEffect(() => {
    if (!banners.length) return;

    // limpiar antes
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setIdx((prev) => (prev + 1) % banners.length);
    }, 4500); // 4.5s

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [banners.length]);

  const prev = () => setIdx((i) => (i - 1 + banners.length) % banners.length);
  const next = () => setIdx((i) => (i + 1) % banners.length);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 mt-6">
        <div className="h-[220px] rounded-2xl bg-neutral-100 border" />
      </div>
    );
  }

  if (!banners.length) return null;

  const b = banners[idx];

  return (
    <div className="mx-auto max-w-6xl px-4 mt-6">
      <div className="relative overflow-hidden rounded-2xl border bg-neutral-100">
        {/* Si hay link_url, que sea clickeable */}
        {b.link_url ? (
          <a href={b.link_url} target="_blank" rel="noreferrer">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={b.image_url}
              alt={b.title || "Banner"}
              className="w-full h-[220px] sm:h-[260px] object-cover"
              draggable={false}
            />
          </a>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={b.image_url}
            alt={b.title || "Banner"}
            className="w-full h-[220px] sm:h-[260px] object-cover"
            draggable={false}
          />
        )}

        {/* Botones */}
        {banners.length > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Anterior"
              className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 border hover:bg-white transition flex items-center justify-center"
            >
              ‹
            </button>

            <button
              onClick={next}
              aria-label="Siguiente"
              className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 border hover:bg-white transition flex items-center justify-center"
            >
              ›
            </button>

            {/* Dots */}
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
              {banners.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIdx(i)}
                  aria-label={`Ir al banner ${i + 1}`}
                  className={`h-2.5 w-2.5 rounded-full border ${
                    i === idx ? "bg-black" : "bg-white/80"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
