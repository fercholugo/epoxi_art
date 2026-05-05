"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useImageAnalysis } from "@/hooks/useImageAnalysis";
import type { ColorPalette } from "@/types";

function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div className={`bg-shimmer rounded-xl ${className ?? ""}`} aria-hidden="true" />
  );
}

function PaletteCard({ palette }: { palette: ColorPalette }) {
  return (
    <div className="bg-dark-3 rounded-xl p-4">
      <div className="flex gap-2 mb-3">
        {palette.colores.map((c) => (
          <div
            key={c.hex}
            className="flex-1 h-10 rounded-lg transition-transform hover:scale-105"
            style={{ backgroundColor: c.hex }}
            title={`${c.nombre} (${c.hex})`}
          />
        ))}
      </div>
      <p className="text-light text-sm font-semibold mb-1">{palette.nombre}</p>
      <p className="text-muted text-xs">{palette.descripcion}</p>
    </div>
  );
}

export default function AIAnalyzer() {
  const {
    status,
    preview,
    result,
    error,
    fileInputRef,
    handleFileChange,
    handleDrop,
    handleDragOver,
    handleAnalyze,
    handleReset,
  } = useImageAnalysis();

  return (
    <section
      id="ia"
      className="py-24 bg-dark"
      aria-labelledby="ai-heading"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="text-gold text-sm font-semibold uppercase tracking-widest mb-3 block">
            Tecnología IA
          </span>
          <h2
            id="ai-heading"
            className="text-4xl md:text-5xl font-display font-bold text-light mb-4"
          >
            Diseño Inteligente
          </h2>
          <p className="text-muted max-w-xl mx-auto">
            Sube una foto de tu espacio y nuestra IA analizará colores, estilo
            y te recomendará las mejores opciones de resina epóxica.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Upload panel */}
          <div className="space-y-4">
            {/* Drop zone */}
            <AnimatePresence mode="wait">
              {!preview ? (
                <motion.div
                  key="dropzone"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="relative"
                >
                  <div
                    className="border-2 border-dashed border-dark-3 hover:border-gold/40 rounded-2xl p-12 flex flex-col items-center justify-center text-center transition-all cursor-pointer group bg-dark-2 min-h-[280px]"
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onClick={() => fileInputRef.current?.click()}
                    role="button"
                    tabIndex={0}
                    aria-label="Zona de carga de imagen. Haz clic o arrastra una foto"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ")
                        fileInputRef.current?.click();
                    }}
                  >
                    <div className="w-16 h-16 rounded-2xl bg-dark-3 group-hover:bg-gold/10 flex items-center justify-center text-3xl mb-4 transition-colors">
                      📸
                    </div>
                    <p className="text-light font-medium mb-1">
                      Arrastra tu foto aquí
                    </p>
                    <p className="text-muted text-sm mb-4">
                      o haz clic para seleccionar
                    </p>
                    <span className="px-4 py-2 rounded-lg bg-dark-3 text-muted text-xs">
                      JPG, PNG · máx 10 MB
                    </span>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={handleFileChange}
                    aria-label="Seleccionar imagen"
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="relative rounded-2xl overflow-hidden bg-dark-2 border border-dark-3"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={preview}
                    alt="Vista previa de tu espacio"
                    className="w-full h-64 object-cover"
                  />
                  <button
                    onClick={handleReset}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-dark/80 backdrop-blur-sm text-muted hover:text-light flex items-center justify-center text-sm transition-colors"
                    aria-label="Eliminar imagen"
                  >
                    ✕
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Surface select + Analyze button */}
            {preview && status !== "analyzing" && status !== "success" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                <button
                  onClick={handleAnalyze}
                  disabled={status === "uploading"}
                  className="w-full py-3.5 rounded-xl bg-gold text-dark font-semibold hover:bg-gold-light active:bg-gold-dark transition-colors shadow-[0_0_20px_rgba(201,168,76,0.3)] disabled:opacity-60"
                  aria-label="Analizar imagen con IA"
                >
                  ✦ Analizar con IA
                </button>
                <p className="text-muted text-xs text-center">
                  El análisis tarda aproximadamente 5-8 segundos
                </p>
              </motion.div>
            )}

            {/* Error */}
            {status === "error" && error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-red-950/30 border border-red-800/40 rounded-xl p-4 flex items-start gap-3"
                role="alert"
              >
                <span className="text-red-400 text-lg" aria-hidden="true">⚠</span>
                <div>
                  <p className="text-red-300 text-sm font-medium">
                    Error al analizar
                  </p>
                  <p className="text-red-400/70 text-xs mt-0.5">{error}</p>
                  <button
                    onClick={handleReset}
                    className="text-red-400 hover:text-red-300 text-xs mt-2 underline"
                  >
                    Intentar de nuevo
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Results panel */}
          <div className="min-h-[280px]">
            <AnimatePresence mode="wait">
              {status === "idle" && !preview && (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  className="h-full border border-dashed border-dark-3 rounded-2xl flex items-center justify-center"
                >
                  <p className="text-muted text-sm">
                    Los resultados aparecerán aquí
                  </p>
                </motion.div>
              )}

              {(status === "analyzing" || status === "uploading") && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                  aria-live="polite"
                  aria-label="Analizando imagen..."
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-5 h-5 rounded-full border-2 border-gold border-t-transparent animate-spin" aria-hidden="true" />
                    <p className="text-gold text-sm font-medium animate-pulse">
                      Analizando tu espacio con IA...
                    </p>
                  </div>
                  <SkeletonBlock className="h-6 w-3/4" />
                  <SkeletonBlock className="h-20" />
                  <SkeletonBlock className="h-20" />
                  <SkeletonBlock className="h-20" />
                  <SkeletonBlock className="h-4 w-1/2" />
                </motion.div>
              )}

              {status === "success" && result && (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-5"
                  aria-live="polite"
                >
                  {/* Detected style */}
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 rounded-full bg-gold/15 text-gold text-xs font-semibold">
                      {result.estilo_detectado}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-dark-3 text-muted text-xs">
                      {result.iluminacion} iluminación
                    </span>
                    <span className="px-3 py-1 rounded-full bg-dark-3 text-muted text-xs">
                      {result.nivel_complejidad}
                    </span>
                  </div>

                  <p className="text-muted text-sm">{result.ambiente}</p>

                  {/* Color palettes */}
                  <div>
                    <h3 className="text-light text-sm font-semibold mb-3">
                      Paletas Recomendadas
                    </h3>
                    <div className="space-y-3">
                      {result.paletas_recomendadas.map((palette) => (
                        <PaletteCard key={palette.nombre} palette={palette} />
                      ))}
                    </div>
                  </div>

                  {/* Finish recommendation */}
                  <div className="bg-dark-3 rounded-xl p-4">
                    <p className="text-muted text-xs mb-1">Acabado recomendado</p>
                    <p className="text-gold font-semibold capitalize">
                      {result.acabado_recomendado.replace("_", " ")}
                    </p>
                  </div>

                  {/* CTA */}
                  <a
                    href="#cotizar"
                    className="block w-full py-3 rounded-xl border border-gold text-gold text-center text-sm font-semibold hover:bg-gold/10 transition-colors"
                  >
                    Usar esta selección en cotización →
                  </a>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
