"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import "leaflet/dist/leaflet.css";

export default function LocationSection() {
  useEffect(() => {
    let map: any;

    const loadMap = async () => {
      const L = (await import("leaflet")).default;

      const container =
        document.getElementById("portfolio-map");

      if (!container) return;

      if ((container as any)._leaflet_id) return;

      map = L.map(container, {
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

      const marker = L.divIcon({
        html: `
          <div class="pulse-marker">
            <div class="core"></div>
          </div>
        `,
        className: "",
        iconSize: [32, 32],
      });

      L.marker(
        [22.3072, 73.1812],
        {
          icon: marker,
        }
      ).addTo(map);

      setTimeout(() => {
        map.invalidateSize();
      }, 300);
    };

    loadMap();

    return () => {
      if (map) {
        map.remove();
      }
    };
  }, []);

  return (
    <section className="mt-24">

      <motion.div
        initial={{
          opacity: 0,
          y: 40,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{
          once: true,
        }}
      >

        <p className="text-sm text-green-300/70 mb-4">
          &gt; location
        </p>

        <div className="relative rounded-[28px] overflow-hidden border border-zinc-800 bg-black">

          <div
            id="portfolio-map"
            className="w-full h-[380px] md:h-[520px] lg:h-[620px]"
          />

          <div
            className="
              absolute
              left-5
              bottom-5
              rounded-2xl
              bg-black/70
              backdrop-blur-xl
              border
              border-green-500/20
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

            <p className="text-sm text-zinc-400 mt-1">
              22.3072° N · 73.1812° E
            </p>

            <div className="mt-4 flex items-center gap-2">

              <span
                className="
                  w-2
                  h-2
                  rounded-full
                  bg-green-400
                  animate-pulse
                "
              />

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
            rgba(52,211,153,.35);

          animation:
            pulse 2s infinite;
        }

        .core {
          width: 12px;

          height: 12px;

          position: absolute;

          left: 50%;

          top: 50%;

          transform:
            translate(-50%,-50%);

          border-radius:
            999px;

          background:
            rgb(52,211,153);

          box-shadow:
            0 0 25px
            rgb(52,211,153);
        }

        @keyframes pulse {

          from {
            transform:
              scale(.8);

            opacity:
              1;
          }

          to {
            transform:
              scale(2.5);

            opacity:
              0;
          }

        }

        @media (max-width:768px){

          .leaflet-control-container{

            transform:
              scale(.9);

          }

        }

      `}</style>

    </section>
  );
}