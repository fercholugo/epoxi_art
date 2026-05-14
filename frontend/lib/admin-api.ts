const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

const TOKEN_KEY = "epoxyart_admin_token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, { ...init, headers });

  if (res.status === 401) {
    clearToken();
    window.location.href = "/admin/login";
    throw new Error("Sesión expirada");
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Error del servidor" }));
    throw new Error(`${err.detail ?? "Error desconocido"} [${res.url}]`);
  }

  return res.json();
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export async function login(email: string, password: string) {
  const data = await request<{ access_token: string; admin_email: string }>(
    "/api/v1/auth/login",
    { method: "POST", body: JSON.stringify({ email, password }) }
  );
  setToken(data.access_token);
  return data;
}

// ─── Quotes ──────────────────────────────────────────────────────────────────

export interface QuoteItem {
  id: number;
  nombre: string;
  email: string;
  ciudad: string;
  tipoSuperficie: string;
  areaM2: number;
  precioEstimado: number | null;
  estado: string;
  createdAt: string;
}

export interface QuoteDetail extends QuoteItem {
  telefono: string;
  tipoAcabado: string;
  mensaje: string | null;
}

export interface QuoteListResponse {
  items: QuoteItem[];
  total: number;
}

export interface DashboardStats {
  total: number;
  pendientes: number;
  esta_semana: number;
  ingresos_estimados: number;
}

export async function getStats(): Promise<DashboardStats> {
  return request("/api/v1/quotes/stats");
}

export async function listQuotes(params: {
  page?: number;
  page_size?: number;
  estado?: string;
  search?: string;
}): Promise<QuoteListResponse> {
  const qs = new URLSearchParams();
  if (params.page) qs.set("page", String(params.page));
  if (params.page_size) qs.set("page_size", String(params.page_size));
  if (params.estado) qs.set("estado", params.estado);
  if (params.search) qs.set("search", params.search);
  return request(`/v1/quotes?${qs}`);
}

export async function getQuote(id: number): Promise<QuoteDetail> {
  return request(`/v1/quotes/${id}`);
}

export async function patchQuote(id: number, estado: string, notas?: string) {
  return request(`/v1/quotes/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ estado, notas }),
  });
}

// ─── Products ─────────────────────────────────────────────────────────────────

export interface ProductItem {
  id: number;
  nombre: string;
  descripcion: string | null;
  precio: number;
  imagen_url: string | null;
  categoria: string;
  disponible: boolean;
  destacado: boolean;
  createdAt: string;
}

export interface ProductPayload {
  nombre: string;
  descripcion?: string;
  precio: number;
  imagen_url?: string;
  categoria: string;
  disponible: boolean;
  destacado: boolean;
}

export async function listAllProducts(): Promise<ProductItem[]> {
  return request("/api/v1/products/admin/all");
}

export async function createProduct(data: ProductPayload): Promise<ProductItem> {
  return request("/api/v1/products", { method: "POST", body: JSON.stringify(data) });
}

export async function updateProduct(id: number, data: Partial<ProductPayload>): Promise<ProductItem> {
  return request(`/v1/products/${id}`, { method: "PUT", body: JSON.stringify(data) });
}

export async function deleteProduct(id: number): Promise<void> {
  return request(`/v1/products/${id}`, { method: "DELETE" });
}
