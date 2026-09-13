"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export function AnalyticsTracker() {
  const pathname = usePathname();
  const loggedPathsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    // Only track public routes; ignore admin views to prevent self-counting
    if (!pathname || pathname.startsWith("/admin")) return;
    if (loggedPathsRef.current.has(pathname)) return;
    loggedPathsRef.current.add(pathname);

    try {
      const referrer = typeof document !== "undefined" ? document.referrer || "Direct Transmission" : "Direct Transmission";

      // Dispatch real telemetry to server ingestion node
      const payload = JSON.stringify({
        page: pathname,
        referrer: referrer.includes("localhost") ? "Direct Transmission" : referrer,
      });

      if (typeof navigator !== "undefined" && navigator.sendBeacon) {
        const blob = new Blob([payload], { type: "application/json" });
        navigator.sendBeacon("/api/telemetry/visit", blob);
      } else {
        fetch("/api/telemetry/visit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: payload,
          keepalive: true,
        }).catch(() => {});
      }
    } catch {
      // Non-blocking fallback
    }
  }, [pathname]);

  return null;
}
