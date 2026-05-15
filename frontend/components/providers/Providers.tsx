"use client";

import { CurrencyProvider } from "@/contexts/currency";
import { ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  return <CurrencyProvider>{children}</CurrencyProvider>;
}
