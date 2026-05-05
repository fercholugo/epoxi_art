"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { getToken, clearToken } from "@/lib/admin-api";

const NAV = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "⬛" },
  { href: "/admin/cotizaciones", label: "Cotizaciones", icon: "📋" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (pathname === "/admin/login") {
      setReady(true);
      return;
    }
    if (!getToken()) {
      router.replace("/admin/login");
    } else {
      setReady(true);
    }
  }, [pathname, router]);

  if (!ready) return null;

  // Página de login no lleva sidebar
  if (pathname === "/admin/login") return <>{children}</>;

  const handleLogout = () => {
    clearToken();
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen bg-dark flex">
      {/* Sidebar */}
      <aside className="w-56 bg-dark-2 border-r border-dark-3 flex flex-col fixed inset-y-0 left-0 z-30">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-dark-3">
          <div className="text-xl font-black tracking-widest text-gold">
            EPOXY<span className="text-light">ART</span>
          </div>
          <p className="text-muted text-xs mt-0.5">Admin Panel</p>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map(({ href, label, icon }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  active
                    ? "bg-gold/10 text-gold border border-gold/20"
                    : "text-muted hover:text-light hover:bg-dark-3"
                }`}
              >
                <span className="text-base">{icon}</span>
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Footer sidebar */}
        <div className="px-3 py-4 border-t border-dark-3 space-y-2">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-muted hover:text-light hover:bg-dark-3 transition-colors"
          >
            <span>🌐</span> Ver sitio
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-muted hover:text-red-400 hover:bg-red-950/20 transition-colors text-left"
          >
            <span>🚪</span> Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-56 min-h-screen bg-dark">
        {children}
      </main>
    </div>
  );
}
