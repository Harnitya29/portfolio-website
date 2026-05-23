"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import "leaflet/dist/leaflet.css";

export default function LocationSection() {
  useEffect(() => {
    let map: any;

    async function initMap() {
      const L = (await import("leaflet")).default;

      const el = document.getElementById("portfolio-map");

      if (!el) return;

      if ((el as any)._leaflet_id) return;

      map = L.map(el, {
        zoomControl: false,
        scrollWheelZoom: false,
        dragging: true,
        touchZoom: true,
      }).setView([22.3072, 73.1812], 10);

      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        {
          attribution:
            "&copy; OpenStreetMap &copy; CARTO",
        }
      ).addTo(map);

      L.control.zoom({
        position: "bottomright",
      }).addTo(map);

      const icon = L.divIcon({
        className: "",
        iconSize: [30, 30],
        html:
          '<div class="pulse-marker"><div class="marker-core"></div></div>',
      });

      L.marker(
        [22.3072, 73.1812],
        { icon }
      ).addTo(map);

      setTimeout(() => {
        map.invalidateSize();
      }, 400);
    }

    initMap();

    return () => {
      if (map) map.remove();
    };
  }, []);

  return (
    <>
      <section className="mt-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="mb-4 text-sm text-green-300/70">
            &gt; location
          </p>

          <div className="relative overflow-hidden rounded-[28px] border border-zinc-800 bg-black">

            <div
              id="portfolio-map"
              className="w-full h-[380px] md:h-[520px] lg:h-[620px]"
            />

            <div className="absolute left-5 bottom-5 max-w-[280px] rounded-2xl border border-green-500/20 bg-black/70 p-5 backdrop-blur-xl">

              <p className="mb-2 text-xs text-green-300">
                // CURRENT BASE
              </p>

              <h3 className="text-xl font-semibold">
                Vadodara, Gujarat
              </h3>

              <p className="mt-1 text-sm text-zinc-400">
                22.3072° N · 73.1812° E
              </p>

              <div className="mt-4 flex items-center gap-2">

                <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />

                <span className="text-sm text-zinc-300">
                  open to remote · relocation
                </span>

              </div>

            </div>

          </div>
        </motion.div>
      </section>

      <style jsx global>{`
        .leaflet-container {
          background: #050505;
          border-radius: 28px;
        }

        .pulse-marker {
          width: 30px;
          height: 30px;
          position: relative;
        }

        .pulse-marker::before {
          content: "";
          position: absolute;
          inset: 0;

          background:
            rgba(52,211,153,.35);

          border-radius: 999px;

          animation:
            pulse 2s infinite;
        }

        .marker-core {
          width: 12px;
          height: 12px;

          position: absolute;

          top: 50%;
          left: 50%;

          transform:
            translate(-50%, -50%);

          border-radius: 999px;

          background:
            rgb(52,211,153);

          box-shadow:
            0 0 25px rgb(52,211,153);
        }

        @keyframes pulse {
          from {
            transform: scale(.8);
            opacity: 1;
          }

          to {
            transform: scale(2.5);
            opacity: 0;
          }
        }

        @media (max-width:768px) {
          .leaflet-control-container {
            transform: scale(.9);
          }
        }
      `}</style>
    </>
  );
}