"use client";

import { useMemo, useState } from "react";
import useAdminSession from "./_session";

const USERS = [{ user: "Marco138", pass: "c4energia" }];

export function useAdminAuth() {
  const { ready, logged, login, logout } = useAdminSession();
  const [u, setU] = useState("");
  const [p, setP] = useState("");

  const LoginForm = useMemo(() => {
    return function LoginForm() {
      if (!ready) return null;

      const onSubmit = (e) => {
        e.preventDefault();
        const ok = USERS.some((x) => x.user === u && x.pass === p);
        if (!ok) return alert("Usuario o contraseña incorrectos");
        login();
      };

      return (
        <div className="min-h-screen bg-white text-black flex items-center justify-center p-4">
          <form onSubmit={onSubmit} className="w-full max-w-sm border rounded-2xl p-6">
            <h1 className="text-xl font-semibold">Admin C4 LASER</h1>
            <p className="text-sm text-black/70 mt-1">Acceso para superusuarios</p>

            <div className="mt-6 space-y-3">
              <input
                className="w-full border rounded-xl px-4 py-3 outline-none"
                placeholder="Usuario"
                value={u}
                onChange={(e) => setU(e.target.value)}
                autoComplete="username"
              />
              <input
                className="w-full border rounded-xl px-4 py-3 outline-none"
                placeholder="Contraseña"
                type="password"
                value={p}
                onChange={(e) => setP(e.target.value)}
                autoComplete="current-password"
              />

              <button className="w-full rounded-xl bg-black text-white py-3 font-semibold hover:opacity-90">
                Entrar
              </button>
            </div>
          </form>
        </div>
      );
    };
  }, [ready, u, p, login]);

  return { ready, logged, login, logout, LoginForm };
}
