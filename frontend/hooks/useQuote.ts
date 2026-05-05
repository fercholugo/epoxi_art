"use client";

import { useState, useCallback } from "react";
import { calcPrice, formatCurrency } from "@/lib/utils";
import type { SurfaceType, FinishType, QuoteResponse } from "@/types";
import { api } from "@/lib/api";

interface QuoteState {
  surface: SurfaceType;
  area: number;
  finish: FinishType;
}

interface UseQuoteReturn {
  state: QuoteState;
  price: number;
  formattedPrice: string;
  setSurface: (s: SurfaceType) => void;
  setArea: (a: number) => void;
  setFinish: (f: FinishType) => void;
  submitQuote: (data: Record<string, unknown>) => Promise<QuoteResponse>;
  isSubmitting: boolean;
  error: string | null;
}

export function useQuote(): UseQuoteReturn {
  const [state, setState] = useState<QuoteState>({
    surface: "piso_residencial",
    area: 50,
    finish: "mate",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const price = calcPrice(state.surface, state.area, state.finish);
  const formattedPrice = formatCurrency(price);

  const setSurface = useCallback((surface: SurfaceType) => {
    setState((prev) => ({ ...prev, surface }));
  }, []);

  const setArea = useCallback((area: number) => {
    setState((prev) => ({ ...prev, area }));
  }, []);

  const setFinish = useCallback((finish: FinishType) => {
    setState((prev) => ({ ...prev, finish }));
  }, []);

  const submitQuote = useCallback(
    async (data: Record<string, unknown>): Promise<QuoteResponse> => {
      setIsSubmitting(true);
      setError(null);
      try {
        const response = await api.post<QuoteResponse>("/api/v1/quotes", {
          ...data,
          precioEstimado: price,
        });
        return response;
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Error al enviar";
        setError(msg);
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    [price]
  );

  return {
    state,
    price,
    formattedPrice,
    setSurface,
    setArea,
    setFinish,
    submitQuote,
    isSubmitting,
    error,
  };
}
