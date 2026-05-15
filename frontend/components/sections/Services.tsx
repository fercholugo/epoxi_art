"use client";

import { motion } from "framer-motion";
import type { Service } from "@/types";
import { useCurrency } from "@/contexts/currency";

const SERVICES: Service[] = [
  {
    id: "piso_residencial",
    icon: "🏠",
    title: "Piso Residencial",
    description:
      "Pisos epóxicos para hogares con acabados personalizados. Alta resistencia y fácil mantenimiento.",
    priceBase: 80,
    unit: "m²",
    surfaceType: "piso_residencial",
  },
  {
    id: "pared_decorativa",
    icon: "🎨",
    title: "Paredes Decorativas",
    description:
      "Arte líquido para paredes. Efectos mármol, geode, ocean y diseños exclusivos a medida.",
    priceBase: 120,
    unit: "m²",
    surfaceType: "pared_decorativa",
  },
  {
    id: "acabado_especial",
    icon: "✨",
    title: "Acabados Especiales",
    description:
      "Incrustaciones metálicas, fluorescentes, holográficos y efectos 3D únicos en el mercado.",
    priceBase: 115,
    unit: "m²",
    surfaceType: "acabado_especial",
  },
  {
    id: "renovacion",
    icon: "🔄",
    title: "Renovación",
    description:
      "Rejuvenece superficies existentes. Cubrimos grietas, manchas y desgastes con nueva vida.",
    priceBase: 65,
    unit: "m²",
    surfaceType: "renovacion",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: "easeOut" },
  }),
};

export default function Services() {
  const { formatPrice } = useCurrency();
  return (
    <section
      id="servicios"
      className="py-24 bg-dark/80"
      aria-labelledby="services-heading"
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
            Lo que hacemos
          </span>
          <h2
            id="services-heading"
            className="text-4xl md:text-5xl font-display font-bold text-light mb-4"
          >
            Nuestros Servicios
          </h2>
          <p className="text-muted max-w-xl mx-auto">
            Cada proyecto es único. Trabajamos con los mejores materiales y
            técnicas para resultados que duran décadas.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((service, i) => (
            <motion.article
              key={service.id}
              variants={cardVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              custom={i}
              className="group relative bg-dark-2 border border-dark-3 rounded-2xl p-6 overflow-hidden hover:border-gold/30 transition-all duration-300 hover:shadow-[0_0_30px_rgba(201,168,76,0.08)]"
            >
              {/* Gold border left animation */}
              <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gold scale-y-0 group-hover:scale-y-100 origin-bottom transition-transform duration-400" />

              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-dark-3 flex items-center justify-center text-2xl mb-4">
                {service.icon}
              </div>

              {/* Content */}
              <h3 className="text-light font-semibold text-lg mb-2">
                {service.title}
              </h3>
              <p className="text-muted text-sm leading-relaxed mb-4">
                {service.description}
              </p>

              {/* Price */}
              <div className="flex items-baseline gap-1">
                <span className="text-gold font-bold text-xl">
                  desde {formatPrice(service.priceBase)}
                </span>
                <span className="text-muted text-sm">/{service.unit}</span>
              </div>

              {/* CTA */}
              <a
                href="#cotizar"
                className="mt-4 text-sm text-gold/70 hover:text-gold transition-colors flex items-center gap-1 group/link"
                aria-label={`Cotizar ${service.title}`}
              >
                Cotizar este servicio
                <span className="group-hover/link:translate-x-1 transition-transform inline-block">
                  →
                </span>
              </a>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
