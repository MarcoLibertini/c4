"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useAdminSession from "../_session";

const USERS = [{ user: "Marco138", pass: "c4energia" }];

export default function AdminLoginPage() {
  const router = useRouter();
  const { login } = useAdminSession();

  const [u, setU] = useState("");
  const [p, setP] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    const ok = USERS.some((x) => x.user === u && x.pass === p);
    if (!ok) return alert("Usuario o contraseña incorrectos");

    login();
    router.replace("/admin/products");
  };

  return (
    <form onSubmit={onSubmit} className="w-full border rounded-2xl p-6">
      <h2 className="text-lg font-semibold">Ingresar</h2>
      <p className="text-sm text-black/70 mt-1">Acceso administrador</p>

      <div className="mt-5 space-y-3">
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
  );
}
