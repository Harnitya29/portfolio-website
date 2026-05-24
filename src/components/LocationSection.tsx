"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import "maplibre-gl/dist/maplibre-gl.css";

export default function LocationSection() {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const animationRef = useRef<number>();

  // Memoize animation variants
  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  }), []);

  const titleVariants = useMemo(() => ({
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, delay: 0.2 } }
  }), []);

  const handleHoverStart = useCallback((item: string) => {
    setHoveredItem(item);
  }, []);

  const handleHoverEnd = useCallback(() => {
    setHoveredItem(null);
  }, []);

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    let resizeObserver: ResizeObserver;

    async function init() {
      const maplibregl = (await import("maplibre-gl")).default;

      // Initialize with 3D Pitch and Bearing for a tactical view
      mapRef.current = new maplibregl.Map({
        container: mapContainer.current!,
        style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
        center: [73.1791, 22.3186],
        zoom: 13.5,
        pitch: 60, // 3D tilt
        bearing: -20, // Initial rotation
        attributionControl: false,
        dragPan: true,
        scrollZoom: false,
        interactive: false // Lock interactions to make it feel like a pure HUD
      });

      // Custom Radar Blip Marker
      const el = document.createElement('div');
      el.className = 'radar-blip';
      
      const core = document.createElement('div');
      core.className = 'radar-core';
      el.appendChild(core);

      const ring1 = document.createElement('div');
      ring1.className = 'radar-ring ring-1';
      el.appendChild(ring1);

      const ring2 = document.createElement('div');
      ring2.className = 'radar-ring ring-2';
      el.appendChild(ring2);

      new maplibregl.Marker({ element: el })
        .setLngLat([73.1791, 22.3186])
        .addTo(mapRef.current);

      // Slow cinematic rotation effect
      const rotateCamera = (timestamp: number) => {
        if (mapRef.current) {
          // Rotate very slowly
          mapRef.current.rotateTo((timestamp / 400) % 360, { duration: 0 });
          animationRef.current = requestAnimationFrame(rotateCamera);
        }
      };
      
      // Start rotation after map loads
      mapRef.current.on('load', () => {
        rotateCamera(0);
      });

      resizeObserver = new ResizeObserver(() => {
        if (mapRef.current) {
          mapRef.current.resize();
        }
      });
      resizeObserver.observe(mapContainer.current!);
    }

    init();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      if (resizeObserver) resizeObserver.disconnect();
    };
  }, []);

  return (
    <>
      <motion.div 
        className="text-white mb-24 relative will-change-transform"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="flex items-center gap-4 mb-8" variants={titleVariants}>
          <div className="w-12 h-[1px] bg-[#9dff00]" />
          <h2 className="text-[#9dff00] text-sm tracking-[0.3em] uppercase font-mono">
            [ Geo-Spatial Tracking ]
          </h2>
        </motion.div>
        
        <div className="relative group">
          <motion.div
            className="relative rounded-sm overflow-hidden bg-black border border-zinc-900/50"
            onHoverStart={() => handleHoverStart('map')}
            onHoverEnd={handleHoverEnd}
          >
            {/* The Map */}
            <div 
              ref={mapContainer}
              className="w-full h-[450px] relative z-10 filter-tactical transition-all duration-700"
              style={{
                filter: hoveredItem === 'map' 
                  ? 'sepia(100%) hue-rotate(50deg) saturate(400%) brightness(1.2) contrast(1.2)' 
                  : 'sepia(100%) hue-rotate(50deg) saturate(200%) brightness(0.6) contrast(1.5)'
              }}
            />
            
            {/* CRT Scanline Overlay */}
            <div className="absolute inset-0 pointer-events-none z-20 scanlines opacity-30" />
            
            {/* Deep Vignette */}
            <div className="absolute inset-0 pointer-events-none z-30 bg-radial-vignette opacity-80" />
            
            {/* Cybernetic HUD Elements */}
            <div className="absolute inset-0 pointer-events-none z-40 p-6 flex flex-col justify-between">
              
              {/* Top HUD */}
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="text-[#9dff00] text-xs font-mono opacity-80 animate-pulse">
                    REC <span className="inline-block w-2 h-2 rounded-full bg-red-500 ml-1" />
                  </div>
                  <div className="text-zinc-500 text-[10px] font-mono tracking-widest">
                    UPLINK: SECURE
                  </div>
                </div>
                
                <div className="text-right space-y-1">
                  <div className="text-[#9dff00] text-xs font-mono opacity-80">
                    LAT: 22.3186° N
                  </div>
                  <div className="text-[#9dff00] text-xs font-mono opacity-80">
                    LNG: 73.1791° E
                  </div>
                  <div className="text-zinc-500 text-[10px] font-mono tracking-widest mt-2">
                    NV HALL_MSU_VADODARA
                  </div>
                </div>
              </div>

              {/* Targeting Crosshairs (Center) */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120px] h-[120px] border border-[#9dff00]/20 rounded-full flex items-center justify-center">
                <div className="w-[140px] h-[1px] bg-[#9dff00]/20 absolute" />
                <div className="w-[1px] h-[140px] bg-[#9dff00]/20 absolute" />
                <div className="w-1.5 h-1.5 border border-[#9dff00]/50" />
              </div>

              {/* Bottom HUD */}
              <div className="flex justify-between items-end">
                <div className="w-32 h-8 border-l-2 border-b-2 border-[#9dff00]/30 relative">
                  <div className="absolute bottom-2 left-2 text-[#9dff00] text-[10px] font-mono opacity-60">
                    SYS.OP.NORMAL
                  </div>
                </div>
                
                {/* Dynamic Data Scroller */}
                <div className="w-48 overflow-hidden h-4 relative">
                  <motion.div 
                    className="text-[#9dff00]/50 text-[10px] font-mono whitespace-nowrap absolute"
                    animate={{ x: [0, -200] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  >
                    01001000 01000001 01010010 01001110 01001001 01010100 01011001 01000001
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Corner Brackets */}
            <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-[#9dff00] z-40 opacity-50" />
            <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-[#9dff00] z-40 opacity-50" />
            <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-[#9dff00] z-40 opacity-50" />
            <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-[#9dff00] z-40 opacity-50" />

          </motion.div>
          
          <motion.div
            className="mt-8 relative border-l border-[#9dff00]/30 pl-6 ml-2"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0, transition: { duration: 0.5, delay: 0.5 } }}
          >
            <motion.h3 
              className="text-lg font-medium text-white tracking-wide"
            >
              Current Base: <span className="text-[#9dff00]">Vadodara, Gujarat</span>
            </motion.h3>
            
            <motion.p 
              className="text-zinc-400 mt-3 text-sm leading-relaxed max-w-xl font-mono"
            >
              <span className="text-zinc-500">&gt;</span> Currently surviving and thriving in a university dorm room. 
              <br/><br/>
              <span className="text-zinc-600">
                [ Note ] If you're looking for me in 5 years, check 35.3606° N, 138.7274° E. I'll probably be somewhere there—chilling.
              </span>
            </motion.p>
          </motion.div>
        </div>
      </motion.div>

      <style jsx global>{`
        /* Radar Blip Marker */
        .radar-blip {
          width: 40px;
          height: 40px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .radar-core {
          width: 6px;
          height: 6px;
          background: #9dff00;
          border-radius: 50%;
          box-shadow: 0 0 10px #9dff00, 0 0 20px #9dff00;
          z-index: 2;
        }
        .radar-ring {
          position: absolute;
          inset: 0;
          border: 1px solid #9dff00;
          border-radius: 50%;
          opacity: 0;
        }
        .ring-1 {
          animation: radar-ping 2.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        .ring-2 {
          animation: radar-ping 2.5s cubic-bezier(0, 0, 0.2, 1) infinite;
          animation-delay: 0.5s;
        }
        @keyframes radar-ping {
          0% { transform: scale(0.1); opacity: 0.8; border-width: 2px; }
          100% { transform: scale(2); opacity: 0; border-width: 1px; }
        }

        /* CRT Scanlines */
        .scanlines {
          background: linear-gradient(
            to bottom,
            rgba(255,255,255,0),
            rgba(255,255,255,0) 50%,
            rgba(0,0,0,0.2) 50%,
            rgba(0,0,0,0.2)
          );
          background-size: 100% 4px;
        }

        /* Deep Vignette */
        .bg-radial-vignette {
          background: radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.85) 90%, rgba(0,0,0,1) 100%);
        }

        /* Hide MapLibre Logo/Attribution since we want a pure HUD */
        .maplibregl-ctrl-bottom-right {
          display: none !important;
        }
      `}</style>
    </>
  );
}
