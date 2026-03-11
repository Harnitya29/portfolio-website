"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function VisitorTracker() {
  const pathname = usePathname();
  const hasTrackedInitialRender = useRef(false);
  const lastTrackedPath = useRef("");

  useEffect(() => {
    // Prevent duplicate tracking in React StrictMode
    if (!hasTrackedInitialRender.current) {
      hasTrackedInitialRender.current = true;
      lastTrackedPath.current = pathname;
      fireTracking(pathname);
      return;
    }

    // Track SPA route changes
    if (pathname !== lastTrackedPath.current) {
      lastTrackedPath.current = pathname;
      fireTracking(pathname);
    }
  }, [pathname]);

  const fireTracking = (pagePath: string) => {
    // Fire-and-forget
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ page: pagePath }),
      // Keepalive ensures the request fires even if user immediately navigates away
      keepalive: true, 
    }).catch(() => {
        // Silently swallow errors; telemetry shouldn't crash the console
    });
  };

  // Render absolutely nothing to the DOM
  return null;
}
