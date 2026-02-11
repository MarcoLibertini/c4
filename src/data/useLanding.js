"use client";

import { useEffect, useMemo, useState } from "react";
import { landingDefaults } from "./landingDefaults";

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
      return mergeLanding(JSON.parse(raw));
    } catch {
      return landingDefaults;
    }
  };

  const load = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/admin/landing", { method: "GET" });
      const out = await res.json().catch(() => ({}));

      if (res.ok && out?.landing) {
        const next = mergeLanding(out.landing);
        setLanding(next);
        try {
          localStorage.setItem(LOCAL_FALLBACK_KEY, JSON.stringify(next));
        } catch {}
        setLoading(false);
        return;
      }

      // si no está logueado / 401 / etc => fallback local
      const fallback = loadFromLocal();
      setLanding(fallback);
      setLoading(false);
    } catch (e) {
      console.error("useLanding load error:", e);
      const fallback = loadFromLocal();
      setLanding(fallback);
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
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
