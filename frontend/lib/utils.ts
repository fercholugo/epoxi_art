import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { SurfaceType, FinishType } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const BASE_PRICES: Record<SurfaceType, number> = {
  piso_residencial: 80,
  pared_decorativa: 120,
  acabado_especial: 100,
  renovacion: 55,
};

export const FINISH_MULTIPLIERS: Record<FinishType, number> = {
  mate: 1.0,
  semimate: 1.1,
  satinado: 1.2,
  alto_brillo: 1.35,
};

export function calcPrice(
  surface: SurfaceType,
  area: number,
  finish: FinishType
): number {
  const base = BASE_PRICES[surface] ?? 0;
  const multiplier = FINISH_MULTIPLIERS[finish] ?? 1;
  return Math.round(base * area * multiplier);
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export const SURFACE_LABELS: Record<SurfaceType, string> = {
  piso_residencial: "Piso Residencial",
  pared_decorativa: "Pared Decorativa",
  acabado_especial: "Acabado Especial",
  renovacion: "Renovación",
};

export const FINISH_LABELS: Record<FinishType, string> = {
  mate: "Mate",
  semimate: "Semimate",
  satinado: "Satinado",
  alto_brillo: "Alto Brillo",
};
