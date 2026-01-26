"use client";

import { products as seed } from "./products";

const KEY = "c4laser_admin_products_v1";

export function getProducts() {
  if (typeof window === "undefined") return seed;

  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return seed;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : seed;
  } catch {
    return seed;
  }
}

export { KEY as PRODUCTS_KEY };
