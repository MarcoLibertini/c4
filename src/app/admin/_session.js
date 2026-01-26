"use client";

import { useEffect, useState } from "react";

const AUTH_KEY = "c4laser_admin_auth_v1";

export default function useAdminSession() {
  const [ready, setReady] = useState(false);
  const [logged, setLogged] = useState(false);

  useEffect(() => {
    setLogged(localStorage.getItem(AUTH_KEY) === "1");
    setReady(true);

    const onSync = () => setLogged(localStorage.getItem(AUTH_KEY) === "1");
    window.addEventListener("c4laser-admin-auth", onSync);
    return () => window.removeEventListener("c4laser-admin-auth", onSync);
  }, []);

  const login = () => {
    localStorage.setItem(AUTH_KEY, "1");
    setLogged(true);
    window.dispatchEvent(new Event("c4laser-admin-auth"));
  };

  const logout = () => {
    localStorage.removeItem(AUTH_KEY);
    setLogged(false);
    window.dispatchEvent(new Event("c4laser-admin-auth"));
  };

  return { ready, logged, login, logout };
}
