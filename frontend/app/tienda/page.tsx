"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import ProductCard, { type Product } from "@/components/sections/ProductCard";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const CATEGORIAS = [
  { value: "todos", label: "Todos" },
  { value: "lamparas", label: "Lámparas" },
  { value: "mesas", label: "Mesas" },
  { value: "otro", label: "Otros" },
];

export default function TiendaPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoria, setCategoria] = useState("todos");

  useEffect(() => {
    api
      .get<Product[]>("/api/v1/products")
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered =
    categoria === "todos" ? products : products.filter((p) => p.categoria === categoria);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-dark pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-12">
            <p className="text-gold uppercase tracking-widest text-sm font-medium mb-3">
              Catálogo
            </p>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-light mb-4">
              Tienda EpoxyArt
            </h1>
            <p className="text-muted max-w-2xl mx-auto text-lg">
              Piezas únicas hechas a mano en resina epóxica. Contáctanos por WhatsApp para
              hacer tu pedido.
            </p>
          </div>

          {/* Filtros */}
          <div className="flex flex-wrap gap-3 justify-center mb-10">
            {CATEGORIAS.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setCategoria(cat.value)}
                className={`px-5 py-2 rounded-xl text-sm font-medium transition-all ${
                  categoria === cat.value
                    ? "bg-gold text-dark shadow-[0_0_15px_rgba(201,168,76,0.3)]"
                    : "bg-dark-2 text-muted border border-dark-3 hover:border-gold/40 hover:text-light"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="bg-dark-2 border border-dark-3 rounded-2xl aspect-[3/4] animate-pulse"
                />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-muted text-xl mb-2">
                {products.length === 0
                  ? "La tienda está siendo preparada..."
                  : "No hay productos en esta categoría aún."}
              </p>
              <p className="text-muted text-sm">Pronto agregaremos nuevos artículos.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
