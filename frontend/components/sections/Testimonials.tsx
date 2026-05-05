"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import type { Testimonial } from "@/types";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

const TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    name: "María Fernanda López",
    city: "Bogotá",
    rating: 5,
    text: "Transformaron completamente mi cocina. El efecto mármol quedó impresionante, exactamente como lo pedí. El proceso fue limpio y terminaron en tiempo récord.",
    initials: "ML",
  },
  {
    id: "t2",
    name: "Carlos Andrés Ruiz",
    city: "Medellín",
    rating: 5,
    text: "Contraté a EpoxyArt para mi local comercial y el resultado superó mis expectativas. El piso soporta el tráfico diario sin problema y sigue como el primer día.",
    initials: "CR",
  },
  {
    id: "t3",
    name: "Ana Sofía Bermúdez",
    city: "Cali",
    rating: 5,
    text: "La herramienta de IA fue increíble para elegir la paleta de colores. Me ayudó a visualizar el resultado final antes de comenzar. 100% recomendados.",
    initials: "AB",
  },
  {
    id: "t4",
    name: "Roberto Jiménez",
    city: "Barranquilla",
    rating: 5,
    text: "Excelente trabajo en el piso de mi terraza. El epóxico antideslizante que usaron es perfecto para la zona de piscina. Ya les pedí cotización para la sala.",
    initials: "RJ",
  },
  {
    id: "t5",
    name: "Valentina Morales",
    city: "Cartagena",
    rating: 5,
    text: "El equipo fue muy profesional. Me explicaron cada etapa del proceso y el resultado del pared decorativa con efecto geode es una obra de arte.",
    initials: "VM",
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`Calificación: ${rating} de 5 estrellas`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < rating ? "text-gold" : "text-dark-3"}>
          ★
        </span>
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section
      id="testimonios"
      className="py-24 bg-dark-2"
      aria-labelledby="testimonials-heading"
    >
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="text-gold text-sm font-semibold uppercase tracking-widest mb-3 block">
            Clientes satisfechos
          </span>
          <h2
            id="testimonials-heading"
            className="text-4xl md:text-5xl font-display font-bold text-light mb-4"
          >
            Lo Que Dicen
          </h2>
          <p className="text-muted max-w-xl mx-auto">
            Más de 350 proyectos completados. Cada opinión refleja nuestro
            compromiso con la excelencia.
          </p>
        </motion.div>

        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={24}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          className="pb-12"
          a11y={{
            prevSlideMessage: "Testimonio anterior",
            nextSlideMessage: "Siguiente testimonio",
          }}
        >
          {TESTIMONIALS.map((t) => (
            <SwiperSlide key={t.id}>
              <article className="bg-dark-3 border border-dark-3 hover:border-gold/20 rounded-2xl p-6 h-full flex flex-col transition-colors">
                {/* Avatar + info */}
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-10 h-10 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center text-gold font-bold text-sm flex-shrink-0"
                    aria-hidden="true"
                  >
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-light font-semibold text-sm">{t.name}</p>
                    <p className="text-muted text-xs">📍 {t.city}</p>
                  </div>
                </div>

                <StarRating rating={t.rating} />

                <p className="text-muted text-sm leading-relaxed mt-3 flex-1">
                  &ldquo;{t.text}&rdquo;
                </p>
              </article>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
