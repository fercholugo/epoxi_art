import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import QuoteForm from "@/components/sections/QuoteForm";

export const metadata: Metadata = {
  title: "Cotizar",
  description:
    "Obtén un presupuesto instantáneo para tu proyecto de resina epóxica. Sin compromiso.",
};

export default function CotizarPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="pt-16">
        <QuoteForm />
      </main>
      <Footer />
    </>
  );
}
