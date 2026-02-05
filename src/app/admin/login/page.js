"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user, pass }),
      });

      if (!res.ok) {
        const out = await res.json().catch(() => ({}));
        alert(out?.error || "Usuario o contraseña incorrectos");
        setLoading(false);
        return;
      }

      // ✅ hard reload para que middleware vea cookie sí o sí
      window.location.href = "/admin";
    } catch (err) {
      console.error(err);
      alert("Error de red. Probá de nuevo.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black flex items-center justify-center p-4">
      <form onSubmit={submit} className="w-full max-w-sm border rounded-2xl p-6">
        <h1 className="text-xl font-semibold">Admin C4 LASER</h1>
        <p className="text-sm text-black/70 mt-1">Acceso de administrador</p>

        <div className="mt-6 space-y-3">
          <input
            className="w-full border rounded-xl px-4 py-3 outline-none"
            placeholder="Usuario"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            autoComplete="username"
          />
          <input
            className="w-full border rounded-xl px-4 py-3 outline-none"
            placeholder="Contraseña"
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            autoComplete="current-password"
          />

          <button
            disabled={loading}
            className="w-full rounded-xl bg-black text-white py-3 font-semibold hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </div>
      </form>
    </div>
  );
}
