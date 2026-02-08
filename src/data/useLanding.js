"use client";

import { useEffect, useMemo, useState } from "react";
import { landingDefaults } from "./landingDefaults";
import { supabase } from "@/lib/supabase";

const SETTINGS_KEY = "landing";
const LOCAL_FALLBACK_KEY = "c4laser_landing_v1";

function mergeLanding(v) {
  return { ...landingDefaults, ...(v || {}) };
}

export default function useLanding() {
  const [landing, setLanding] = useState(landingDefaults);
  const [loading, setLoading] = useState(true);

  const loadFromLocal = () => {
    try {
      const raw = localStorage.getItem(LOCAL_FALLBACK_KEY);
      if (!raw) return landingDefaults;
      const parsed = JSON.parse(raw);
      return mergeLanding(parsed);
    } catch {
      return landingDefaults;
    }
  };

  const load = async () => {
    setLoading(true);

    // 1) intento Supabase (producción real)
    const { data, error } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", SETTINGS_KEY)
      .maybeSingle();

    if (!error && data?.value) {
      const next = mergeLanding(data.value);
      setLanding(next);

      // guardo fallback local por si un día falla supabase o estás offline
      try {
        localStorage.setItem(LOCAL_FALLBACK_KEY, JSON.stringify(next));
      } catch {}

      setLoading(false);
      return;
    }

    // 2) fallback localStorage (compat)
    const fallback = loadFromLocal();
    setLanding(fallback);
    setLoading(false);

    if (error) {
      console.error("useLanding supabase error:", error);
    }
  };

  useEffect(() => {
    load();

    // cuando el admin guarda, refrescamos
    const onUpdate = () => load();
    window.addEventListener("c4laser_landing_updated", onUpdate);
    return () => window.removeEventListener("c4laser_landing_updated", onUpdate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const save = useMemo(() => {
    return async (nextLanding) => {
      const next = mergeLanding(nextLanding);

      // optimista
      setLanding(next);
      try {
        localStorage.setItem(LOCAL_FALLBACK_KEY, JSON.stringify(next));
      } catch {}

      // guarda real (solo admin logueado)
      const res = await fetch("/api/admin/landing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ landing: next }),
      });

      const out = await res.json().catch(() => ({}));

      if (!res.ok) {
        console.error("Landing save error:", out);
        throw new Error(out?.error || "Error guardando landing");
      }

      window.dispatchEvent(new Event("c4laser_landing_updated"));
      return true;
    };
  }, []);

  return { landing, save, loading, reload: load };
}
