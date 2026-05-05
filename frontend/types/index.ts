// Quote types
export type SurfaceType =
  | "piso_residencial"
  | "piso_comercial"
  | "pared_decorativa"
  | "acabado_especial"
  | "renovacion"
  | "exterior_piscina";

export type FinishType = "mate" | "semimate" | "satinado" | "alto_brillo";

export type QuoteStatus =
  | "pendiente"
  | "contactado"
  | "en_proceso"
  | "completado"
  | "cancelado";

export interface QuoteFormData {
  nombre: string;
  telefono: string;
  email: string;
  ciudad: string;
  tipoSuperficie: SurfaceType;
  areaM2: number;
  tipoAcabado: FinishType;
  mensaje?: string;
}

export interface QuoteResponse {
  id: string;
  precioEstimado: number;
  message: string;
}

// AI Analysis types
export type AnalysisStatus =
  | "idle"
  | "uploading"
  | "analyzing"
  | "success"
  | "error";

export interface ColorInfo {
  hex: string;
  nombre: string;
  rol: "principal" | "secundario" | "acento";
}

export interface ColorPalette {
  nombre: string;
  descripcion: string;
  colores: ColorInfo[];
}

export interface TextureRecommendation {
  nombre: string;
  tecnica: string;
  compatibilidad: "alta" | "media";
  razon: string;
}

export interface AnalysisResult {
  ambiente: string;
  estilo_detectado: string;
  iluminacion: "natural" | "artificial" | "mixta";
  colores_existentes: string[];
  paletas_recomendadas: ColorPalette[];
  texturas_recomendadas: TextureRecommendation[];
  acabado_recomendado: FinishType;
  nivel_complejidad: "básico" | "intermedio" | "avanzado" | "premium";
  advertencias: string[];
}

// Gallery types
export type GalleryCategory =
  | "todos"
  | "pisos"
  | "paredes"
  | "comercial"
  | "residencial";

export interface GalleryItem {
  id: string;
  title: string;
  category: Exclude<GalleryCategory, "todos">;
  src: string;
  location?: string;
}

// Service types
export interface Service {
  id: string;
  icon: string;
  title: string;
  description: string;
  priceBase: number;
  unit: string;
  surfaceType: SurfaceType;
}

// Testimonial types
export interface Testimonial {
  id: string;
  name: string;
  city: string;
  rating: number;
  text: string;
  initials: string;
}
