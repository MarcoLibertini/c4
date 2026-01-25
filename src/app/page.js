"use client";

import { useState } from "react";
import Header from "../components/Header";
import ProductsSection from "../components/ProductsSection";
import WhatsAppFloat from "../components/WhatsAppFloat";

export default function Home() {
  const [query, setQuery] = useState("");

  return (
    <div className="min-h-screen bg-white">
      <Header query={query} setQuery={setQuery} />
      <ProductsSection query={query} />
      <WhatsAppFloat />
    </div>
  );
}
