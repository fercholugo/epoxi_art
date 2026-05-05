"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { listQuotes, patchQuote, type QuoteItem } from "@/lib/admin-api";

const ESTADOS = ["", "pendiente", "contactado", "en_proceso", "completado", "cancelado"];

const ESTADO_LABELS: Record<string, string> = {
  pendiente:  "Pendiente",
  contactado: "Contactado",
  en_proceso: "En proceso",
  completado: "Completado",
  cancelado:  "Cancelado",
};

const ESTADO_COLORS: Record<string, string> = {
  pendiente:  "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  contactado: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  en_proceso: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  completado: "bg-green-500/10 text-green-400 border-green-500/20",
  cancelado:  "bg-red-500/10 text-red-400 border-red-500/20",
};

export default function CotizacionesPage() {
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [estado, setEstado] = useState("");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await listQuotes({ page, page_size: 15, estado: estado || undefined, search: search || undefined });
      setItems(res.items);
      setTotal(res.total);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [page, estado, search]);

  useEffect(() => { load(); }, [load]);

  const handleEstadoChange = async (id: number, nuevoEstado: string) => {
    await patchQuote(id, nuevoEstado);
    setItems((prev) => prev.map((q) => q.id === id ? { ...q, estado: nuevoEstado } : q));
  };

  const totalPages = Math.ceil(total / 15);

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-light">Cotizaciones</h1>
          <p className="text-muted text-sm mt-1">{total} registros en total</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <input
          type="text"
          placeholder="Buscar por nombre o email..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { setSearch(searchInput); setPage(1); } }}
          className="bg-dark-2 border border-dark-3 rounded-xl px-4 py-2 text-light text-sm placeholder:text-muted/40 focus:outline-none focus:border-gold/40 transition-colors w-64"
        />
        <button
          onClick={() => { setSearch(searchInput); setPage(1); }}
          className="px-4 py-2 rounded-xl bg-dark-2 border border-dark-3 text-muted text-sm hover:text-light transition-colors"
        >
          Buscar
        </button>

        <select
          value={estado}
          onChange={(e) => { setEstado(e.target.value); setPage(1); }}
          className="bg-dark-2 border border-dark-3 rounded-xl px-3 py-2 text-sm text-light focus:outline-none focus:border-gold/40"
        >
          <option value="">Todos los estados</option>
          {ESTADOS.filter(Boolean).map((e) => (
            <option key={e} value={e}>{ESTADO_LABELS[e]}</option>
          ))}
        </select>

        {(estado || search) && (
          <button
            onClick={() => { setEstado(""); setSearch(""); setSearchInput(""); setPage(1); }}
            className="px-3 py-2 rounded-xl text-muted text-sm hover:text-red-400 transition-colors"
          >
            ✕ Limpiar
          </button>
        )}
      </div>

      {/* Tabla */}
      <div className="bg-dark-2 border border-dark-3 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-dark-3 text-muted text-xs uppercase tracking-wide">
                <th className="px-4 py-3 text-left">#</th>
                <th className="px-4 py-3 text-left">Cliente</th>
                <th className="px-4 py-3 text-left">Ciudad</th>
                <th className="px-4 py-3 text-left">Superficie</th>
                <th className="px-4 py-3 text-right">Área</th>
                <th className="px-4 py-3 text-right">Precio</th>
                <th className="px-4 py-3 text-left">Estado</th>
                <th className="px-4 py-3 text-left">Fecha</th>
                <th className="px-4 py-3 text-left">Detalle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-3">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(9)].map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 bg-dark-3 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-muted">
                    No se encontraron cotizaciones
                  </td>
                </tr>
              ) : (
                items.map((q) => (
                  <tr key={q.id} className="hover:bg-dark-3/30 transition-colors">
                    <td className="px-4 py-3 text-muted">{q.id}</td>
                    <td className="px-4 py-3">
                      <div className="text-light font-medium">{q.nombre}</div>
                      <div className="text-muted text-xs">{q.email}</div>
                    </td>
                    <td className="px-4 py-3 text-muted">{q.ciudad}</td>
                    <td className="px-4 py-3 text-muted capitalize">{q.tipoSuperficie.replace(/_/g, " ")}</td>
                    <td className="px-4 py-3 text-right text-muted">{q.areaM2} m²</td>
                    <td className="px-4 py-3 text-right text-gold font-bold">
                      ${q.precioEstimado?.toLocaleString("es-CO", { maximumFractionDigits: 0 })}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={q.estado}
                        onChange={(e) => handleEstadoChange(q.id, e.target.value)}
                        className={`text-xs px-2 py-1 rounded-full border bg-transparent cursor-pointer focus:outline-none ${ESTADO_COLORS[q.estado]}`}
                      >
                        {ESTADOS.filter(Boolean).map((e) => (
                          <option key={e} value={e} className="bg-dark-2 text-light">{ESTADO_LABELS[e]}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-muted text-xs">
                      {new Date(q.createdAt).toLocaleDateString("es-CO", { day: "2-digit", month: "short" })}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/cotizaciones/${q.id}`}
                        className="text-gold hover:text-gold-light text-xs transition-colors"
                      >
                        Ver →
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-dark-3 flex items-center justify-between">
            <p className="text-muted text-xs">
              Página {page} de {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 rounded-lg bg-dark-3 text-muted text-xs disabled:opacity-40 hover:text-light transition-colors"
              >
                ← Anterior
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 rounded-lg bg-dark-3 text-muted text-xs disabled:opacity-40 hover:text-light transition-colors"
              >
                Siguiente →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
