"use client";

import { motion } from "framer-motion";

const STEPS = [
  {
    number: "01",
    icon: "💬",
    title: "Consulta Inicial",
    description:
      "Hablamos de tu proyecto, espacio y visión. Evaluamos la superficie y definimos el alcance del trabajo.",
  },
  {
    number: "02",
    icon: "🛠️",
    title: "Preparación",
    description:
      "Limpieza profunda, reparación de grietas y aplicación de imprimante. La base perfecta garantiza el resultado.",
  },
  {
    number: "03",
    icon: "✅",
    title: "Aplicación y Entrega",
    description:
      "Aplicamos el epóxico en capas con técnica experta. Curado y sellado final. Tu espacio transformado.",
  },
];

export default function Process() {
  return (
    <section
      id="proceso"
      className="py-24 bg-dark-2/20"
      aria-labelledby="process-heading"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-gold text-sm font-semibold uppercase tracking-widest mb-3 block">
            Cómo trabajamos
          </span>
          <h2
            id="process-heading"
            className="text-4xl md:text-5xl font-display font-bold text-light mb-4"
          >
            Proceso de Trabajo
          </h2>
          <p className="text-muted max-w-xl mx-auto">
            Un proceso transparente y meticuloso que garantiza resultados
            excepcionales en cada proyecto.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connector line — desktop */}
          <div
            className="hidden lg:block absolute top-12 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent"
            aria-hidden="true"
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-6">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative flex flex-col items-center lg:items-start text-center lg:text-left"
              >
                {/* Mobile connector */}
                {i < STEPS.length - 1 && (
                  <div
                    className="lg:hidden absolute left-1/2 top-24 w-px h-8 bg-gold/20"
                    aria-hidden="true"
                  />
                )}

                {/* Number + Icon */}
                <div className="relative mb-6">
                  <div className="w-24 h-24 rounded-2xl bg-dark-3 border border-dark-3 group-hover:border-gold/30 flex flex-col items-center justify-center transition-all">
                    <span className="text-3xl mb-1">{step.icon}</span>
                  </div>
                  <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-gold flex items-center justify-center">
                    <span className="text-dark font-bold text-xs">
                      {step.number}
                    </span>
                  </div>
                </div>

                <h3 className="text-light font-semibold text-lg mb-2">
                  {step.title}
                </h3>
                <p className="text-muted text-sm leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
