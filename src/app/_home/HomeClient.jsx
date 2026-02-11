"use client";

import { useState } from "react";
import Header from "@/components/Header";
import ProductsSection from "@/components/ProductsSection";
import BannerCarousel from "@/components/BannerCarousel";
import HowToBuySection from "@/components/HowToBuySection";
import FAQSection from "@/components/FAQSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";

export default function HomeClient({ landing }) {
  const [query, setQuery] = useState("");

  return (
    <div className="min-h-screen bg-white">
      <Header landing={landing} query={query} setQuery={setQuery} />

      <BannerCarousel />

      <ProductsSection query={query} />

      <HowToBuySection landing={landing} />
      <FAQSection landing={landing} />
      <ContactSection landing={landing} />
      <Footer landing={landing} />

      <WhatsAppFloat landing={landing} />
    </div>
  );
}
