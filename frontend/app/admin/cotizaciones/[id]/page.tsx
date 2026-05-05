"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getQuote, patchQuote, type QuoteDetail } from "@/lib/admin-api";

const ESTADOS = ["pendiente", "contactado", "en_proceso", "completado", "cancelado"];

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

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-muted text-xs uppercase tracking-wide mb-0.5">{label}</p>
      <p className="text-light text-sm font-medium">{value}</p>
    </div>
  );
}

export default function QuoteDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [quote, setQuote] = useState<QuoteDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [estado, setEstado] = useState("");
  const [notas, setNotas] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getQuote(Number(id))
      .then((q) => {
        setQuote(q);
        setEstado(q.estado);
        setNotas((q as any).analysis_result ?? "");
      })
      .catch(() => router.replace("/admin/cotizaciones"))
      .finally(() => setLoading(false));
  }, [id, router]);

  const handleSave = async () => {
    if (!quote) return;
    setSaving(true);
    try {
      await patchQuote(quote.id, estado, notas);
      setQuote((prev) => prev ? { ...prev, estado } : prev);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="h-8 w-48 bg-dark-2 rounded-lg animate-pulse mb-6" />
        <div className="grid grid-cols-2 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-16 bg-dark-2 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!quote) return null;

  return (
    <div className="p-8 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Link href="/admin/cotizaciones" className="text-muted hover:text-light transition-colors text-sm">
          ← Cotizaciones
        </Link>
        <span className="text-dark-3">/</span>
        <span className="text-light text-sm">#{quote.id} — {quote.nombre}</span>
      </div>

      {/* Datos del cliente */}
      <div className="bg-dark-2 border border-dark-3 rounded-2xl p-6 mb-4">
        <h2 className="text-light font-semibold mb-5">Datos del cliente</h2>
        <div className="grid grid-cols-2 gap-5">
          <Field label="Nombre" value={quote.nombre} />
          <Field label="Ciudad" value={quote.ciudad} />
          <Field label="Email" value={quote.email} />
          <Field label="Teléfono" value={quote.telefono ?? "—"} />
        </div>
      </div>

      {/* Detalles del proyecto */}
      <div className="bg-dark-2 border border-dark-3 rounded-2xl p-6 mb-4">
        <h2 className="text-light font-semibold mb-5">Proyecto</h2>
        <div className="grid grid-cols-2 gap-5">
          <Field label="Superficie" value={quote.tipoSuperficie.replace(/_/g, " ")} />
          <Field label="Área" value={`${quote.areaM2} m²`} />
          <Field label="Acabado" value={quote.tipoAcabado?.replace(/_/g, " ") ?? "—"} />
          <div>
            <p className="text-muted text-xs uppercase tracking-wide mb-0.5">Precio estimado</p>
            <p className="text-gold text-xl font-bold">
              ${quote.precioEstimado?.toLocaleString("es-CO", { maximumFractionDigits: 0 })}
            </p>
          </div>
        </div>
        {quote.mensaje && (
          <div className="mt-4 pt-4 border-t border-dark-3">
            <p className="text-muted text-xs uppercase tracking-wide mb-1">Mensaje del cliente</p>
            <p className="text-light text-sm">{quote.mensaje}</p>
          </div>
        )}
      </div>

      {/* Estado + Notas internas */}
      <div className="bg-dark-2 border border-dark-3 rounded-2xl p-6">
        <h2 className="text-light font-semibold mb-5">Gestión interna</h2>

        <div className="mb-4">
          <label className="block text-muted text-xs uppercase tracking-wide mb-2">Estado</label>
          <div className="flex flex-wrap gap-2">
            {ESTADOS.map((e) => (
              <button
                key={e}
                onClick={() => setEstado(e)}
                className={`px-3 py-1.5 rounded-full text-xs border font-medium transition-all ${
                  estado === e
                    ? ESTADO_COLORS[e]
                    : "border-dark-3 text-muted hover:text-light hover:border-muted"
                }`}
              >
                {ESTADO_LABELS[e]}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-5">
          <label className="block text-muted text-xs uppercase tracking-wide mb-2">Notas internas</label>
          <textarea
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
            rows={4}
            placeholder="Ej: Agendada visita el martes 22 a las 10am..."
            className="w-full bg-dark-3 border border-dark-3 rounded-xl px-4 py-3 text-light text-sm placeholder:text-muted/40 focus:outline-none focus:border-gold/40 resize-none transition-colors"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 rounded-xl bg-gold text-dark font-bold text-sm hover:bg-gold-light active:bg-gold-dark transition-all disabled:opacity-60"
        >
          {saving ? "Guardando..." : saved ? "✓ Guardado" : "Guardar cambios"}
        </button>
      </div>

      {/* Fecha */}
      <p className="text-muted text-xs mt-4 text-right">
        Recibida el {new Date(quote.createdAt).toLocaleString("es-CO")}
      </p>
    </div>
  );
}
