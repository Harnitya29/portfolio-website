"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import type { Map as MapLibreMap } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import ProbabilityCloud from "~/components/map/ProbabilityCloud";
import PhysicsTicker from "~/components/PhysicsTicker";

const MSU_LNG = 73.1812;
const MSU_LAT = 22.3023;
const FUTURE_LNG = 138.7274;
const FUTURE_LAT = 35.3606;
const TOKYO_LNG = 139.6917;
const TOKYO_LAT = 35.6895;

const TELEMETRY = [
  { label: "ℏ", value: "1.055×10⁻³⁴ J·s" },
  { label: "φ", value: "22.3023° N" },
  { label: "λ", value: "73.1812° E" },
  { label: "|ψ|²", value: "LOCALIZED" },
];

export default function LocationSection() {
  const [hovered, setHovered] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const bearingRef = useRef(-20);
  const isOrbitingRef = useRef(true);

  const containerVariants = useMemo(
    () => ({
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
    }),
    []
  );

  const titleVariants = useMemo(
    () => ({
      hidden: { opacity: 0, x: -20 },
      visible: { opacity: 1, x: 0, transition: { duration: 0.5, delay: 0.2 } },
    }),
    []
  );

  const flyToFuture = useCallback(() => {
    isOrbitingRef.current = false;
    const map = mapRef.current;
    if (!map) return;
    map.flyTo({
      center: [TOKYO_LNG, TOKYO_LAT],
      zoom: 12,
      pitch: 58,
      bearing: 0,
      duration: 3500,
      essential: true,
    });
  }, []);

  const flyToHome = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;
    
    // Stop orbiting while flying
    isOrbitingRef.current = false;
    
    map.flyTo({
      center: [MSU_LNG, MSU_LAT],
      zoom: 13.8,
      pitch: 58,
      bearing: bearingRef.current,
      duration: 3500,
      essential: true,
    });

    // Resume orbiting once we arrive
    map.once("moveend", () => {
      isOrbitingRef.current = true;
    });
  }, []);

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    let resizeObserver: ResizeObserver;
    let cancelled = false;

    async function init() {
      const maplibregl = (await import("maplibre-gl")).default;
      if (cancelled || !mapContainer.current) return;

      const map = new maplibregl.Map({
        container: mapContainer.current,
        style: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
        center: [MSU_LNG, MSU_LAT],
        zoom: 13.8,
        pitch: 58,
        bearing: -20,
        attributionControl: false,
        dragPan: true,
        scrollZoom: false,
        touchZoomRotate: true,
        fadeDuration: 300,
      });

      mapRef.current = map;

      map.on("load", () => {
        if (cancelled) return;
        setMapReady(true);

        // Inject Custom Theme Colors (Violet & Cyan) into the Dark Matter Style
        try {
          const layers = map.getStyle().layers;
          if (layers) {
            layers.forEach((layer) => {
              if (layer.id.includes("water")) {
                map.setPaintProperty(layer.id, layer.type === "line" ? "line-color" : "fill-color", "rgba(94, 234, 212, 0.15)"); // Cyan water
              } else if (layer.id.includes("road")) {
                map.setPaintProperty(layer.id, "line-color", "rgba(123, 110, 246, 0.3)"); // Violet roads
              } else if (layer.id.includes("building")) {
                map.setPaintProperty(layer.id, "fill-color", "rgba(123, 110, 246, 0.05)"); // Faint violet buildings
                if (layer.type === "fill-extrusion") {
                  map.setPaintProperty(layer.id, "fill-extrusion-color", "rgba(123, 110, 246, 0.05)");
                }
              } else if (layer.id.includes("landcover") || layer.id.includes("park") || layer.id.includes("green")) {
                map.setPaintProperty(layer.id, layer.type === "line" ? "line-color" : "fill-color", "rgba(123, 110, 246, 0.02)");
              }
            });
          }
        } catch (err) {
          console.warn("Failed to apply custom map themes:", err);
        }

        // Quantum probability halo (GeoJSON circle)
        map.addSource("q-probability", {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: {
              type: "Point",
              coordinates: [MSU_LNG, MSU_LAT],
            },
          },
        });

        map.addLayer({
          id: "q-probability-glow",
          type: "circle",
          source: "q-probability",
          paint: {
            "circle-radius": [
              "interpolate",
              ["linear"],
              ["zoom"],
              10,
              18,
              14,
              55,
              16,
              90,
            ],
            "circle-color": "#7B6EF6",
            "circle-opacity": 0.12,
            "circle-blur": 1,
            "circle-stroke-width": 1,
            "circle-stroke-color": "#5eead4",
            "circle-stroke-opacity": 0.35,
          },
        });

        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (!reduced) {
          let last = performance.now();
          const orbit = (now: number) => {
            if (!mapRef.current) return;
            if (!isOrbitingRef.current) {
              last = now;
              animationRef.current = requestAnimationFrame(orbit);
              return;
            }
            const dt = Math.min((now - last) / 1000, 0.05);
            last = now;
            bearingRef.current = (bearingRef.current + dt * 4) % 360;
            const pitch = 54 + Math.sin(now * 0.0004) * 4;
            map.setBearing(bearingRef.current);
            map.setPitch(pitch);
            animationRef.current = requestAnimationFrame(orbit);
          };
          animationRef.current = requestAnimationFrame(orbit);
        }
      });

      // Custom marker — superposition core (MSU)
      const elMSU = document.createElement("div");
      elMSU.className = "quantum-marker cursor-pointer";
      elMSU.innerHTML = `
        <div class="relative group flex items-center justify-center w-10 h-10 rounded-full bg-black/80 border border-[var(--q-violet)] shadow-[0_0_15px_var(--q-violet)] backdrop-blur-md transition-transform hover:scale-110">
          <span class="text-xl leading-none">🏛️</span>
          <div class="absolute -inset-2 rounded-full border border-[var(--q-cyan)] opacity-30 animate-pulse"></div>
          <div class="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap px-2 py-1 border border-[var(--q-violet)]/60 bg-black/80 text-[var(--q-cyan)] text-[10px] font-mono font-bold tracking-widest pointer-events-none rounded">
            MS University
          </div>
        </div>
      `;

      new maplibregl.Marker({ element: elMSU, anchor: "center" })
        .setLngLat([MSU_LNG, MSU_LAT])
        .addTo(map);

      // Custom marker — NV Hall
      const elNV = document.createElement("div");
      elNV.className = "quantum-marker nv-hall-marker cursor-pointer";
      elNV.innerHTML = `
        <div class="relative group flex items-center justify-center w-8 h-8 rounded-full bg-black/80 border border-[var(--q-violet)] shadow-[0_0_10px_var(--q-violet)] backdrop-blur-md transition-transform hover:scale-110">
          <span class="text-lg leading-none">🛏️</span>
          <div class="absolute -inset-1 rounded-full border border-[var(--q-lime)] opacity-40 animate-ping" style="animation-duration: 2s;"></div>
          <div class="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap px-2 py-1 border border-[var(--q-violet)]/60 bg-black/80 text-[var(--q-cyan)] text-[10px] font-mono font-bold tracking-widest pointer-events-none rounded">
            NV Hall Dorm
          </div>
        </div>
      `;

      new maplibregl.Marker({ element: elNV, anchor: "center" })
        .setLngLat([73.1791, 22.3186])
        .addTo(map);

      // Custom marker — Tokyo, Japan (Future Node)
      const elTokyo = document.createElement("div");
      elTokyo.className = "quantum-marker tokyo-marker cursor-pointer";
      elTokyo.innerHTML = `
        <div class="relative group flex items-center justify-center w-8 h-8 rounded-full bg-black/80 border border-[var(--q-violet)] shadow-[0_0_10px_var(--q-violet)] backdrop-blur-md transition-transform hover:scale-110">
          <span class="text-lg leading-none">⛩️</span>
          <div class="absolute -inset-1 rounded-full border border-[var(--q-cyan)] opacity-40 animate-pulse" style="animation-duration: 3s;"></div>
          <div class="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap px-2 py-1 border border-[var(--q-violet)]/60 bg-black/80 text-[var(--q-cyan)] text-[10px] font-mono font-bold tracking-widest pointer-events-none rounded">
            Tokyo, Japan
          </div>
        </div>
      `;

      new maplibregl.Marker({ element: elTokyo, anchor: "center" })
        .setLngLat([TOKYO_LNG, TOKYO_LAT])
        .addTo(map);

      resizeObserver = new ResizeObserver(() => map.resize());
      resizeObserver.observe(mapContainer.current);
    }

    init();

    return () => {
      cancelled = true;
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      resizeObserver?.disconnect();
    };
  }, []);

  return (
    <>
      <motion.div
        className="text-white mb-24 relative smooth-gpu"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
      >
        <motion.div className="flex items-center gap-4 mb-3" variants={titleVariants}>
          <div className="q-section-rule w-12" />
          <h2 className="q-section-label">[ Current_Coordinates ]</h2>
        </motion.div>

        <p className="q-formula mb-8 pl-16 max-w-xl">
          Hilbert space coordinates · MSU Baroda · Vadodara manifold
        </p>

        <div className="relative group">
          <motion.div
            className="q-panel overflow-hidden relative"
            onHoverStart={() => setHovered(true)}
            onHoverEnd={() => setHovered(false)}
          >
            {/* Corner Brackets */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-[var(--q-violet)]/80 transition-opacity duration-500 z-50 pointer-events-none" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-[var(--q-violet)]/80 transition-opacity duration-500 z-50 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-[var(--q-violet)]/80 transition-opacity duration-500 z-50 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-[var(--q-violet)]/80 transition-opacity duration-500 z-50 pointer-events-none" />
            <div
              ref={mapContainer}
              className="w-full h-[300px] md:h-[450px] relative transition-all duration-1000"
              style={{
                filter: hovered
                  ? "invert(90%) hue-rotate(180deg) saturate(150%) brightness(1.1) contrast(1.05)"
                  : "invert(95%) hue-rotate(180deg) saturate(120%) brightness(0.95) contrast(1.0)",
              }}
            />

            <ProbabilityCloud active={mapReady} />

            <div className="absolute inset-0 pointer-events-none z-20 scanlines opacity-25" />
            <div
              className="absolute inset-0 pointer-events-none z-[18]"
              style={{
                background:
                  "radial-gradient(ellipse 80% 70% at 50% 45%, transparent 25%, rgba(3,3,8,0.75) 75%, rgba(0,0,0,0.95) 100%)",
              }}
            />

            {/* HUD */}
            <div className="absolute inset-0 pointer-events-none z-40 p-4 md:p-6 flex flex-col justify-between">
              <div className="flex flex-wrap justify-between gap-4">
                <div>
                  <div className="text-[var(--q-cyan)] text-[10px] md:text-xs font-mono font-bold tracking-widest flex items-center gap-2">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--q-lime)] animate-pulse" />
                    WAVE_FUNCTION COLLAPSED
                  </div>
                  <div className="text-zinc-500 text-[9px] font-mono mt-1 uppercase tracking-widest">
                    Basis: |Vadodara⟩
                  </div>
                </div>

                <div className="flex gap-3 md:gap-4">
                  {TELEMETRY.map((t) => (
                    <div key={t.label} className="text-right hidden sm:block">
                      <div className="text-[var(--q-violet)] text-[9px] font-mono opacity-80">
                        {t.label}
                      </div>
                      <div className="text-zinc-400 text-[9px] font-mono">{t.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Replaced fixed center HUD text with marker hover tooltips */}


              <div className="flex justify-between items-end gap-2">
                <div className="text-[9px] font-mono text-zinc-600">
                  ∇²ψ + (2m/ℏ²)(E − V)ψ = 0
                </div>
                <div className="pointer-events-auto flex gap-2">
                  <button
                    type="button"
                    onClick={flyToHome}
                    className="relative inline-flex items-center rounded-full px-4 py-1.5 text-[10px] font-mono border border-[var(--q-violet)]/30 bg-black/60 text-[var(--q-cyan)] hover:border-[var(--q-violet)] hover:bg-[var(--q-violet)]/10 hover:shadow-[0_0_15px_rgba(123,110,246,0.3)] hover:scale-105 transition-all duration-300 backdrop-blur-sm"
                  >
                    |now⟩
                  </button>
                  <button
                    type="button"
                    onClick={flyToFuture}
                    className="relative inline-flex items-center rounded-full px-4 py-1.5 text-[10px] font-mono border border-[var(--q-violet)]/30 bg-black/60 text-[var(--q-violet)] hover:border-[var(--q-violet)] hover:bg-[var(--q-violet)]/10 hover:shadow-[0_0_15px_rgba(123,110,246,0.3)] hover:scale-105 transition-all duration-300 backdrop-blur-sm"
                    title="Japan — 5yr horizon"
                  >
                    |future⟩
                  </button>
                </div>
              </div>
            </div>


          </motion.div>

          <PhysicsTicker className="mt-0 rounded-b-sm" />

          <motion.div
            className="mt-8 relative border-l-2 border-[var(--q-violet-dim)] pl-6 ml-2"
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-lg font-medium text-white tracking-wide font-mono">
              Current eigenstate:{" "}
              <span className="text-[var(--q-cyan)]">Vadodara, Gujarat</span>
            </h3>
            <p className="text-zinc-400 mt-3 text-sm leading-relaxed max-w-xl font-mono">
              <span className="text-zinc-500">&gt;</span> University dorm · building at the
              intersection of web, AI, and security.
              <br />
              <br />
              <span className="text-zinc-600 text-xs">
                [ τ ≈ 5y ] Future measurement bias: 35.6895° N, 139.6917° E — tap{" "}
                <button
                  type="button"
                  onClick={flyToFuture}
                  className="text-[var(--q-violet)] hover:text-[var(--q-cyan)] underline-offset-2 hover:underline"
                >
                  |future⟩
                </button>{" "}
                to jump.
              </span>
            </p>
          </motion.div>
        </div>
      </motion.div>

      <style jsx global>{`
        .scanlines {
          background: linear-gradient(
            to bottom,
            rgba(255, 255, 255, 0),
            rgba(255, 255, 255, 0) 50%,
            rgba(0, 0, 0, 0.15) 50%,
            rgba(0, 0, 0, 0.15)
          );
          background-size: 100% 3px;
        }

        .quantum-marker {
          width: 48px;
          height: 48px;
          position: relative;
        }
        .qm-core {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 8px;
          height: 8px;
          margin: -4px 0 0 -4px;
          background: var(--q-lime);
          border-radius: 50%;
          box-shadow: 0 0 12px var(--q-lime), 0 0 24px var(--q-violet);
          z-index: 3;
        }
        .qm-orbit {
          position: absolute;
          inset: 0;
          border: 1px solid var(--q-cyan);
          border-radius: 50%;
          opacity: 0.6;
        }
        .qm-o1 {
          animation: qm-spin 4s linear infinite;
        }
        .qm-o2 {
          animation: qm-spin 6s linear infinite reverse;
          inset: 6px;
          border-color: var(--q-violet);
        }
        .qm-o3 {
          animation: qm-pulse 2.5s ease-out infinite;
          border-color: var(--q-lime);
        }
        @keyframes qm-spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes qm-pulse {
          0% {
            transform: scale(0.3);
            opacity: 0.9;
          }
          100% {
            transform: scale(1.8);
            opacity: 0;
          }
        }

        .maplibregl-ctrl-bottom-right {
          display: none !important;
        }
      `}</style>
    </>
  );
}
