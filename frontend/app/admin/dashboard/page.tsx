"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getStats, listQuotes, type DashboardStats, type QuoteItem } from "@/lib/admin-api";

const ESTADO_COLORS: Record<string, string> = {
  pendiente:   "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  contactado:  "bg-blue-500/10 text-blue-400 border-blue-500/20",
  en_proceso:  "bg-purple-500/10 text-purple-400 border-purple-500/20",
  completado:  "bg-green-500/10 text-green-400 border-green-500/20",
  cancelado:   "bg-red-500/10 text-red-400 border-red-500/20",
};

function StatCard({ label, value, sub, accent = false }: {
  label: string; value: string; sub?: string; accent?: boolean;
}) {
  return (
    <div className={`bg-dark-2 border rounded-2xl p-6 ${accent ? "border-gold/30" : "border-dark-3"}`}>
      <p className="text-muted text-sm mb-1">{label}</p>
      <p className={`text-3xl font-bold ${accent ? "text-gold" : "text-light"}`}>{value}</p>
      {sub && <p className="text-muted text-xs mt-1">{sub}</p>}
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recent, setRecent] = useState<QuoteItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getStats(), listQuotes({ page: 1, page_size: 5 })])
      .then(([s, q]) => {
        setStats(s);
        setRecent(q.items);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-light">Dashboard</h1>
        <p className="text-muted text-sm mt-1">Resumen del negocio</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-dark-2 border border-dark-3 rounded-2xl p-6 animate-pulse h-28" />
          ))}
        </div>
      ) : stats ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total cotizaciones" value={String(stats.total)} />
          <StatCard label="Pendientes" value={String(stats.pendientes)} sub="requieren atención" />
          <StatCard label="Esta semana" value={String(stats.esta_semana)} sub="últimos 7 días" />
          <StatCard
            label="Ingresos estimados"
            value={`$${stats.ingresos_estimados.toLocaleString("es-CO", { maximumFractionDigits: 0 })}`}
            sub="suma de cotizaciones"
            accent
          />
        </div>
      ) : null}

      {/* Cotizaciones recientes */}
      <div className="bg-dark-2 border border-dark-3 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-dark-3 flex items-center justify-between">
          <h2 className="text-light font-semibold">Cotizaciones recientes</h2>
          <Link href="/admin/cotizaciones" className="text-gold text-sm hover:text-gold-light transition-colors">
            Ver todas →
          </Link>
        </div>

        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-10 bg-dark-3 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : recent.length === 0 ? (
          <div className="p-12 text-center text-muted text-sm">
            Aún no hay cotizaciones
          </div>
        ) : (
          <div className="divide-y divide-dark-3">
            {recent.map((q) => (
              <Link
                key={q.id}
                href={`/admin/cotizaciones/${q.id}`}
                className="flex items-center justify-between px-6 py-4 hover:bg-dark-3/50 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-gold text-xs font-bold">
                    {q.nombre[0]}
                  </div>
                  <div>
                    <p className="text-light text-sm font-medium group-hover:text-gold transition-colors">
                      {q.nombre}
                    </p>
                    <p className="text-muted text-xs">{q.ciudad} · {q.tipoSuperficie.replace("_", " ")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-gold text-sm font-bold">
                    ${q.precioEstimado?.toLocaleString("es-CO", { maximumFractionDigits: 0 })}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full border ${ESTADO_COLORS[q.estado] ?? ESTADO_COLORS.pendiente}`}>
                    {q.estado.replace("_", " ")}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
