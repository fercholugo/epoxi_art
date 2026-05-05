import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Services from "@/components/sections/Services";
import Process from "@/components/sections/Process";

export const metadata: Metadata = {
  title: "Servicios",
  description:
    "Pisos residenciales, comerciales, paredes decorativas, acabados especiales y más en resina epóxica.",
};

export default function ServiciosPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="pt-16">
        <Services />
        <Process />
      </main>
      <Footer />
    </>
  );
}
