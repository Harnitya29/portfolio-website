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
        className="text-2xl font-bold text-white mb-6 relative inline-flex items-center gap-2"
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
        <div className="rounded-xl border border-zinc-800/50 bg-zinc-900/30 p-4 transition-colors hover:border-zinc-700">
          <div className="flex items-center gap-2 mb-2">
            <RiCodeBoxLine size={18} className="text-zinc-400" />
            <span className="text-xs font-mono text-zinc-500">[ARCHITECTURE]</span>
          </div>
          <h3 className="text-sm font-medium text-zinc-200 mb-1">Systems Thinking</h3>
          <p className="text-xs text-zinc-400">Focusing on interconnections rather than isolated parts.</p>
        </div>

        {/* Item 2 */}
        <div className="rounded-xl border border-zinc-800/50 bg-zinc-900/30 p-4 transition-colors hover:border-zinc-700">
          <div className="flex items-center gap-2 mb-2">
            <RiBookLine size={18} className="text-zinc-400" />
            <span className="text-xs font-mono text-zinc-500">[ASTROPHYSICS]</span>
          </div>
          <h3 className="text-sm font-medium text-zinc-200 mb-1">Cosmos</h3>
          <p className="text-xs text-zinc-400">We are a way for the cosmos to know itself.</p>
        </div>
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
