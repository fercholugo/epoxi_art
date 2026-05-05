import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "EpoxyArt — Decoración en Resina Epóxica",
    template: "%s | EpoxyArt",
  },
  description:
    "Transforma tus espacios con arte líquido. Pisos y paredes en resina epóxica con diseño personalizado por IA. +350 proyectos · 8 años de experiencia · Garantía 5 años.",
  keywords: [
    "resina epoxica",
    "pisos epoxicos",
    "decoracion pisos",
    "piso epóxico",
    "paredes decorativas",
    "resina decorativa",
    "diseño de interiores",
  ],
  openGraph: {
    type: "website",
    locale: "es_CO",
    siteName: "EpoxyArt",
    title: "EpoxyArt — Decoración en Resina Epóxica Premium",
    description:
      "Transforma tus espacios con arte líquido. Pisos y paredes en resina epóxica con diseño por IA.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased bg-dark text-light">
        {children}
      </body>
    </html>
  );
}
