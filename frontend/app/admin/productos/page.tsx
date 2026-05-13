"use client";

import { useEffect, useState } from "react";
import {
  listAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  type ProductItem,
  type ProductPayload,
} from "@/lib/admin-api";

const CATEGORIAS = ["mesas", "bandejas", "joyeria", "cuadros", "decoracion", "otro"];

const EMPTY_FORM: ProductPayload = {
  nombre: "",
  descripcion: "",
  precio: 0,
  imagen_url: "",
  categoria: "otro",
  disponible: true,
  destacado: false,
};

export default function ProductosAdmin() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<ProductItem | null>(null);
  const [form, setForm] = useState<ProductPayload>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    listAllProducts()
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  function openCreate() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setError(null);
    setShowModal(true);
  }

  function openEdit(p: ProductItem) {
    setEditing(p);
    setForm({
      nombre: p.nombre,
      descripcion: p.descripcion ?? "",
      precio: p.precio,
      imagen_url: p.imagen_url ?? "",
      categoria: p.categoria,
      disponible: p.disponible,
      destacado: p.destacado,
    });
    setError(null);
    setShowModal(true);
  }

  async function handleSave() {
    if (!form.nombre || form.precio <= 0) {
      setError("Nombre y precio son requeridos.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const payload = { ...form, precio: Number(form.precio) };
      if (editing) {
        await updateProduct(editing.id, payload);
      } else {
        await createProduct(payload);
      }
      setShowModal(false);
      load();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error al guardar");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(p: ProductItem) {
    if (!confirm(`¿Eliminar "${p.nombre}"?`)) return;
    await deleteProduct(p.id).catch(console.error);
    load();
  }

  async function toggleField(p: ProductItem, field: "disponible" | "destacado") {
    await updateProduct(p.id, { [field]: !p[field] }).catch(console.error);
    load();
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-light">Productos</h1>
          <p className="text-muted text-sm mt-1">Gestiona el catálogo de la tienda</p>
        </div>
        <button
          onClick={openCreate}
          className="px-5 py-2.5 bg-gold text-dark font-semibold rounded-xl hover:bg-yellow-400 transition-colors text-sm"
        >
          + Nuevo producto
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 bg-dark-2 border border-dark-3 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="bg-dark-2 border border-dark-3 rounded-2xl p-16 text-center">
          <p className="text-muted">No hay productos aún. Agrega el primero.</p>
        </div>
      ) : (
        <div className="bg-dark-2 border border-dark-3 rounded-2xl overflow-hidden">
          <div className="divide-y divide-dark-3">
            {products.map((p) => (
              <div key={p.id} className="flex items-center gap-4 px-6 py-4 hover:bg-dark-3/30 transition-colors">
                {/* Imagen miniatura */}
                <div className="w-12 h-12 rounded-lg bg-dark-3 overflow-hidden flex-shrink-0">
                  {p.imagen_url ? (
                    <img src={p.imagen_url} alt={p.nombre} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-lg">🏺</div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-light font-medium truncate">{p.nombre}</p>
                  <p className="text-muted text-xs capitalize">{p.categoria}</p>
                </div>

                {/* Precio */}
                <span className="text-gold font-bold text-sm whitespace-nowrap">
                  US$ {Number(p.precio).toLocaleString("es-CO")}
                </span>

                {/* Toggles */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleField(p, "disponible")}
                    className={`text-xs px-2.5 py-1 rounded-full border font-medium transition-colors ${
                      p.disponible
                        ? "bg-green-500/10 text-green-400 border-green-500/20"
                        : "bg-dark-3 text-muted border-dark-3"
                    }`}
                  >
                    {p.disponible ? "Visible" : "Oculto"}
                  </button>
                  <button
                    onClick={() => toggleField(p, "destacado")}
                    className={`text-xs px-2.5 py-1 rounded-full border font-medium transition-colors ${
                      p.destacado
                        ? "bg-gold/10 text-gold border-gold/20"
                        : "bg-dark-3 text-muted border-dark-3"
                    }`}
                  >
                    {p.destacado ? "★ Dest." : "☆ Dest."}
                  </button>
                </div>

                {/* Acciones */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEdit(p)}
                    className="text-muted hover:text-light text-sm px-3 py-1.5 rounded-lg hover:bg-dark-3 transition-colors"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(p)}
                    className="text-red-400 hover:text-red-300 text-sm px-3 py-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal crear/editar */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-dark-2 border border-dark-3 rounded-2xl w-full max-w-lg p-6 shadow-2xl">
            <h2 className="text-light font-bold text-lg mb-5">
              {editing ? "Editar producto" : "Nuevo producto"}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-muted text-sm block mb-1">Nombre *</label>
                <input
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  className="w-full bg-dark-3 border border-dark-3 text-light rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gold/50"
                  placeholder="Mesa de resina azul"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-muted text-sm block mb-1">Precio (US$) *</label>
                  <input
                    type="number"
                    value={form.precio}
                    onChange={(e) => setForm({ ...form, precio: Number(e.target.value) })}
                    className="w-full bg-dark-3 border border-dark-3 text-light rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gold/50"
                    min={0}
                  />
                </div>
                <div>
                  <label className="text-muted text-sm block mb-1">Categoría</label>
                  <select
                    value={form.categoria}
                    onChange={(e) => setForm({ ...form, categoria: e.target.value })}
                    className="w-full bg-dark-3 border border-dark-3 text-light rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gold/50"
                  >
                    {CATEGORIAS.map((c) => (
                      <option key={c} value={c} className="capitalize">{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-muted text-sm block mb-1">Descripción</label>
                <textarea
                  value={form.descripcion}
                  onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                  className="w-full bg-dark-3 border border-dark-3 text-light rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gold/50 resize-none"
                  rows={3}
                  placeholder="Describe el producto..."
                />
              </div>

              <div>
                <label className="text-muted text-sm block mb-1">URL de imagen</label>
                <input
                  value={form.imagen_url}
                  onChange={(e) => setForm({ ...form, imagen_url: e.target.value })}
                  className="w-full bg-dark-3 border border-dark-3 text-light rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gold/50"
                  placeholder="https://..."
                />
              </div>

              <div className="flex items-center gap-6 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.disponible}
                    onChange={(e) => setForm({ ...form, disponible: e.target.checked })}
                    className="accent-gold w-4 h-4"
                  />
                  <span className="text-muted text-sm">Visible en tienda</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.destacado}
                    onChange={(e) => setForm({ ...form, destacado: e.target.checked })}
                    className="accent-gold w-4 h-4"
                  />
                  <span className="text-muted text-sm">Destacado</span>
                </label>
              </div>

              {error && (
                <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2">
                  {error}
                </p>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2.5 bg-dark-3 text-muted rounded-xl hover:text-light transition-colors text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 px-4 py-2.5 bg-gold text-dark font-semibold rounded-xl hover:bg-yellow-400 transition-colors text-sm disabled:opacity-50"
              >
                {saving ? "Guardando..." : editing ? "Guardar cambios" : "Crear producto"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
