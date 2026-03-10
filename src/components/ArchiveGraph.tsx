"use client";

import React, { useRef, useEffect, useState, useMemo, useCallback } from "react";
import dynamic from "next/dynamic";

// ForceGraph2D requires window object, so we must dynamically import with ssr: false
const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), { ssr: false });

type Category = "ALL" | "BOOKS" | "CINEMA" | "ARCHETYPES" | "MODELS";

interface ArchiveItem {
  id: string;
  title: string;
  category: Category;
  tag: string;
}

interface ArchiveGraphProps {
  data: ArchiveItem[];
  onNodeClick: (item: ArchiveItem) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  BOOKS: "#fcd34d", // amber-300
  CINEMA: "#818cf8", // indigo-400
  ARCHETYPES: "#ef4444", // red-500
  MODELS: "#22d3ee", // cyan-400
};

// Explicit linkages between the 12 core items based on thematic depth
const LINKS = [
  // Philosophy & Self-Mastery
  { source: "meditations", target: "almanack-naval", value: 1 },
  { source: "meditations", target: "nietzsche", value: 2 },
  { source: "nietzsche", target: "berserk", value: 2 },
  { source: "nietzsche", target: "aot", value: 2 },
  
  // Physics & Scale
  { source: "cosmos", target: "six-easy-pieces", value: 2 },
  { source: "cosmos", target: "interstellar", value: 2 },
  { source: "six-easy-pieces", target: "entropy", value: 2 },
  
  // Time & Systems Architecture
  { source: "interstellar", target: "time", value: 3 },
  { source: "time", target: "dark", value: 3 },
  { source: "entropy", target: "systems-thinking", value: 2 },
  { source: "systems-thinking", target: "dark", value: 1 },
  { source: "systems-thinking", target: "almanack-naval", value: 1 },
  { source: "time", target: "entropy", value: 2 },
];

export default function ArchiveGraph({ data, onNodeClick }: ArchiveGraphProps) {
  const fgRef = useRef<any>();
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [hoverNode, setHoverNode] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    let rafId: number;
    const updateDimensions = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const container = document.getElementById("archive-graph-container");
        if (container) {
          setDimensions({
            width: container.clientWidth,
            height: Math.min(window.innerHeight * 0.75, 700),
          });
        }
      });
    };
    
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => {
      window.removeEventListener("resize", updateDimensions);
      cancelAnimationFrame(rafId);
    }
  }, []);

  const graphData = useMemo(() => {
    // Only map nodes that are currently passed into the data array
    const validIds = new Set(data.map(d => d.id));
    
    const nodes = data.map(item => ({
      id: item.id,
      name: item.title,
      group: item.category,
      val: 20, 
      itemData: item
    }));
    
    const links = LINKS.filter(l => validIds.has(l.source) && validIds.has(l.target));

    return { nodes, links };
  }, [data]);

  // Center physics camera on load
  useEffect(() => {
    if (fgRef.current && mounted) {
      setTimeout(() => {
        fgRef.current?.zoomToFit(800, 50, () => true);
      }, 600);
    }
  }, [graphData, mounted]);

  const paintRing = useCallback((node: any, ctx: CanvasRenderingContext2D) => {
    ctx.beginPath();
    ctx.arc(node.x, node.y, node.val * 0.4 + 2, 0, 2 * Math.PI, false);
    ctx.strokeStyle = hoverNode?.id === node.id ? "#fff" : "rgba(255,255,255,0.2)";
    ctx.lineWidth = hoverNode?.id === node.id ? 2 : 1;
    ctx.stroke();
  }, [hoverNode]);
  
  if (!mounted) return <div className="h-[600px] w-full bg-zinc-900/50 animate-pulse rounded-2xl" />;

  return (
    <div ref={containerRef} id="archive-graph-container" className="w-full relative rounded-2xl overflow-hidden border border-zinc-800/80 bg-zinc-950 shadow-2xl">
      {/* @ts-ignore - Type definitions for ForceGraph2D ref forwarding are often incomplete */}
      <ForceGraph2D
        ref={fgRef}
        width={dimensions.width}
        height={dimensions.height}
        graphData={graphData}
        nodeLabel={() => ""} // Custom tooltips instead 
        nodeColor={(node: any) => CATEGORY_COLORS[node.group] || "#fff"}
        nodeRelSize={4}
        linkColor={() => "rgba(52, 211, 153, 0.25)"}
        linkWidth={(link: any) => link.value}
        linkDirectionalParticles={2}
        linkDirectionalParticleWidth={1.5}
        nodeCanvasObjectMode={() => "after"}
        nodeCanvasObject={(node: any, ctx: any, globalScale: number) => {
          paintRing(node, ctx);
          
          if (globalScale > 1.2 || hoverNode?.id === node.id) {
            const label = node.name;
            const fontSize = hoverNode?.id === node.id ? 14/globalScale : 11/globalScale;
            ctx.font = `${hoverNode?.id === node.id ? 'bold ' : ''}${fontSize}px monospace`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            const textWidth = ctx.measureText(label).width;
            const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.6); 
            
            ctx.fillStyle = 'rgba(10, 10, 10, 0.85)';
            ctx.beginPath();
            ctx.roundRect(
              node.x - bckgDimensions[0] / 2, 
              node.y + node.val * 0.4 + 4 - bckgDimensions[1] / 2, 
              bckgDimensions[0], 
              bckgDimensions[1],
              4/globalScale // border radius
            );
            ctx.fill();
            
            ctx.fillStyle = hoverNode?.id === node.id ? '#6ee7b7' : 'rgba(255, 255, 255, 0.7)';
            ctx.fillText(label, node.x, node.y + node.val * 0.4 + 4);
          }
        }}
        onNodeHover={(node: any) => {
          setHoverNode(node);
          if (containerRef.current) {
            containerRef.current.style.cursor = node ? 'pointer' : 'default';
          }
        }}
        onNodeClick={(node: any) => onNodeClick(node.itemData)}
        cooldownTicks={150}
        d3AlphaDecay={0.02}
        d3VelocityDecay={0.2}
      />
      
      {/* HUD Overlay Legend */}
      <div className="absolute bottom-6 left-6 flex flex-col gap-2.5 p-4 bg-zinc-950/80 backdrop-blur-md rounded-xl border border-zinc-800 text-xs shadow-xl pointer-events-none">
        <div className="text-zinc-500 font-mono mb-1 tracking-widest text-[10px]">NEURAL MAPPING [12]</div>
        {Object.entries(CATEGORY_COLORS).map(([cat, color]) => (
          <div key={cat} className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.2)]" style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}80` }} />
            <span className="text-zinc-300 font-mono tracking-wider">{cat}</span>
          </div>
        ))}
      </div>
      
      {/* Interaction Hint */}
      <div className="absolute top-6 right-6 text-zinc-600 font-mono text-xs pointer-events-none tracking-widest hidden md:block">
        &gt; PAN / ZOOM / CLICK
      </div>
    </div>
  );
}
