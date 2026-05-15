"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Modal from "@/components/ui/Modal";
import type { GalleryCategory, GalleryItem } from "@/types";

// Procedural gallery items (replaced by real photos later)
const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "g1",
    title: "Mármol Blanco Carrara",
    category: "pisos",
    src: "/images/gallery/placeholder",
    location: "Bogotá",
  },
  {
    id: "g2",
    title: "Geode Azul Cobalto",
    category: "paredes",
    src: "/images/gallery/placeholder",
    location: "Medellín",
  },
  {
    id: "g3",
    title: "Terrazo Moderno",
    category: "comercial",
    src: "/images/gallery/placeholder",
    location: "Cali",
  },
  {
    id: "g4",
    title: "Ocean Wave Residencial",
    category: "residencial",
    src: "/images/gallery/placeholder",
    location: "Barranquilla",
  },
  {
    id: "g5",
    title: "Piso Industrial Gris",
    category: "comercial",
    src: "/images/gallery/placeholder",
    location: "Bogotá",
  },
  {
    id: "g6",
    title: "Textura Metálica Dorada",
    category: "paredes",
    src: "/images/gallery/placeholder",
    location: "Cartagena",
  },
  {
    id: "g7",
    title: "Efecto Madera",
    category: "pisos",
    src: "/images/gallery/placeholder",
    location: "Pereira",
  },
  {
    id: "g8",
    title: "Loft Minimalista",
    category: "residencial",
    src: "/images/gallery/placeholder",
    location: "Bogotá",
  },
];

const CATEGORIES: { id: GalleryCategory; label: string }[] = [
  { id: "todos", label: "Todos" },
  { id: "pisos", label: "Pisos" },
  { id: "paredes", label: "Paredes" },
  { id: "comercial", label: "Comercial" },
  { id: "residencial", label: "Residencial" },
];

// Procedural canvas colors for placeholder images
const PALETTE: Record<string, string[]> = {
  g1: ["#e8e0d5", "#d4c9b8", "#c9a84c"],
  g2: ["#1a3a5c", "#2d6a9f", "#56bf97"],
  g3: ["#c4b5a0", "#8b7355", "#d4a847"],
  g4: ["#1e4d6b", "#3d8c6e", "#56bf97"],
  g5: ["#3a3a3a", "#5a5a5a", "#c9a84c"],
  g6: ["#2a1a0a", "#8b6914", "#e8c97a"],
  g7: ["#5c3d1e", "#8b5e3c", "#c9a84c"],
  g8: ["#1a1a1a", "#2d2d2d", "#c9a84c"],
};

function ProceduralImage({
  id,
  alt,
  className,
}: {
  id: string;
  alt: string;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden ${className ?? ""}`}
      role="img"
      aria-label={alt}
    >
      <div
        className="w-full h-full"
        style={{
          background: `linear-gradient(135deg, ${(PALETTE[id] ?? ["#1a1a1a", "#242424", "#c9a84c"]).join(", ")})`,
        }}
      />
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `radial-gradient(ellipse at 30% 40%, ${PALETTE[id]?.[2] ?? "#c9a84c"}44 0%, transparent 60%),
                            radial-gradient(ellipse at 70% 60%, ${PALETTE[id]?.[1] ?? "#242424"}66 0%, transparent 50%)`,
        }}
      />
    </div>
  );
}

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState<GalleryCategory>("todos");
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  const filtered = activeCategory === "todos"
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter((item) => item.category === activeCategory);

  const handleClose = useCallback(() => setSelectedItem(null), []);

  return (
    <section
      id="galeria"
      className="py-24 bg-dark/65"
      aria-labelledby="gallery-heading"
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
            Portafolio
          </span>
          <h2
            id="gallery-heading"
            className="text-4xl md:text-5xl font-display font-bold text-light mb-4"
          >
            Proyectos Realizados
          </h2>
          <p className="text-muted max-w-xl mx-auto">
            Cada proyecto cuenta una historia de transformación. Explora nuestro
            trabajo y encuentra inspiración para tu espacio.
          </p>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-10" role="group" aria-label="Filtrar galería">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat.id
                  ? "bg-gold text-dark"
                  : "bg-dark-2 text-muted hover:text-light border border-dark-3 hover:border-gold/30"
              }`}
              aria-pressed={activeCategory === cat.id}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Masonry-like grid */}
        <motion.div
          layout
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          <AnimatePresence>
            {filtered.map((item, i) => (
              <motion.button
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
                onClick={() => setSelectedItem(item)}
                className={`group relative rounded-xl overflow-hidden cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
                  i % 5 === 0 ? "col-span-2 row-span-2" : ""
                }`}
                style={{ minHeight: i % 5 === 0 ? 280 : 180 }}
                aria-label={`Ver ${item.title} en lightbox`}
              >
                <ProceduralImage
                  id={item.id}
                  alt={item.title}
                  className="absolute inset-0"
                />
                <div className="absolute inset-0 bg-dark/0 group-hover:bg-dark/50 transition-colors duration-300 flex items-end">
                  <div className="p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-light font-semibold text-sm">{item.title}</p>
                    {item.location && (
                      <p className="text-muted text-xs">{item.location}</p>
                    )}
                  </div>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Lightbox */}
        <Modal isOpen={!!selectedItem} onClose={handleClose} className="max-w-3xl">
          {selectedItem && (
            <div>
              <div className="relative h-80 rounded-t-2xl overflow-hidden">
                <ProceduralImage
                  id={selectedItem.id}
                  alt={selectedItem.title}
                  className="absolute inset-0"
                />
              </div>
              <div className="p-6">
                <h3 className="text-light font-display font-bold text-2xl mb-1">
                  {selectedItem.title}
                </h3>
                <div className="flex gap-3">
                  <span className="px-3 py-1 rounded-full bg-dark-3 text-muted text-xs capitalize">
                    {selectedItem.category}
                  </span>
                  {selectedItem.location && (
                    <span className="px-3 py-1 rounded-full bg-dark-3 text-muted text-xs">
                      📍 {selectedItem.location}
                    </span>
                  )}
                </div>
                <div className="mt-4">
                  <a
                    href="#cotizar"
                    onClick={handleClose}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold text-dark font-semibold text-sm hover:bg-gold-light transition-colors"
                  >
                    Cotizar proyecto similar →
                  </a>
                </div>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </section>
  );
}
