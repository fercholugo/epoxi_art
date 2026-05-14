"use client";

import { useState } from "react";

export interface Product {
  id: number;
  nombre: string;
  descripcion: string | null;
  precio: number;
  imagen_url: string | null;
  categoria: string;
  destacado: boolean;
  disponible?: boolean;
}

const CATEGORIA_LABELS: Record<string, string> = {
  mesas: "Mesas",
  bandejas: "Bandejas",
  joyeria: "Joyería",
  cuadros: "Cuadros",
  decoracion: "Decoración",
  otro: "Artículo",
};

export default function ProductCard({ product }: { product: Product }) {
  const [lightbox, setLightbox] = useState(false);
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";
  const msg = encodeURIComponent(
    `Hola, me interesa el producto: *${product.nombre}* (US$ ${Number(product.precio).toLocaleString("es-CO")}). ¿Está disponible?`
  );
  const waUrl = `https://wa.me/${whatsapp}?text=${msg}`;

  return (
    <>
      <div className="bg-dark-2 border border-dark-3 rounded-2xl overflow-hidden group hover:border-gold/30 hover:shadow-[0_0_24px_rgba(201,168,76,0.1)] transition-all duration-300 flex flex-col">
        {/* Imagen */}
        <div
          className="aspect-[4/5] bg-dark-3 overflow-hidden relative cursor-zoom-in"
          onClick={() => product.imagen_url && setLightbox(true)}
        >
          {product.imagen_url ? (
            <>
              <img
                src={product.imagen_url}
                alt={product.nombre}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              {/* Overlay con lupa al hover */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/60 rounded-full p-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </div>
              </div>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-4xl opacity-20">🏺</span>
            </div>
          )}
          {product.destacado && (
            <span className="absolute top-3 left-3 bg-gold text-dark text-xs font-bold px-2 py-1 rounded-lg shadow">
              Destacado
            </span>
          )}
        </div>

        {/* Contenido */}
        <div className="p-5 flex flex-col flex-1">
          <span className="text-xs text-gold uppercase tracking-wider font-medium">
            {CATEGORIA_LABELS[product.categoria] ?? product.categoria}
          </span>
          <h3 className="text-light font-semibold mt-1 mb-2 leading-tight">{product.nombre}</h3>
          {product.descripcion && (
            <p className="text-muted text-sm mb-4 line-clamp-2 flex-1">{product.descripcion}</p>
          )}
          <div className="flex items-center justify-between mt-auto pt-3 border-t border-dark-3">
            <span className="text-gold font-bold text-lg">
              US$ {Number(product.precio).toLocaleString("es-CO", { minimumFractionDigits: 0 })}
            </span>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-green-700 hover:bg-green-600 text-white text-sm font-semibold rounded-xl transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.554 4.122 1.522 5.854L0 24l6.352-1.498A11.934 11.934 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.797 9.797 0 01-5.003-1.374l-.36-.214-3.72.877.936-3.619-.234-.373A9.794 9.794 0 012.182 12C2.182 6.58 6.58 2.182 12 2.182S21.818 6.58 21.818 12 17.42 21.818 12 21.818z"/>
              </svg>
              Pedir
            </a>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && product.imagen_url && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setLightbox(false)}
        >
          <button
            className="absolute top-4 right-4 text-white/70 hover:text-white text-3xl leading-none"
            onClick={() => setLightbox(false)}
          >
            ✕
          </button>
          <img
            src={product.imagen_url}
            alt={product.nombre}
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
          <p className="absolute bottom-6 text-white/60 text-sm">{product.nombre}</p>
        </div>
      )}
    </>
  );
}
