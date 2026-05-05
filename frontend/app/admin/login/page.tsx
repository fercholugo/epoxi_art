"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { login, getToken } from "@/lib/admin-api";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (getToken()) router.replace("/admin/dashboard");
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
      router.push("/admin/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-3xl font-black tracking-widest text-gold mb-1">
            EPOXY<span className="text-light">ART</span>
          </div>
          <p className="text-muted text-sm">Panel de administración</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-dark-2 border border-dark-3 rounded-2xl p-8 space-y-5"
        >
          <h1 className="text-light font-bold text-xl text-center mb-2">
            Iniciar sesión
          </h1>

          <div>
            <label className="block text-muted text-sm mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="admin@epoxyart.co"
              className="w-full bg-dark-3 border border-dark-3 rounded-xl px-4 py-3 text-light text-sm placeholder:text-muted/40 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 transition-colors"
            />
          </div>

          <div>
            <label className="block text-muted text-sm mb-1.5">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="••••••••"
              className="w-full bg-dark-3 border border-dark-3 rounded-xl px-4 py-3 text-light text-sm placeholder:text-muted/40 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 transition-colors"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center bg-red-950/30 border border-red-800/30 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gold text-dark font-bold text-sm hover:bg-gold-light active:bg-gold-dark transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Verificando..." : "Ingresar al panel"}
          </button>
        </form>

        <p className="text-center text-muted/50 text-xs mt-6">
          EpoxyArt · Panel interno
        </p>
      </div>
    </div>
  );
}
