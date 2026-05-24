"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";

const FORMULAS = [
  "iℏ ∂ψ/∂t = Ĥψ",
  "Δx · Δp ≥ ℏ/2",
  "E = ℏω",
  "λ = h/p",
  "S = k ln Ω",
  "Rμν − ½gμνR = 8πG/c⁴ · Tμν",
  "e^(iπ) + 1 = 0",
  "∇ × E = −∂B/∂t",
];

export default function PhysicsTicker({ className = "" }: { className?: string }) {
  const line = useMemo(() => FORMULAS.join("    ◆    "), []);

  return (
    <div
      className={`overflow-hidden border-t border-[var(--q-violet-dim)] bg-black/40 ${className}`}
      aria-hidden
    >
      <motion.div
        className="q-formula whitespace-nowrap py-2 px-4 flex"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 48, repeat: Infinity, ease: "linear" }}
      >
        <span>{line}</span>
        <span className="ml-16">{line}</span>
      </motion.div>
    </div>
  );
}
