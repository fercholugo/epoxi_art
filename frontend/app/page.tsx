import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import Services from "@/components/sections/Services";
import Process from "@/components/sections/Process";
import QuoteForm from "@/components/sections/QuoteForm";
import Testimonials from "@/components/sections/Testimonials";
import FAQ from "@/components/sections/FAQ";
import AnimatedBackground from "@/components/ui/AnimatedBackground";

export default function Home() {
  return (
    <>
      <AnimatedBackground />
      <div className="relative" style={{ zIndex: 1 }}>
        <Navbar />
        <main id="main-content">
          <Hero />
          <Services />
          <Process />
          <Testimonials />
          <QuoteForm />
          <FAQ />
        </main>
        <Footer />
      </div>
    </>
  );
}
