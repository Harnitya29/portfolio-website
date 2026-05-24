"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import "maplibre-gl/dist/maplibre-gl.css";

export default function LocationSection() {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);

  // Memoize animation variants
  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  }), []);

  const titleVariants = useMemo(() => ({
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, delay: 0.2 } }
  }), []);

  const titleAnimation = useMemo(() => ({
    rotate: [0, 5, 0, -5, 0],
    color: ['#86efac', '#4ade80', '#86efac'],
    textShadow: ['0 0 0px rgba(134, 239, 172, 0)', '0 0 10px rgba(134, 239, 172, 0.5)', '0 0 0px rgba(134, 239, 172, 0)']
  }), []);

  const titleTransition = useMemo(() => ({ 
    duration: 2, 
    repeat: Infinity, 
    repeatDelay: 5, 
    times: [0, 0.2, 0.5, 0.8, 1],
    repeatType: 'loop' as const
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

      mapRef.current = new maplibregl.Map({
        container: mapContainer.current!,
        style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
        center: [73.1791, 22.3186],
        zoom: 11,
        attributionControl: false,
        dragPan: true,
        scrollZoom: false
      });

      mapRef.current.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'bottom-right');

      const el = document.createElement('div');
      el.className = 'pulse-marker';
      const core = document.createElement('div');
      core.className = 'core';
      el.appendChild(core);

      new maplibregl.Marker({ element: el })
        .setLngLat([73.1791, 22.3186])
        .addTo(mapRef.current);

      resizeObserver = new ResizeObserver(() => {
        if (mapRef.current) {
          mapRef.current.resize();
        }
      });
      resizeObserver.observe(mapContainer.current!);
    }

    init();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, []);

  return (
    <>
      <motion.div 
        className="text-white mb-16 relative will-change-transform"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 
          className="text-2xl font-bold text-white relative inline-block"
          variants={titleVariants}
          whileHover={{ scale: 1.03 }}
        >
          <motion.span
            className="text-green-300 inline-block will-change-transform"
            animate={titleAnimation}
            transition={titleTransition}
          >
            &gt;
          </motion.span>{" "}
          <span className="relative group">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-green-200 to-white bg-[length:200%_100%] animate-shimmer">location</span>
            <motion.span
              className="absolute -bottom-1 left-0 h-[2px] bg-gradient-to-r from-green-300/0 via-green-300 to-green-300/0 will-change-transform"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 1, delay: 0.5 }}
              style={{ boxShadow: '0 2px 10px rgba(134, 239, 172, 0.3)' }}
            />
          </span>
        </motion.h1>
        
        <div className="mt-10 relative">
          <motion.div
            className="relative rounded-xl overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              transition: { duration: 0.5, delay: 0.3 }
            }}
            whileHover={{ 
              scale: 1.02,
              transition: { duration: 0.3 }
            }}
            onHoverStart={() => handleHoverStart('map')}
            onHoverEnd={handleHoverEnd}
            onTouchStart={() => handleHoverStart('map')}
            onTouchEnd={handleHoverEnd}
            onTouchCancel={handleHoverEnd}
          >
            <div 
              ref={mapContainer}
              className="w-full h-[400px] rounded-xl relative z-10"
            />
            
            <motion.div 
              className="absolute inset-0 pointer-events-none z-20 rounded-xl overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: hoveredItem === 'map' ? 1 : 0,
                transition: { duration: 0.3 }
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              
              {/* Animated border */}
              <motion.div
                className="absolute top-0 left-0 w-full h-[1px]"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(52, 211, 153, 0.7), transparent)' }}
                animate={{ left: ['-100%', '100%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute bottom-0 right-0 w-full h-[1px]"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(52, 211, 153, 0.7), transparent)' }}
                animate={{ right: ['-100%', '100%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute left-0 top-0 h-full w-[1px]"
                style={{ background: 'linear-gradient(180deg, transparent, rgba(52, 211, 153, 0.7), transparent)' }}
                animate={{ top: ['-100%', '100%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute right-0 bottom-0 h-full w-[1px]"
                style={{ background: 'linear-gradient(180deg, transparent, rgba(52, 211, 153, 0.7), transparent)' }}
                animate={{ bottom: ['-100%', '100%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>
          </motion.div>
          
          <motion.div
            className="mt-6 relative pl-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              transition: { duration: 0.5, delay: 0.5 }
            }}
          >
            <motion.div 
              className="absolute left-0 top-1.5 w-3 h-3 rounded-full bg-green-300"
              animate={{
                scale: [1, 1.2, 1],
                boxShadow: [
                  '0 0 0 rgba(52, 211, 153, 0.4)',
                  '0 0 10px rgba(52, 211, 153, 0.7)',
                  '0 0 0 rgba(52, 211, 153, 0.4)'
                ]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
            
            <motion.h3 
              className="text-xl font-medium text-green-300"
              whileHover={{ scale: 1.02 }}
            >
              NV Hall MSU Boys Hostel Vadodara , Gujarat India
            </motion.h3>
            
            <motion.p 
              className="text-zinc-400 mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              Currently living in uni dorm room and surviving and might thrive.
              <span className="block mt-2 text-zinc-500">
                If you&apos;re looking for me in 5 years, check 35.3606° N, 138.7274° E. I&apos;ll probably be somewhere there—chilling.
              </span>
            </motion.p>
          </motion.div>
        </div>
      </motion.div>

      <style jsx global>{`
        .pulse-marker {
          width: 26px;
          height: 26px;
          position: relative;
        }
        .pulse-marker::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 999px;
          background: rgba(52, 211, 153, 0.25);
          animation: pulse 2s infinite;
        }
        .core {
          width: 8px;
          height: 8px;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          border-radius: 999px;
          background: rgb(52, 211, 153);
          box-shadow: 0 0 18px rgb(52, 211, 153);
        }
        @keyframes pulse {
          from { transform: scale(0.8); opacity: 1; }
          to { transform: scale(1.8); opacity: 0; }
        }
        .maplibregl-ctrl-bottom-right {
          z-index: 10 !important;
        }
      `}</style>
    </>
  );
}
