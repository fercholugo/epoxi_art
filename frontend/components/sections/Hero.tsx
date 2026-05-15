"use client";

import { motion } from "framer-motion";
import Button from "@/components/ui/Button";

const STATS = [
  { value: "+100", label: "Proyectos" },
  { value: "5+", label: "Años de Experiencia" },
  { value: "100%", label: "Garantía" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: "easeOut" },
  }),
};

export default function Hero() {
  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center overflow-hidden"
      aria-label="Sección principal"
    >
      {/* Noise overlay for texture */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-16 w-full">
        <div className="max-w-3xl">
          {/* Badge */}
          <motion.span
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0.1}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gold/30 bg-gold/10 text-gold text-sm font-medium mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-gold animate-pulse-gold" aria-hidden="true" />
            Resina Epóxica Premium
          </motion.span>

          {/* H1 */}
          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0.2}
            className="text-5xl sm:text-6xl md:text-7xl font-display font-bold text-light leading-[1.1] mb-6 text-balance"
          >
            Transforma tus Espacios con{" "}
            <span className="gold-gradient">Arte Líquido</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0.3}
            className="text-lg text-muted max-w-xl mb-8 leading-relaxed"
          >
            Pisos y paredes decorativas en resina epóxica de alta resistencia.
            Diseños únicos hechos a mano para cada espacio.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0.4}
            className="flex flex-col sm:flex-row gap-4 mb-16"
          >
            <Button href="#cotizar" variant="primary" size="lg">
              Solicitar Cotización
            </Button>
            <Button href="#servicios" variant="outline" size="lg">
              Ver Servicios
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0.55}
            className="flex flex-wrap gap-10"
          >
            {STATS.map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl font-bold text-gold">{stat.value}</div>
                <div className="text-sm text-muted mt-0.5">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-dark to-transparent"
        aria-hidden="true"
      />
    </section>
  );
}
