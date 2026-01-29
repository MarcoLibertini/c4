"use client";

import ProductCard from "./ProductCard";
import { getProducts } from "../data/getProducts";
import { useEffect, useMemo, useState } from "react";
import { useCart } from "../store/cart";

export default function ProductsSection({ query = "" }) {
  const { add } = useCart();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const q = query.trim().toLowerCase();

  useEffect(() => {
    let alive = true;

    (async () => {
      setLoading(true);
      const list = await getProducts();
      if (alive) {
        setProducts(list);
        setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  const filtered = useMemo(() => {
    if (!Array.isArray(products)) return [];
    if (!q) return products;
    return products.filter((p) => p.name.toLowerCase().includes(q));
  }, [products, q]);

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 text-black">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">Productos</h2>
          <p className="mt-1 text-sm text-black/70">
            {q
              ? `Resultados para: “${query}”`
              : "Elegí un producto y agregalo al carrito."}
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
        {filtered.length > 0 ? (
          filtered.map((p) => (
            <ProductCard key={p.id} product={p} onAdd={() => add(p)} />
          ))
        ) : (
          <div className="col-span-full text-center text-sm text-black/70 py-10">
            {loading
              ? "Cargando productos..."
              : q
              ? "No encontramos productos con ese nombre."
              : "No hay productos cargados."}
          </div>
        )}
      </div>
    </section>
  );
}
