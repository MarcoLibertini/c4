"use client";

import { useState } from "react";
import Header from "../components/Header";
import ProductsSection from "../components/ProductsSection";
import WhatsAppFloat from "../components/WhatsAppFloat";
import Footer from "@/components/Footer";
import BannerCarousel from "@/components/BannerCarousel";


export default function Home() {
  const [query, setQuery] = useState("");

  return (
    <div className="min-h-screen bg-white">
      <Header query={query} setQuery={setQuery} />
      <BannerCarousel />

      <ProductsSection query={query} />
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
