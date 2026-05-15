"use client";

import { useEffect, useRef } from "react";

const BLOBS = [
  { rx: 0.15, ry: 0.35, radius: 360, vx: 0.18, vy: 0.12, color: "#c9a84c", alpha: 0.22 },
  { rx: 0.78, ry: 0.55, radius: 420, vx: -0.13, vy: 0.15, color: "#3d8c6e", alpha: 0.16 },
  { rx: 0.48, ry: 0.12, radius: 300, vx: 0.10, vy: -0.14, color: "#c9a84c", alpha: 0.14 },
  { rx: 0.88, ry: 0.28, radius: 280, vx: -0.20, vy: 0.09, color: "#8b6914", alpha: 0.19 },
  { rx: 0.08, ry: 0.72, radius: 380, vx: 0.14, vy: -0.11, color: "#56bf97", alpha: 0.12 },
  { rx: 0.62, ry: 0.82, radius: 320, vx: -0.16, vy: 0.12, color: "#c9a84c", alpha: 0.17 },
];

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const blobs = BLOBS.map((b) => ({
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
        if (blob.x - blob.radius < 0 || blob.x + blob.radius > canvas.width) blob.vx *= -1;
        if (blob.y - blob.radius < 0 || blob.y + blob.radius > canvas.height) blob.vy *= -1;
        const hex2 = Math.round(blob.alpha * 255).toString(16).padStart(2, "0");
        const grad = ctx.createRadialGradient(blob.x, blob.y, 0, blob.x, blob.y, blob.radius);
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
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  );
}
