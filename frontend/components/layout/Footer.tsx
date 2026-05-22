import Link from "next/link";

const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "573001234567";
const INSTAGRAM = process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? "https://instagram.com/epoxyart";

const footerLinks = [
  { label: "Servicios", href: "#servicios" },
  { label: "Tienda", href: "/tienda" },
  { label: "Cotizar", href: "#cotizar" },
  { label: "Preguntas Frecuentes", href: "#faq" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-dark-2 border-t border-dark-3" role="contentinfo">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gold flex items-center justify-center">
                <span className="text-dark font-bold text-sm">EA</span>
              </div>
              <span className="font-display font-bold text-light tracking-wider text-lg">
                EPOXYART
              </span>
            </div>
            <p className="text-muted text-sm leading-relaxed">
              Transformamos pisos y paredes en obras de arte duraderas con
              resina epóxica premium. Diseño personalizado con inteligencia
              artificial.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-light font-semibold mb-4 text-sm uppercase tracking-wider">
              Navegación
            </h3>
            <ul className="flex flex-col gap-2" role="list">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-muted hover:text-gold text-sm transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Socials */}
          <div>
            <h3 className="text-light font-semibold mb-4 text-sm uppercase tracking-wider">
              Contacto
            </h3>
            <div className="flex flex-col gap-3 mb-6">
              <a
                href={`https://wa.me/${WHATSAPP}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-muted hover:text-gold text-sm transition-colors group"
                aria-label="Contactar por WhatsApp"
              >
                <span className="w-8 h-8 rounded-lg bg-dark-3 flex items-center justify-center group-hover:bg-gold/10 transition-colors">
                  💬
                </span>
                WhatsApp
              </a>
              <a
                href={INSTAGRAM}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-muted hover:text-gold text-sm transition-colors group"
                aria-label="Ver Instagram de EpoxyArt"
              >
                <span className="w-8 h-8 rounded-lg bg-dark-3 flex items-center justify-center group-hover:bg-gold/10 transition-colors">
                  📸
                </span>
                Instagram
              </a>
              <a
                href="mailto:contacto@epoxyart.co"
                className="flex items-center gap-3 text-muted hover:text-gold text-sm transition-colors group"
                aria-label="Enviar email a EpoxyArt"
              >
                <span className="w-8 h-8 rounded-lg bg-dark-3 flex items-center justify-center group-hover:bg-gold/10 transition-colors">
                  ✉️
                </span>
                contacto@epoxyart.co
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-dark-3 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-muted text-sm">
            © {year} EpoxyArt. Todos los derechos reservados.
          </p>
          <p className="text-muted text-xs">
            Diseñado con IA · Stack 100% Open Source
          </p>
        </div>
      </div>
    </footer>
  );
}
