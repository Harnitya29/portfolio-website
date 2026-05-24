"use client";

import { useEffect, useRef } from "react";

/** Animated |ψ|²-style probability rings over the map */
export default function ProbabilityCloud({
  className = "",
  active = true,
}: {
  className?: string;
  active?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !active) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = parent.clientWidth * dpr;
      canvas.height = parent.clientHeight * dpr;
      canvas.style.width = `${parent.clientWidth}px`;
      canvas.style.height = `${parent.clientHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement!);

    let t = 0;
    const draw = () => {
      const w = canvas.width / (window.devicePixelRatio || 1);
      const h = canvas.height / (window.devicePixelRatio || 1);
      ctx.clearRect(0, 0, w, h);

      const cx = w * 0.5;
      const cy = h * 0.52;
      const rings = reduced ? 2 : 5;

      for (let i = 0; i < rings; i++) {
        const phase = t * 0.001 + i * 0.9;
        const baseR = 28 + i * 22;
        const pulse = reduced ? 0 : Math.sin(phase) * 6;
        const r = baseR + pulse;
        const alpha = (0.22 - i * 0.035) * (0.85 + 0.15 * Math.sin(phase * 1.3));

        const grad = ctx.createRadialGradient(cx, cy, r * 0.2, cx, cy, r);
        grad.addColorStop(0, `rgba(123, 110, 246, ${alpha * 0.5})`);
        grad.addColorStop(0.5, `rgba(94, 234, 212, ${alpha * 0.25})`);
        grad.addColorStop(1, "rgba(123, 110, 246, 0)");

        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(123, 110, 246, ${alpha * 0.6})`;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.fillStyle = grad;
        ctx.fill();
      }

      // Crosshair interference fringes
      ctx.strokeStyle = "rgba(94, 234, 212, 0.08)";
      ctx.lineWidth = 1;
      for (let a = 0; a < 8; a++) {
        const angle = (a / 8) * Math.PI * 2 + t * 0.0003;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(angle) * 140, cy + Math.sin(angle) * 140);
        ctx.stroke();
      }

      t += 16;
      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      ro.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 z-[15] ${className}`}
      aria-hidden
    />
  );
}
