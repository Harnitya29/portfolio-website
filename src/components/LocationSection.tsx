"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import "leaflet/dist/leaflet.css";

export default function LocationSection() {
  useEffect(() => {
    let map: any;

    const loadMap = async () => {
      const L = (await import("leaflet")).default;

      const container = document.getElementById("portfolio-map");

      if (!container) return;

      map = L.map(container, {
        zoomControl: false,
        scrollWheelZoom: false,
        dragging: true,
        touchZoom: true,
      }).setView([22.3072, 73.1812], 10);

      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        {
          maxZoom: 19,
          attribution: "&copy; OpenStreetMap &copy; CARTO",
        }
      ).addTo(map);

      L.control.zoom({
        position: "bottomright",
      }).addTo(map);

      const icon = L.divIcon({
        html: `
          <div class="pulse-marker">
            <div class="core"></div>
          </div>
        `,
        className: "",
        iconSize: [32, 32],
      });

      L.marker([22.3072, 73.1812], {
        icon,
      }).addTo(map);

      setTimeout(() => {
        map.invalidateSize();
      }, 300);
    };

    loadMap();

    return () => {
      if (map) map.remove();
    };
  }, []);

  return (
    <section className="mt-24">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <p className="text-green-300/70 text-sm mb-4">
          &gt; location
        </p>

        <div className="relative overflow-hidden rounded-[28px] border border-zinc-800 bg-black">

          <div
            id="portfolio-map"
            className="
              w-full
              h-[380px]
              md:h-[520px]
              lg:h-[620px]
            "
          />

          <div
            className="
              absolute
              bottom-5
              left-5
              rounded-2xl
              border
              border-green-400/20
              bg-black/70
              backdrop-blur-xl
              p-5
              max-w-[280px]
            "
          >
            <p className="text-xs text-green-300 mb-2">
              // CURRENT BASE
            </p>

            <h3 className="text-xl font-semibold">
              Vadodara, Gujarat
            </h3>

            <p className="text-zinc-400 text-sm mt-1">
              22.3072° N · 73.1812° E
            </p>

            <div className="mt-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-sm text-zinc-300">
                open to remote · relocation
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      <style jsx global>{`
        .leaflet-container {
          background: #020202;
          border-radius: 28px;
        }

        .pulse-marker {
          width: 32px;
          height: 32px;
          position: relative;
        }

        .pulse-marker::before {
          content: "";
          position: absolute;
          inset: 0;

          border-radius: 999px;

          background:
            rgba(52,211,153,.3);

          animation:
            pulse 2s infinite;
        }

        .core {
          position: absolute;

          width: 12px;
          height: 12px;

          left: 50%;
          top: 50%;

          transform:
            translate(-50%,-50%);

          background:
            rgb(52,211,153);

          border-radius: 999px;

          box-shadow:
            0 0 25px
            rgb(52,211,153);
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

        @media (max-width:768px){

          .leaflet-control-container{
            transform:
              scale(.92);
          }

        }
      `}</style>
    </section>
  );
}