"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SkillNode {
  id: string;
  name: string;
  color: string;
  category: string;
  depth: string;
  projects: string[];
}

const ORBITS = [
  {
    radius: 100,
    duration: 20,
    items: [
      { id: "python", name: "Python", color: "#3776ab", category: "Core", depth: "Advanced", projects: ["DataVerse", "NeuralNet Dashboard", "Sentinel.sh"] },
      { id: "rust", name: "Rust", color: "#dea584", category: "Core", depth: "Intermediate", projects: ["Quantum State Visualizer (WASM)"] },
      { id: "typescript", name: "TypeScript", color: "#3178c6", category: "Core", depth: "Advanced", projects: ["Cosmic Portfolio", "Quantum State Visualizer"] }
    ]
  },
  {
    radius: 180,
    duration: 35,
    items: [
      { id: "ml", name: "ML/LLM Tooling", color: "#f87171", category: "Domain", depth: "Advanced", projects: ["DataVerse", "NeuralNet Dashboard"] },
      { id: "sys", name: "Systems Architecture", color: "#60a5fa", category: "Domain", depth: "Intermediate", projects: ["Sentinel.sh", "Project Entropy"] },
      { id: "web", name: "Web", color: "#a78bfa", category: "Domain", depth: "Advanced", projects: ["Cosmic Portfolio", "Personal Knowledge Base"] }
    ]
  },
  {
    radius: 260,
    duration: 50,
    items: [
      { id: "docker", name: "Docker", color: "#2496ed", category: "Infra", depth: "Intermediate", projects: ["Project Entropy", "DataVerse"] },
      { id: "postgres", name: "PostgreSQL", color: "#336791", category: "Infra", depth: "Advanced", projects: ["DataVerse", "Project Entropy"] },
      { id: "git", name: "Git", color: "#f05032", category: "Infra", depth: "Advanced", projects: ["All Projects"] },
      { id: "linux", name: "Linux", color: "#fcc624", category: "Infra", depth: "Advanced", projects: ["Sentinel.sh", "Server Deployments"] }
    ]
  }
];

export default function SkillsSection() {
  const [activeSkill, setActiveSkill] = useState<SkillNode | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return <div className="h-screen w-full" />;

  return (
    <div className="relative w-full py-32 flex flex-col items-center overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h2 className="q-section-label mb-2 text-[var(--q-lime)]">
          [ Technological Arsenal ]
        </h2>
        <p className="text-zinc-500 font-mono text-xs max-w-md mx-auto">
          Interactive orbital mapping of core competencies and domain expertise.
        </p>
      </motion.div>

      <div className="relative w-full max-w-4xl h-[600px] flex items-center justify-center">
        {/* Orbital Rings */}
        {ORBITS.map((orbit, orbitIndex) => (
          <div
            key={`orbit-ring-${orbitIndex}`}
            className="absolute rounded-full border border-zinc-800/50"
            style={{
              width: orbit.radius * 2,
              height: orbit.radius * 2,
            }}
          />
        ))}

        {/* The Planets / Nodes */}
        {ORBITS.map((orbit, orbitIndex) => (
          <motion.div
            key={`orbit-container-${orbitIndex}`}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            animate={activeSkill ? { rotate: 0 } : { rotate: 360 }}
            transition={{
              duration: orbit.duration,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            {orbit.items.map((item, itemIndex) => {
              const angle = (itemIndex / orbit.items.length) * Math.PI * 2;
              const x = Math.cos(angle) * orbit.radius;
              const y = Math.sin(angle) * orbit.radius;

              return (
                <motion.div
                  key={item.id}
                  className="absolute flex items-center justify-center pointer-events-auto cursor-pointer group"
                  style={{ x, y }}
                  // Counter-rotate so the text/icon stays upright
                  animate={activeSkill ? { rotate: 0 } : { rotate: -360 }}
                  transition={{
                    duration: orbit.duration,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  whileHover={{ scale: 1.2 }}
                  onClick={() => setActiveSkill(activeSkill?.id === item.id ? null : item)}
                >
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300"
                    style={{ 
                      backgroundColor: `${item.color}20`,
                      border: `1px solid ${item.color}`,
                      color: item.color,
                      boxShadow: activeSkill?.id === item.id ? `0 0 20px ${item.color}80` : `0 0 0px ${item.color}00`
                    }}
                  >
                    {item.name.charAt(0)}
                  </div>
                  
                  {/* Tooltip on hover */}
                  <div className="absolute top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-black/90 border border-zinc-800 px-3 py-1.5 rounded whitespace-nowrap text-xs font-mono z-50">
                    <span style={{ color: item.color }}>{item.name}</span>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        ))}

        {/* Center Node (hbar) */}
        <div className="absolute flex items-center justify-center z-10">
          <motion.div
            className="w-16 h-16 rounded-full bg-zinc-950 border border-violet-500/30 flex items-center justify-center text-2xl font-serif text-violet-400 cursor-pointer"
            animate={{
              boxShadow: ["0 0 10px rgba(74, 222, 128, 0.2)", "0 0 30px rgba(74, 222, 128, 0.4)", "0 0 10px rgba(74, 222, 128, 0.2)"]
            }}
            transition={{ duration: 3, repeat: Infinity }}
            onClick={() => setActiveSkill(null)}
          >
            ℏ
          </motion.div>
        </div>

        {/* Info Panel when clicked */}
        <AnimatePresence>
          {activeSkill && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="absolute z-50 p-6 bg-zinc-950/90 backdrop-blur-md border rounded-xl shadow-2xl max-w-sm w-full"
              style={{ borderColor: `${activeSkill.color}40` }}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold font-mono" style={{ color: activeSkill.color }}>
                  {activeSkill.name}
                </h3>
                <button 
                  onClick={() => setActiveSkill(null)}
                  className="text-zinc-500 hover:text-white"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="text-[10px] text-zinc-500 font-mono mb-1 uppercase tracking-wider">Depth</div>
                  <div className="text-sm text-zinc-200">{activeSkill.depth}</div>
                </div>
                
                <div>
                  <div className="text-[10px] text-zinc-500 font-mono mb-1 uppercase tracking-wider">Category</div>
                  <div className="text-sm text-zinc-200">{activeSkill.category}</div>
                </div>
                
                <div>
                  <div className="text-[10px] text-zinc-500 font-mono mb-1 uppercase tracking-wider">Associated Projects</div>
                  <ul className="list-none space-y-1 mt-2">
                    {activeSkill.projects.map((proj, i) => (
                      <li key={i} className="text-xs text-zinc-300 flex items-center">
                        <span className="w-1 h-1 rounded-full mr-2" style={{ backgroundColor: activeSkill.color }} />
                        {proj}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}