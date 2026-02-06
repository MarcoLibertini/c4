"use client";

import { useEffect, useState } from "react";

export default function useAdminSession() {
  const [ready, setReady] = useState(false);
  const [logged, setLogged] = useState(false);

  const refresh = async () => {
    try {
      const res = await fetch("/api/admin/me", { cache: "no-store" });
      const out = await res.json().catch(() => ({}));
      setLogged(!!out?.logged);
    } catch {
      setLogged(false);
    } finally {
      setReady(true);
    }
  };

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login"; // hard reload
  };

  useEffect(() => {
    refresh();
  }, []);

  return { ready, logged, refresh, logout };
}
