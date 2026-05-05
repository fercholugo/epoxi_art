import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Gallery from "@/components/sections/Gallery";

export const metadata: Metadata = {
  title: "Galería de Proyectos",
  description:
    "Explora nuestro portafolio de pisos y paredes decorativas en resina epóxica.",
};

export default function GaleriaPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="pt-16">
        <Gallery />
      </main>
      <Footer />
    </>
  );
}
