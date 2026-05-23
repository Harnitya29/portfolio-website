"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import "leaflet/dist/leaflet.css";

export default function LocationSection() {
  useEffect(() => {
    let map: any;

    async function init() {
      const L = (await import("leaflet")).default;

      const el =
        document.getElementById("portfolio-map");

      if (!el) return;

      if ((el as any)._leaflet_id) return;

      map = L.map(el, {
        zoomControl: false,
        scrollWheelZoom: false,
        touchZoom: true,
        dragging: true,
      }).setView([22.3072, 73.1812], 8);

      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        {
          attribution:
            "&copy; OpenStreetMap &copy; CARTO",
        }
      ).addTo(map);

      L.control
        .zoom({
          position: "bottomright",
        })
        .addTo(map);

      const marker =
        L.divIcon({
          className: "",
          iconSize: [26, 26],
          html:
            '<div class="pulse-marker"><div class="core"></div></div>',
        });

      L.marker(
        [22.3072, 73.1812],
        {
          icon: marker,
        }
      ).addTo(map);

      setTimeout(() => {
        map.invalidateSize();
      }, 500);
    }

    init();

    return () => {
      if (map) map.remove();
    };
  }, []);

  return (
    <>
      <section className="mt-24">

        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
        >

          <div className="mb-5">

            <div className="text-green-400 text-xl">
              &gt; location
            </div>

            <div className="text-green-500/60 text-sm mt-2">
              [ coordinates locked ]
            </div>

          </div>

          <div className="relative overflow-hidden rounded-[34px] border border-zinc-800">

            <div
              id="portfolio-map"
              className="w-full h-[320px] md:h-[460px] lg:h-[560px]"
            />

            <div className="absolute left-4 bottom-4 w-[230px] rounded-[26px] border border-green-500/20 bg-black/70 backdrop-blur-xl p-5">

              <div className="text-xs text-green-400 mb-2">
                // CURRENT BASE
              </div>

              <div className="text-[20px] font-semibold">
                Vadodara, Gujarat
              </div>

              <div className="text-zinc-400 mt-2">
                22.3072° N · 73.1812° E
              </div>

              <div className="mt-5 flex items-center gap-2">

                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />

                <div className="text-zinc-300 text-sm">
                  open to remote · relocation
                </div>

              </div>

            </div>

          </div>

        </motion.div>

      </section>

      <style jsx global>{`

        .leaflet-container{
          border-radius:34px;

          background:
            #0f172a;

          filter:
            brightness(1.12)
            contrast(1.06);

          overflow:hidden;
        }

        .pulse-marker{
          width:26px;

          height:26px;

          position:relative;
        }

        .pulse-marker::before{

          content:"";

          position:absolute;

          inset:0;

          border-radius:999px;

          background:
            rgba(52,211,153,.25);

          animation:
            pulse 2s infinite;
        }

        .core{

          width:8px;

          height:8px;

          position:absolute;

          top:50%;

          left:50%;

          transform:
            translate(-50%,-50%);

          border-radius:
            999px;

          background:
            rgb(52,211,153);

          box-shadow:
            0 0 18px
            rgb(52,211,153);

        }

        @keyframes pulse{

          from{

            transform:
              scale(.8);

            opacity:1;

          }

          to{

            transform:
              scale(1.8);

            opacity:0;

          }

        }

        @media(max-width:768px){

          .leaflet-control-container{

            transform:
              scale(.88);

          }

        }

      `}</style>
    </>
  );
}