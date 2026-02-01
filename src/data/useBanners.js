"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function useBanners() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("banners")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("Supabase banners error:", error);
      setItems([]);
    } else {
      // ✅ evita banners sin imagen
      setItems((data || []).filter((b) => !!b.image_url));
    }

    setLoading(false);
  };

  useEffect(() => {
    load();
    const onSync = () => load();
    window.addEventListener("c4laser-banners-updated", onSync);
    return () => window.removeEventListener("c4laser-banners-updated", onSync);
  }, []);

  return { items, loading, reload: load };
}
