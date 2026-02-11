"use client";

import { useMemo } from "react";

function formatARS(n) {
  return Number(n || 0).toLocaleString("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function ProductCard({ product, onAdd }) {
  const {
    name,
    imageUrl,
    discountPercent,
    priceOld,
    priceNow,
    transferPrice,
    installments,
  } = product;

  const hasDiscount = useMemo(
    () => Number(discountPercent) > 0,
    [discountPercent]
  );

  return (
    <div className="w-full max-w-[280px] rounded-2xl border bg-white overflow-hidden shadow-sm text-black">
      {/* Imagen */}
      <div className="relative w-full aspect-[4/5] bg-neutral-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={name}
          className="h-full w-full object-cover"
          onError={(e) => {
            e.currentTarget.src =
              "https://via.placeholder.com/600x750.png?text=C4+LASER";
          }}
        />

        {/* Badge descuento */}
        {hasDiscount && (
          <div className="absolute top-3 left-3 h-14 w-14 rounded-full bg-black text-white flex flex-col items-center justify-center leading-tight">
            <span className="text-sm font-bold">{discountPercent}%</span>
            <span className="text-xs font-semibold">OFF</span>
          </div>
        )}
      </div>

      {/* Info (flex para alinear el botón abajo) */}
      <div className="p-4 text-center flex flex-col min-h-[300px]">
        <h3 className="text-sm font-semibold leading-snug text-black">
          {name}
        </h3>

        {/* Reservo espacio para que no cambie el alto */}
        <div className="mt-3 min-h-[20px]">
          {priceOld ? (
            <div className="text-neutral-600 line-through text-sm">
              ${formatARS(priceOld)}
            </div>
          ) : null}
        </div>

        <div className="mt-1 text-2xl font-extrabold text-black">
          ${formatARS(priceNow)}
        </div>

        {/* transferencia (reservo alto también) */}
        <div className="mt-1 min-h-[44px] text-sm text-black">
          {transferPrice ? (
            <>
              <span className="font-semibold">
                ${formatARS(transferPrice)}
              </span>{" "}
              con <span className="font-semibold">Transferencia Bancaria</span>{" "}
              o <span className="font-semibold">Efectivo</span>
            </>
          ) : null}
        </div>

        {/* cuotas (reservo alto para que no “suba” el botón) */}
        <div className="mt-3 min-h-[44px] text-sm text-black">
          {installments?.count ? (
            <>
              <span className="font-semibold">{installments.count}</span> cuotas
              sin interés de{" "}
              <span className="font-semibold">
                ${formatARS(installments.amount)}
              </span>
            </>
          ) : null}
        </div>

        {/* CTA: siempre abajo */}
        <button
          onClick={() => onAdd?.(product)}
          className=" cursor-pointer mt-auto w-full rounded-xl bg-black text-white py-3 text-sm font-semibold hover:opacity-90 transition"
        >
          Agregar al carrito
        </button>
      </div>
    </div>
  );
}
