"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Servicios", href: "#servicios", isPage: false },
  { label: "Diseño IA", href: "#ia", isPage: false },
  { label: "Galería", href: "#galeria", isPage: false },
  { label: "Tienda", href: "/tienda", isPage: true },
  { label: "Cotizar", href: "#cotizar", isPage: false },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-40 transition-all duration-300",
        scrolled
          ? "bg-dark/90 backdrop-blur-md border-b border-dark-3 shadow-lg"
          : "bg-transparent"
      )}
    >
      <nav
        className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between"
        aria-label="Navegación principal"
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 group"
          aria-label="EpoxyArt - Inicio"
        >
          <div className="w-8 h-8 rounded-lg bg-gold flex items-center justify-center">
            <span className="text-dark font-bold text-sm">EA</span>
          </div>
          <span className="font-display font-bold text-light tracking-wider group-hover:text-gold transition-colors">
            EPOXYART
          </span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-8" role="list">
          {NAV_LINKS.map((link) => {
            const href = link.isPage ? link.href : (isHome ? link.href : `/${link.href}`);
            return (
              <li key={link.href}>
                {link.isPage ? (
                  <Link
                    href={href}
                    className="text-muted hover:text-light text-sm font-medium transition-colors relative group"
                  >
                    {link.label}
                    <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-gold group-hover:w-full transition-all duration-300" />
                  </Link>
                ) : (
                  <a
                    href={href}
                    className="text-muted hover:text-light text-sm font-medium transition-colors relative group"
                  >
                    {link.label}
                    <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-gold group-hover:w-full transition-all duration-300" />
                  </a>
                )}
              </li>
            );
          })}
        </ul>

        {/* CTA + Mobile toggle */}
        <div className="flex items-center gap-4">
          <a
            href={isHome ? "#cotizar" : "/#cotizar"}
            className="hidden md:inline-flex items-center px-5 py-2 rounded-xl bg-gold text-dark font-semibold text-sm hover:bg-gold-light transition-colors shadow-[0_0_15px_rgba(201,168,76,0.3)]"
          >
            COTIZAR AHORA
          </a>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="md:hidden w-9 h-9 flex flex-col items-center justify-center gap-1.5 rounded-lg hover:bg-dark-3 transition-colors"
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={menuOpen}
          >
            <span
              className={cn(
                "block w-5 h-0.5 bg-light transition-all origin-center",
                menuOpen && "rotate-45 translate-y-2"
              )}
            />
            <span
              className={cn(
                "block w-5 h-0.5 bg-light transition-all",
                menuOpen && "opacity-0"
              )}
            />
            <span
              className={cn(
                "block w-5 h-0.5 bg-light transition-all origin-center",
                menuOpen && "-rotate-45 -translate-y-2"
              )}
            />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-dark-2 border-b border-dark-3 overflow-hidden"
          >
            <ul className="px-6 py-4 flex flex-col gap-4" role="list">
              {NAV_LINKS.map((link) => {
                const href = link.isPage ? link.href : (isHome ? link.href : `/${link.href}`);
                return (
                  <li key={link.href}>
                    {link.isPage ? (
                      <Link
                        href={href}
                        className="text-muted hover:text-light font-medium transition-colors block py-1"
                        onClick={() => setMenuOpen(false)}
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={href}
                        className="text-muted hover:text-light font-medium transition-colors block py-1"
                        onClick={() => setMenuOpen(false)}
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                );
              })}
              <li>
                <a
                  href={isHome ? "#cotizar" : "/#cotizar"}
                  className="inline-flex items-center px-5 py-2.5 rounded-xl bg-gold text-dark font-semibold text-sm hover:bg-gold-light transition-colors mt-2"
                  onClick={() => setMenuOpen(false)}
                >
                  COTIZAR AHORA
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
