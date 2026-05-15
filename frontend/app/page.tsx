import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import Services from "@/components/sections/Services";
import Process from "@/components/sections/Process";
import QuoteForm from "@/components/sections/QuoteForm";
import Gallery from "@/components/sections/Gallery";
import Testimonials from "@/components/sections/Testimonials";
import FAQ from "@/components/sections/FAQ";

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main-content">
        <Hero />
        <Services />
        <Process />
        <Gallery />
        <Testimonials />
        <QuoteForm />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
