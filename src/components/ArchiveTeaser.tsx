"use client";

import React from "react";
import { motion } from "framer-motion";
import { RiBookLine, RiCodeBoxLine, RiArrowRightLine } from "@remixicon/react";
import Link from "next/link";
import TransitionLink from "~/components/utils/TransitionLink";

export default function ArchiveTeaser() {
  return (
    <div className="mb-16 relative">
      <motion.h2 
        className="text-2xl font-sans font-bold text-white mb-6 relative inline-flex items-center gap-2"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <span className="text-green-300">&gt;</span>
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-green-200 to-white">
          the archive preview
        </span>
      </motion.h2>

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
      >
        {/* Item 1 */}
        <motion.div 
          className="rounded-xl border border-zinc-800/50 bg-zinc-900/30 p-4 transition-colors hover:border-green-500/30 relative overflow-hidden group"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="flex items-center gap-2 mb-2 relative z-10">
            <RiCodeBoxLine size={18} className="text-zinc-400 group-hover:text-green-400 transition-colors" />
            <span className="text-xs font-mono text-zinc-500">[ARCHITECTURE]</span>
          </div>
          <h3 className="text-base font-sans font-medium text-zinc-200 mb-1 relative z-10">Systems Thinking</h3>
          <p className="text-xs text-zinc-400 relative z-10">Focusing on interconnections rather than isolated parts.</p>
        </motion.div>

        {/* Item 2 */}
        <motion.div 
          className="rounded-xl border border-zinc-800/50 bg-zinc-900/30 p-4 transition-colors hover:border-green-500/30 relative overflow-hidden group"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="flex items-center gap-2 mb-2 relative z-10">
            <RiBookLine size={18} className="text-zinc-400 group-hover:text-green-400 transition-colors" />
            <span className="text-xs font-mono text-zinc-500">[ASTROPHYSICS]</span>
          </div>
          <h3 className="text-base font-sans font-medium text-zinc-200 mb-1 relative z-10">Cosmos</h3>
          <p className="text-xs text-zinc-400 relative z-10">We are a way for the cosmos to know itself.</p>
        </motion.div>
      </motion.div>

      <motion.div
        className="mt-6 flex justify-end"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
      >
        <TransitionLink 
          href="/archive"
          className="group flex items-center gap-2 text-sm font-medium text-green-300 hover:text-green-200 transition-colors"
        >
          ENTER THE GRAND ARCHIVE
          <RiArrowRightLine size={16} className="transform group-hover:translate-x-1 transition-transform" />
        </TransitionLink>
      </motion.div>
    </div>
  );
}
