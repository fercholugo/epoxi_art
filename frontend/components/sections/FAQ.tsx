"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FAQS = [
  {
    q: "¿Cuánto tiempo tarda en secar el piso epóxico?",
    a: "El tiempo de curado inicial es de 24-48 horas, durante las cuales puedes caminar sobre la superficie con cuidado. El curado completo toma 7 días, tras los cuales el piso alcanza su máxima resistencia. Recomendamos no colocar muebles pesados durante esa semana.",
  },
  {
    q: "¿El piso epóxico es resbaladizo?",
    a: "En condiciones secas, el piso epóxico tiene una tracción excelente. Para zonas húmedas como baños, cocinas, terrazas o piscinas, aplicamos aditivos antideslizantes que garantizan la seguridad sin comprometer la estética.",
  },
  {
    q: "¿Cuánto dura un piso de resina epóxica?",
    a: "Con el mantenimiento adecuado, un piso epóxico correctamente instalado puede durar 15-20 años en ambientes residenciales. En espacios comerciales de alto tráfico, entre 8-12 años. Todos nuestros proyectos incluyen garantía de 5 años.",
  },
  {
    q: "¿Se puede aplicar sobre el piso existente?",
    a: "En la mayoría de los casos sí. Evaluamos la superficie actual: si es concreto, cerámica o baldosa en buen estado, podemos aplicar directamente con la preparación adecuada. Si hay grietas o humedad excesiva, realizamos las reparaciones previas necesarias.",
  },
  {
    q: "¿Qué tan difícil es el mantenimiento?",
    a: "El mantenimiento es muy sencillo. Basta con barrer regularmente y limpiar con agua y jabón neutro. Evita productos abrasivos o ácidos. Para mayor brillo, puedes aplicar un sellador cada 2-3 años. Es mucho más fácil de mantener que las baldosas o el mármol natural.",
  },
  {
    q: "¿Puedo ver cómo quedaría antes de empezar?",
    a: "¡Sí! Antes de iniciar cualquier proyecto revisamos contigo referencias visuales, te mostramos trabajos similares de nuestro portafolio y preparamos muestras físicas de 30x30 cm con los colores y texturas elegidos. Así apruebas el resultado antes de que empecemos.",
  },
  {
    q: "¿Tienen garantía y qué cubre?",
    a: "Ofrecemos garantía de 5 años que cubre defectos de aplicación, burbujas, desprendimientos y pérdida prematura de color. No cubre daños por mal uso, impactos severos o limpieza con productos incorrectos. En caso de garantía, reparamos sin costo adicional.",
  },
  {
    q: "¿Cuál es el costo por metro cuadrado?",
    a: "Los precios varían según el tipo de superficie y acabado: pisos residenciales desde $55/m², comerciales desde $65/m², paredes decorativas desde $120/m². Usa nuestro cotizador interactivo para obtener un estimado personalizado al instante, o contáctanos para una visita de inspección gratuita.",
  },
];

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}

function FAQItem({ question, answer, isOpen, onToggle, index }: FAQItemProps) {
  const id = `faq-answer-${index}`;
  return (
    <div className="border border-dark-3 rounded-xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left bg-dark-2 hover:bg-dark-3 transition-colors"
        aria-expanded={isOpen}
        aria-controls={id}
      >
        <span className="text-light font-medium text-sm sm:text-base">
          {question}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-gold text-xl flex-shrink-0"
          aria-hidden="true"
        >
          +
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={id}
            role="region"
            aria-label={question}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="px-6 py-4 text-muted text-sm leading-relaxed border-t border-dark-3">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  // Schema.org FAQPage JSON-LD
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };

  return (
    <section
      id="faq"
      className="py-24 bg-dark/65"
      aria-labelledby="faq-heading"
    >
      {/* Schema.org structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="text-gold text-sm font-semibold uppercase tracking-widest mb-3 block">
            Dudas frecuentes
          </span>
          <h2
            id="faq-heading"
            className="text-4xl md:text-5xl font-display font-bold text-light mb-4"
          >
            Preguntas Frecuentes
          </h2>
          <p className="text-muted">
            Todo lo que necesitas saber antes de tu proyecto.
          </p>
        </motion.div>

        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
            >
              <FAQItem
                question={faq.q}
                answer={faq.a}
                isOpen={openIndex === i}
                onToggle={() => toggle(i)}
                index={i}
              />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-10 text-center"
        >
          <p className="text-muted text-sm mb-4">
            ¿No encontraste tu respuesta?
          </p>
          <a
            href="#cotizar"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-gold text-gold hover:bg-gold/10 transition-colors font-medium text-sm"
          >
            Contáctanos directamente →
          </a>
        </motion.div>
      </div>
    </section>
  );
}
