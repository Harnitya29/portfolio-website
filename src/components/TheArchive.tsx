"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RiBookLine, RiFilmLine, RiCodeBoxLine, RiArrowRightUpLine } from "@remixicon/react";

// Types
type Category = "ALL" | "BOOKS" | "CINEMA" | "SERIES" | "ARCHETYPES" | "MODELS";

interface ArchiveItem {
  id: string;
  title: string;
  category: Category;
  icon: React.ReactNode;
  tag: string;
  thesis: string;
  connection: string;
  application: string;
  nugget: string;
  tooltip: string;
}

// Data Array
const archiveData: ArchiveItem[] = [
  {
    id: "meditations",
    title: "Meditations - Marcus Aurelius",
    category: "BOOKS",
    icon: <RiBookLine size={20} className="text-zinc-400 group-hover:text-amber-100 transition-colors" />,
    tag: "[STOICISM]",
    thesis: "Internal control over external chaos.",
    connection: "Emotional resilience in deep work.",
    application: "Debugging under pressure; maintaining focus.",
    nugget: "You have power over your mind - not outside events.",
    tooltip: "Related: Stoicism, Focus, Marcus Aurelius."
  },
  {
    id: "cosmos",
    title: "Cosmos - Carl Sagan",
    category: "BOOKS",
    icon: <RiBookLine size={20} className="text-zinc-400 group-hover:text-blue-300 transition-colors" />,
    tag: "[ASTROPHYSICS]",
    thesis: "We are a way for the cosmos to know itself.",
    connection: "The scale of existence vs daily problems.",
    application: "First-principles thinking in science.",
    nugget: "Extraordinary claims require extraordinary evidence.",
    tooltip: "Related: Carl Sagan, Universe, Perspective."
  },
  {
    id: "six-easy-pieces",
    title: "Six Easy Pieces - Richard Feynman",
    category: "BOOKS",
    icon: <RiBookLine size={20} className="text-zinc-400 group-hover:text-amber-500 transition-colors" />,
    tag: "[PHYSICS]",
    thesis: "Fundamental mechanics of the physical world.",
    connection: "Mental models for how reality computes.",
    application: "Breaking down complex systems into primitives.",
    nugget: "Matter is made of atoms.",
    tooltip: "Related: Feynman, Quantum, Mechanics."
  },
  {
    id: "almanack-naval",
    title: "The Almanack of Naval Ravikant",
    category: "BOOKS",
    icon: <RiBookLine size={20} className="text-zinc-400 group-hover:text-emerald-300 transition-colors" />,
    tag: "[WEALTH/HAPPINESS]",
    thesis: "Wealth is having assets that earn while you sleep.",
    connection: "Leverage via code and media.",
    application: "Building asymmetric return systems.",
    nugget: "Play iterated games. All the returns in life come from compound interest.",
    tooltip: "Related: Leverage, Compound Interest, Tech."
  },
  {
    id: "interstellar",
    title: "Interstellar",
    category: "CINEMA",
    icon: <RiFilmLine size={20} className="text-zinc-400 group-hover:text-indigo-400 transition-colors" />,
    tag: "[RELATIVITY]",
    thesis: "Time dilation and gravity as constraints.",
    connection: "Fuels interest in Project ChronoSyn.",
    application: "Visualizing complex concepts through persistent logic.",
    nugget: "Love is the one thing that transcends time and space.",
    tooltip: "Related: Physics, Time-Series Databases, Entropy."
  },
  {
    id: "dark",
    title: "Dark",
    category: "SERIES",
    icon: <RiFilmLine size={20} className="text-zinc-400 group-hover:text-zinc-300 transition-colors" />,
    tag: "[DETERMINISM]",
    thesis: "The end is the beginning, and the beginning is the end.",
    connection: "Closed causal loops and recursive architecture.",
    application: "Understanding state machines and cyclic dependencies.",
    nugget: "What we know is a drop, what we don't know is an ocean.",
    tooltip: "Related: Time, Determinism, Recursion."
  },
  {
    id: "aot",
    title: "Attack on Titan",
    category: "ARCHETYPES",
    icon: <RiFilmLine size={20} className="text-zinc-400 group-hover:text-red-600 transition-colors" />,
    tag: "[WILLPOWER]",
    thesis: "The pursuit of freedom against deterministic walls.",
    connection: "Eren Yeager archetype: Relentless forward motion.",
    application: "Pushing through burnout and limitations.",
    nugget: "If you win, you live. If you lose, you die. If you don't fight, you can't win.",
    tooltip: "Related: Transformation, Struggle, Freedom."
  },
  {
    id: "berserk",
    title: "Berserk",
    category: "ARCHETYPES",
    icon: <RiFilmLine size={20} className="text-zinc-400 group-hover:text-orange-600 transition-colors" />,
    tag: "[STRUGGLE]",
    thesis: "Enduring seemingly impossible odds.",
    connection: "Guts archetype: The indomitable human spirit.",
    application: "Resilience in long-term engineering and life pursuits.",
    nugget: "He died doing what he wanted, no matter what, right? I bet he was happy.",
    tooltip: "Related: Endurance, Causality, Will."
  },
  {
    id: "nietzsche",
    title: "Nietzsche",
    category: "MODELS",
    icon: <RiCodeBoxLine size={20} className="text-zinc-400 group-hover:text-red-400 transition-colors" />,
    tag: "[META-PHYSICS]",
    thesis: "Self-overcoming and the Will to Power.",
    connection: "Mirrors the hacker/builder mindset to create rather than consume.",
    application: "Understanding underlying architectures to bypass dogma.",
    nugget: "He who has a why to live for can bear almost any how.",
    tooltip: "Related: Philosophy, Ubermensch, Ethics."
  },
  {
    id: "entropy",
    title: "Entropy",
    category: "MODELS",
    icon: <RiCodeBoxLine size={20} className="text-zinc-400 group-hover:text-purple-400 transition-colors" />,
    tag: "[THERMODYNAMICS]",
    thesis: "Systems naturally decline into disorder.",
    connection: "Software rots; code maintenance.",
    application: "Designing self-healing and robust architectures.",
    nugget: "Energy dispersion is the arrow of time.",
    tooltip: "Related: Information Theory, Physics, Time."
  },
  {
    id: "systems-thinking",
    title: "Systems Thinking",
    category: "MODELS",
    icon: <RiCodeBoxLine size={20} className="text-zinc-400 group-hover:text-cyan-400 transition-colors" />,
    tag: "[ARCHITECTURE]",
    thesis: "Focusing on interconnections rather than parts.",
    connection: "Full-stack development and devops.",
    application: "Identifying feedback loops and bottlenecks.",
    nugget: "You can't just do one thing; every action has side effects.",
    tooltip: "Related: Cybernetics, Complexity, Leverage Points."
  },
  {
    id: "time",
    title: "Time",
    category: "MODELS",
    icon: <RiCodeBoxLine size={20} className="text-zinc-400 group-hover:text-green-500 transition-colors" />,
    tag: "[PHYSICS/PERCEPTION]",
    thesis: "Time is relative, subjective, and the ultimate constraint.",
    connection: "Project ChronoSyn, asynchronous processing.",
    application: "Optimizing computation and personal efficiency.",
    nugget: "Time is the scarcest resource and unless it is managed nothing else can be managed.",
    tooltip: "Related: Relativity, ChronoSyn, Execution."
  }
];

