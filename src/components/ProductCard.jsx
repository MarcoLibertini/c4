"use client";

import { useMemo } from "react";

function formatARS(n) {
  return n.toLocaleString("es-AR", {
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
            <span className="text-sm font-bold">
              {discountPercent}%
            </span>
            <span className="text-xs font-bold">OFF</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 text-center">
        {/* Nombre */}
        <h3 className="text-sm font-semibold leading-snug text-black">
          {name}
        </h3>

        {/* Precio viejo */}
        {priceOld ? (
          <div className="mt-3 text-black line-through text-sm font-normal opacity-70">
            ${formatARS(priceOld)}
          </div>
        ) : (
          <div className="mt-3" />
        )}

        {/* Precio nuevo */}
        <div className="mt-1 text-2xl font-extrabold text-black">
          ${formatARS(priceNow)}
        </div>

        {/* Transferencia */}
        {transferPrice && (
          <div className="mt-1 text-sm text-black">
            <span className="font-bold">
              ${formatARS(transferPrice)}
            </span>{" "}
            con{" "}
            <span className="font-bold">
              Transferencia Bancaria
            </span>{" "}
            o{" "}
            <span className="font-bold">
              Efectivo
            </span>
          </div>
        )}

        {/* Cuotas */}
        {installments?.count && (
          <div className="mt-3 text-sm text-black">
            <span className="font-bold">
              {installments.count}
            </span>{" "}
            cuotas sin interés de{" "}
            <span className="font-bold">
              ${formatARS(installments.amount)}
            </span>
          </div>
        )}

        {/* CTA */}
        <button
          onClick={() => onAdd?.(product)}
          className="mt-4 w-full rounded-xl bg-black text-white py-3 text-sm font-bold hover:opacity-90 transition"
        >
          Agregar al carrito
        </button>
      </div>
    </div>
  );
}
