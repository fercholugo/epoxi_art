"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  calcPrice,
  SURFACE_LABELS,
  FINISH_LABELS,
} from "@/lib/utils";
import { useCurrency } from "@/contexts/currency";
import type { SurfaceType, FinishType } from "@/types";
import { api } from "@/lib/api";

const schema = z.object({
  nombre: z.string().min(2, "Mínimo 2 caracteres").max(80),
  telefono: z
    .string()
    .min(7, "Teléfono inválido")
    .regex(/^[0-9+\s\-()]+$/, "Solo números y símbolos"),
  email: z.string().email("Email inválido"),
  ciudad: z.string().min(2, "Ciudad requerida"),
  tipoSuperficie: z.enum([
    "piso_residencial",
    "pared_decorativa",
    "acabado_especial",
    "renovacion",
  ] as const),
  areaM2: z.number().min(5).max(100),
  tipoAcabado: z.enum(["mate", "semimate", "satinado", "alto_brillo"] as const),
  mensaje: z.string().max(500).optional(),
});

type FormData = z.infer<typeof schema>;

function InputField({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm text-muted mb-1.5 font-medium">
        {label}
      </label>
      {children}
      {error && (
        <p className="mt-1 text-xs text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

const inputClass =
  "w-full bg-dark-3 border border-dark-3 rounded-xl px-4 py-3 text-light text-sm placeholder:text-muted/50 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/30 transition-colors";

export default function QuoteForm() {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      tipoSuperficie: "piso_residencial",
      tipoAcabado: "mate",
      areaM2: 20,
    },
  });

  const { formatPrice } = useCurrency();
  const area = watch("areaM2") ?? 20;
  const surface = watch("tipoSuperficie") ?? "piso_residencial";
  const finish = watch("tipoAcabado") ?? "mate";
  const price = calcPrice(surface as SurfaceType, area, finish as FinishType);

  const onSubmit = async (data: FormData) => {
    setSending(true);
    setServerError(null);
    try {
      await api.post("/api/v1/quotes", data);
      setSent(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error al enviar";
      setServerError(msg);
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <section id="cotizar" className="py-24 bg-dark-2">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-dark-3 border border-gold/20 rounded-2xl p-12"
          >
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="text-2xl font-display font-bold text-light mb-3">
              ¡Cotización Enviada!
            </h2>
            <p className="text-muted mb-6">
              Recibirás una confirmación por email en los próximos minutos.
              Nuestro equipo te contactará dentro de 24 horas.
            </p>
            <div className="bg-dark-2 rounded-xl p-4 text-left mb-6">
              <p className="text-muted text-sm">Precio estimado</p>
              <p className="text-gold text-3xl font-bold">
                {formatPrice(price)}
              </p>
              <p className="text-muted text-xs mt-1">
                Valor final puede variar según inspección en sitio
              </p>
            </div>
            <button
              onClick={() => setSent(false)}
              className="text-gold hover:text-gold-light text-sm underline transition-colors"
            >
              Enviar otra cotización
            </button>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="cotizar"
      className="py-24 bg-dark-2"
      aria-labelledby="quote-heading"
    >
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="text-gold text-sm font-semibold uppercase tracking-widest mb-3 block">
            Presupuesto instantáneo
          </span>
          <h2
            id="quote-heading"
            className="text-4xl md:text-5xl font-display font-bold text-light mb-4"
          >
            Cotiza tu Proyecto
          </h2>
          <p className="text-muted max-w-xl mx-auto">
            Completa el formulario y obtén un estimado de precio en tiempo real.
            Sin compromiso.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="lg:col-span-3 space-y-5"
            noValidate
            aria-label="Formulario de cotización"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <InputField label="Nombre completo *" error={errors.nombre?.message}>
                <input
                  {...register("nombre")}
                  type="text"
                  placeholder="Juan García"
                  className={inputClass}
                  aria-invalid={!!errors.nombre}
                />
              </InputField>

              <InputField label="Teléfono *" error={errors.telefono?.message}>
                <input
                  {...register("telefono")}
                  type="tel"
                  placeholder="+57 300 123 4567"
                  className={inputClass}
                  aria-invalid={!!errors.telefono}
                />
              </InputField>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <InputField label="Email *" error={errors.email?.message}>
                <input
                  {...register("email")}
                  type="email"
                  placeholder="correo@ejemplo.com"
                  className={inputClass}
                  aria-invalid={!!errors.email}
                />
              </InputField>

              <InputField label="Ciudad *" error={errors.ciudad?.message}>
                <input
                  {...register("ciudad")}
                  type="text"
                  placeholder="Bogotá, Medellín..."
                  className={inputClass}
                  aria-invalid={!!errors.ciudad}
                />
              </InputField>
            </div>

            <InputField
              label="Tipo de superficie *"
              error={errors.tipoSuperficie?.message}
            >
              <select {...register("tipoSuperficie")} className={inputClass}>
                {(Object.keys(SURFACE_LABELS) as SurfaceType[]).map((k) => (
                  <option key={k} value={k}>
                    {SURFACE_LABELS[k]}
                  </option>
                ))}
              </select>
            </InputField>

            {/* Area slider */}
            <InputField label={`Área: ${area} m²`} error={errors.areaM2?.message}>
              <div className="space-y-2">
                <input
                  {...register("areaM2", { valueAsNumber: true })}
                  type="range"
                  min={5}
                  max={100}
                  step={1}
                  className="w-full accent-gold cursor-pointer"
                  aria-valuemin={5}
                  aria-valuemax={100}
                  aria-valuenow={area}
                  aria-label={`Área en metros cuadrados: ${area}`}
                />
                <div className="flex justify-between text-muted text-xs">
                  <span>5 m²</span>
                  <span>100 m²</span>
                </div>
              </div>
            </InputField>

            <InputField
              label="Tipo de acabado *"
              error={errors.tipoAcabado?.message}
            >
              <select {...register("tipoAcabado")} className={inputClass}>
                {(Object.keys(FINISH_LABELS) as FinishType[]).map((k) => (
                  <option key={k} value={k}>
                    {FINISH_LABELS[k]}
                  </option>
                ))}
              </select>
            </InputField>

            <InputField label="Mensaje adicional (opcional)" error={errors.mensaje?.message}>
              <textarea
                {...register("mensaje")}
                rows={3}
                placeholder="Cuéntanos más sobre tu proyecto..."
                className={`${inputClass} resize-none`}
              />
            </InputField>

            {serverError && (
              <div
                className="bg-red-950/30 border border-red-800/40 rounded-xl p-3 text-red-300 text-sm"
                role="alert"
              >
                ⚠ {serverError}
              </div>
            )}

            <button
              type="submit"
              disabled={sending}
              className="w-full py-4 rounded-xl bg-gold text-dark font-bold text-base hover:bg-gold-light active:bg-gold-dark transition-all shadow-[0_0_20px_rgba(201,168,76,0.3)] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {sending ? "Enviando..." : "Enviar Cotización →"}
            </button>
          </form>

          {/* Price preview */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="sticky top-24 bg-dark-3 border border-gold/20 rounded-2xl p-6 shadow-[0_0_30px_rgba(201,168,76,0.08)]">
              <p className="text-muted text-sm mb-2">Estimado en tiempo real</p>
              <motion.div
                key={price}
                initial={{ opacity: 0.5, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <p className="text-4xl font-bold text-gold mb-1">
                  {formatPrice(price)}
                </p>
              </motion.div>
              <p className="text-muted text-xs mb-6">
                Estimado preliminar sin inspección
              </p>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted">Superficie</span>
                  <span className="text-light">{SURFACE_LABELS[surface as SurfaceType]}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Área</span>
                  <span className="text-light">{area} m²</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Acabado</span>
                  <span className="text-light">{FINISH_LABELS[finish as FinishType]}</span>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-dark-3">
                <div className="flex items-start gap-2">
                  <span className="text-gold text-sm" aria-hidden="true">✓</span>
                  <p className="text-muted text-xs">
                    Incluye materiales, mano de obra y garantía de 5 años
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
