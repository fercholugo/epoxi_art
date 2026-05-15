"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type Currency = "USD" | "COP";
const RATE = 4200;

interface CurrencyCtx {
  currency: Currency;
  toggle: () => void;
  formatPrice: (usd: number) => string;
}

const CurrencyContext = createContext<CurrencyCtx>({
  currency: "USD",
  toggle: () => {},
  formatPrice: (usd) => `US$ ${usd}`,
});

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>("USD");

  const toggle = () => setCurrency((c) => (c === "USD" ? "COP" : "USD"));

  const formatPrice = (usd: number) => {
    if (currency === "COP") {
      const cop = Math.round(usd * RATE);
      return `$ ${cop.toLocaleString("es-CO")} COP`;
    }
    return `US$ ${Number(usd).toLocaleString("es-CO", { minimumFractionDigits: 0 })}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, toggle, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export const useCurrency = () => useContext(CurrencyContext);