export default function TheArchive() {
  const [activeCategory, setActiveCategory] = useState<Category>("ALL");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const categories: Category[] = ["ALL", "BOOKS", "CINEMA", "MODELS"];

  // Filter items
  const filteredData = useMemo(() => {
    if (activeCategory === "ALL") return archiveData;
    return archiveData.filter(item => item.category === activeCategory);
  }, [activeCategory]);

  return (
    <div id="tech-stack" className="mb-16 relative">
      <motion.h2 
        className="text-2xl font-bold text-white mb-2 relative inline-flex items-center gap-2"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <span className="text-green-300">&gt;</span>
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-green-200 to-white">
          the archive
        </span>
      </motion.h2>
      
      <motion.p 
        className="text-sm text-zinc-400 mb-8 max-w-xl"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
      >
        A digital brain mapping the mental models, literature, and media that shape my technical philosophy.
      </motion.p>

      {/* Filter Toggle */}
      <motion.div 
        className="flex gap-2 mb-8 bg-zinc-900/50 p-1 rounded-lg w-fit border border-zinc-800"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
      >
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setActiveCategory(cat);
              setExpandedId(null); // Reset expansion on filter
            }}
            className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${
              activeCategory === cat 
                ? "bg-zinc-800 text-green-300 shadow-sm" 
                : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50"
            }`}
          >
            {cat}
          </button>
        ))}
      </motion.div>

      {/* Data Fragments Grid */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        layout
      >
        <AnimatePresence mode="popLayout">
          {filteredData.map((item, i) => {
            const isExpanded = expandedId === item.id;
            
            return (
              <motion.div
                layout
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className={`relative group cursor-pointer ${
                  isExpanded ? "col-span-1 md:col-span-2 lg:col-span-3" : "col-span-1"
                }`}
                onClick={() => setExpandedId(isExpanded ? null : item.id)}
              >
                <motion.div 
                  className={`h-full rounded-xl border border-zinc-800/50 bg-zinc-900/30 backdrop-blur-sm overflow-hidden transition-colors hover:border-zinc-700 ${
                    isExpanded ? "bg-zinc-900/80 shadow-2xl border-green-900/30" : ""
                  }`}
                  layout
                >
                  {/* Top Bar / Header */}
                  <motion.div 
                    className="p-4 flex items-start gap-3 relative z-10"
                    layout
                  >
                    <div 
                      className="p-2 rounded-lg bg-zinc-800/50 text-zinc-100"
                    >
                      {item.icon}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-mono text-zinc-500 mb-1 block">
                          {item.tag}
                        </span>
                        
                        {/* Tooltip implementation via group-hover */}
                        {!isExpanded && (
                           <div className="group/tooltip relative">
                             <RiArrowRightUpLine className="text-zinc-600 hover:text-green-300 transition-colors w-4 h-4" />
                             <div className="absolute opacity-0 group-hover/tooltip:opacity-100 transition-opacity bg-zinc-800 text-xs px-2 py-1 rounded border border-zinc-700 text-zinc-300 right-0 top-6 w-max max-w-[200px] pointer-events-none z-50">
                               {item.tooltip}
                             </div>
                           </div>
                        )}
                        {isExpanded && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedId(null);
                            }}
                            className="p-2 rounded-full hover:bg-zinc-800 transition-colors"
                          >
                            <RiArrowRightUpLine size={20} className="text-zinc-500 hover:text-green-300 transform rotate-180" />
                          </button>
                        )}
                      </div>
                      <h3 className="text-sm font-medium text-zinc-200">
                        {item.title}
                      </h3>
                    </div>
                  </motion.div>

                  {/* Expanded Content "Quick 4" */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="px-4 pb-4 overflow-hidden"
                      >
                        <div className="pt-2 border-t border-zinc-800/50 space-y-3 mt-2">
                          <div>
                            <span className="text-xs font-medium text-green-300/80 uppercase tracking-wider block mb-0.5">Thesis</span>
                            <p className="text-sm text-zinc-300">{item.thesis}</p>
                          </div>
                          
                          <div>
                            <span className="text-xs font-medium text-green-300/80 uppercase tracking-wider block mb-0.5">Connection</span>
                            <p className="text-sm text-zinc-300">{item.connection}</p>
                          </div>
                          
                          <div>
                            <span className="text-xs font-medium text-green-300/80 uppercase tracking-wider block mb-0.5">Application</span>
                            <p className="text-sm text-zinc-300">{item.application}</p>
                          </div>
                          
                          <div className="bg-zinc-800/30 p-3 rounded-lg border border-zinc-700/50 mt-4">
                            <span className="text-xs font-medium text-green-300/80 uppercase tracking-wider block mb-1">The Nugget</span>
                            <p className="text-sm text-zinc-200 italic">"{item.nugget}"</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Cosmic Accent Line */}
                  <div 
                    className="absolute top-0 left-0 w-full h-[1px] opacity-20 transition-opacity group-hover:opacity-100 bg-gradient-to-r from-transparent via-green-400 to-transparent"
                  />
                </motion.div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
