"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";

interface Blob {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  color: string;
  alpha: number;
}

const BLOBS_CONFIG = [
  { rx: 0.2, ry: 0.4, radius: 220, vx: 0.28, vy: 0.18, color: "#c9a84c", alpha: 0.14 },
  { rx: 0.75, ry: 0.6, radius: 260, vx: -0.2, vy: 0.24, color: "#3d8c6e", alpha: 0.09 },
  { rx: 0.5, ry: 0.15, radius: 190, vx: 0.16, vy: -0.22, color: "#c9a84c", alpha: 0.07 },
  { rx: 0.88, ry: 0.3, radius: 170, vx: -0.32, vy: 0.14, color: "#8b6914", alpha: 0.11 },
  { rx: 0.08, ry: 0.75, radius: 230, vx: 0.22, vy: -0.18, color: "#56bf97", alpha: 0.06 },
];

const STATS = [
  { value: "+350", label: "Proyectos" },
  { value: "8+", label: "Años de Experiencia" },
  { value: "100%", label: "Garantía" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: "easeOut" },
  }),
};

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const blobs: Blob[] = BLOBS_CONFIG.map((b) => ({
      x: b.rx * canvas.width,
      y: b.ry * canvas.height,
      radius: b.radius,
      vx: b.vx,
      vy: b.vy,
      color: b.color,
      alpha: b.alpha,
    }));

    let animId: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const blob of blobs) {
        blob.x += blob.vx;
        blob.y += blob.vy;
        if (blob.x - blob.radius < 0 || blob.x + blob.radius > canvas.width) {
          blob.vx *= -1;
        }
        if (blob.y - blob.radius < 0 || blob.y + blob.radius > canvas.height) {
          blob.vy *= -1;
        }
        const hex2 = Math.round(blob.alpha * 255).toString(16).padStart(2, "0");
        const grad = ctx.createRadialGradient(
          blob.x, blob.y, 0,
          blob.x, blob.y, blob.radius
        );
        grad.addColorStop(0, `${blob.color}${hex2}`);
        grad.addColorStop(1, `${blob.color}00`);
        ctx.beginPath();
        ctx.arc(blob.x, blob.y, blob.radius, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }, []);

  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center overflow-hidden bg-dark"
      aria-label="Sección principal"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        aria-hidden="true"
      />
      {/* Noise overlay for texture */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-16 w-full">
        <div className="max-w-3xl">
          {/* Badge */}
          <motion.span
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0.1}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gold/30 bg-gold/10 text-gold text-sm font-medium mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-gold animate-pulse-gold" aria-hidden="true" />
            Resina Epóxica Premium
          </motion.span>

          {/* H1 */}
          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0.2}
            className="text-5xl sm:text-6xl md:text-7xl font-display font-bold text-light leading-[1.1] mb-6 text-balance"
          >
            Transforma tus Espacios con{" "}
            <span className="gold-gradient">Arte Líquido</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0.3}
            className="text-lg text-muted max-w-xl mb-8 leading-relaxed"
          >
            Pisos y paredes decorativas en resina epóxica de alta resistencia.
            Diseños únicos personalizados con inteligencia artificial para cada
            espacio.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0.4}
            className="flex flex-col sm:flex-row gap-4 mb-16"
          >
            <Button href="#ia" variant="primary" size="lg">
              ✦ Probar Diseño con IA
            </Button>
            <Button href="#cotizar" variant="outline" size="lg">
              Solicitar Cotización
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0.55}
            className="flex flex-wrap gap-10"
          >
            {STATS.map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl font-bold text-gold">{stat.value}</div>
                <div className="text-sm text-muted mt-0.5">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-dark to-transparent"
        aria-hidden="true"
      />
    </section>
  );
}
