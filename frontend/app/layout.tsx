import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import Providers from "@/components/providers/Providers";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://epoxyart.up.railway.app";

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
  metadataBase: new URL(siteUrl),
  title: {
    default: "EpoxyArt — Decoración en Resina Epóxica",
    template: "%s | EpoxyArt",
  },
  description:
    "Transforma tus espacios con arte líquido. Pisos y paredes en resina epóxica con diseño personalizado. +100 proyectos · 5 años de experiencia · Garantía 5 años.",
  keywords: [
    "resina epoxica",
    "pisos epoxicos",
    "decoracion pisos",
    "piso epóxico",
    "paredes decorativas",
    "resina decorativa",
    "diseño de interiores",
    "piso resina Colombia",
    "arte en resina",
  ],
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: siteUrl,
    siteName: "EpoxyArt",
    title: "EpoxyArt — Decoración en Resina Epóxica Premium",
    description:
      "Transforma tus espacios con arte líquido. Pisos y paredes en resina epóxica con diseño personalizado. Cotiza gratis.",
  },
  twitter: {
    card: "summary_large_image",
    title: "EpoxyArt — Decoración en Resina Epóxica Premium",
    description:
      "Transforma tus espacios con arte líquido. Cotiza gratis tu proyecto.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
  alternates: {
    canonical: siteUrl,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "EpoxyArt",
  description:
    "Decoración en resina epóxica para pisos y paredes. Diseños personalizados con acabados premium.",
  url: siteUrl,
  telephone: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER
    ? `+${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`
    : undefined,
  priceRange: "$$",
  areaServed: "Colombia",
  serviceType: [
    "Pisos en resina epóxica",
    "Paredes decorativas en resina",
    "Acabados especiales epóxicos",
    "Pisos comerciales epóxicos",
  ],
  sameAs: [
    process.env.NEXT_PUBLIC_INSTAGRAM_URL,
    process.env.NEXT_PUBLIC_FACEBOOK_URL,
  ].filter(Boolean),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans antialiased bg-dark text-light">
        <Providers>{children}</Providers>
      </body>
      {process.env.NEXT_PUBLIC_GA_ID && (
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
      )}
    </html>
  );
}
