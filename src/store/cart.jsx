"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);

const STORAGE_KEY = "c4laser_cart_v1";

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [hydrated, setHydrated] = useState(false);

  // ✅ Cargar desde localStorage (solo una vez)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setItems(parsed);
      }
    } catch (e) {
      // si algo falla, arrancamos vacío
      console.warn("No se pudo leer el carrito:", e);
    } finally {
      setHydrated(true);
    }
  }, []);

  // ✅ Guardar en localStorage cada vez que cambia
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn("No se pudo guardar el carrito:", e);
    }
  }, [items, hydrated]);

  const add = (product) => {
    setItems((prev) => {
      const found = prev.find((x) => x.id === product.id);
      if (!found) return [...prev, { ...product, qty: 1 }];
      return prev.map((x) =>
        x.id === product.id ? { ...x, qty: x.qty + 1 } : x
      );
    });
  };

  const remove = (id) => setItems((prev) => prev.filter((x) => x.id !== id));

  const inc = (id) =>
    setItems((prev) =>
      prev.map((x) => (x.id === id ? { ...x, qty: x.qty + 1 } : x))
    );

  const dec = (id) =>
    setItems((prev) =>
      prev
        .map((x) => (x.id === id ? { ...x, qty: x.qty - 1 } : x))
        .filter((x) => x.qty > 0)
    );

  const clear = () => setItems([]);

  // ✅ Count/Total
  const count = useMemo(
    () => items.reduce((acc, it) => acc + it.qty, 0),
    [items]
  );

  const total = useMemo(
    () => items.reduce((acc, it) => acc + it.priceNow * it.qty, 0),
    [items]
  );

  const value = useMemo(
    () => ({ items, add, remove, inc, dec, clear, count, total, hydrated }),
    [items, count, total, hydrated]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de <CartProvider />");
  return ctx;
}
