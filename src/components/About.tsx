"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

export default function About() {
  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  }), []);

  const titleVariants = useMemo(() => ({
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, delay: 0.2 } }
  }), []);

  return (
    <motion.section 
      className="mb-16 relative w-full"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="flex items-center gap-4 mb-6" variants={titleVariants}>
        <div className="q-section-rule w-8" />
        <h2 className="q-section-label">[ Identity_Matrix ]</h2>
      </motion.div>

      <p className="q-formula mb-4 pl-12">dim(H) → ∞ · observer: ℏarnitya</p>

      <div className="relative group">
        <motion.div 
          className="q-panel p-6 md:p-8 overflow-hidden"
          whileHover={{ boxShadow: "0 0 24px rgba(123, 110, 246, 0.12)" }}
        >
          {/* Subtle Scanline Overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-20" 
               style={{ background: 'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.5) 50%)', backgroundSize: '100% 4px' }} />
               
          {/* Corner Brackets */}
          <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-[var(--q-violet)]/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-[var(--q-violet)]/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-[var(--q-violet)]/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-[var(--q-violet)]/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Glitch decoration */}
          <div className="absolute top-4 right-4 text-zinc-800 text-[10px] font-mono tracking-widest pointer-events-none hidden md:block">
            SYS.ABOUT.OK
          </div>

          <div className="relative z-10 text-zinc-300 leading-relaxed tracking-wide font-mono max-w-3xl text-sm md:text-base">
            <p className="mb-4">
              <span className="text-[var(--q-cyan)] font-mono mr-2">&gt;</span>
              Not here to just consume—here to dissect, understand, and evolve. I blend logic with depth, viewing code not just as instructions, but as architecture for better futures. 
            </p>
            <p>
              <span className="text-[var(--q-cyan)] font-mono mr-2">&gt;</span>
              My focus spans the stack from web development and machine learning tooling to systems architecture and the theoretical edges of logic. I build things that scale, make sense, and look incredible.
            </p>
          </div>
          
          {/* Animated cursor block */}
          <motion.div 
            className="w-2.5 h-4 bg-[var(--q-lime)] inline-block mt-4 opacity-80"
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>
      </div>
    </motion.section>
  );
}