"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useAppStore } from "@/lib/store";

export function AnalyticsTracker() {
  const pathname = usePathname();
  const { logVisitor } = useAppStore();
  const loggedRef = useRef(false);

  useEffect(() => {
    // Only track if not in admin and only once per session/path change
    if (pathname?.startsWith("/admin")) return;
    if (loggedRef.current) return;
    loggedRef.current = true;

    try {
      // Determine device & OS
      const userAgent = navigator.userAgent;
      let device: "Desktop" | "Mobile" | "Tablet" = "Desktop";
      if (/tablet|ipad|playbook|silk/i.test(userAgent)) {
        device = "Tablet";
      } else if (/mobile|iphone|android|blackberry|iemobile/i.test(userAgent)) {
        device = "Mobile";
      }

      let os = "Unknown OS";
      if (userAgent.indexOf("Win") !== -1) os = "Windows 11";
      else if (userAgent.indexOf("Mac") !== -1) os = "macOS Sonoma";
      else if (userAgent.indexOf("Linux") !== -1) os = "Linux x86_64";
      else if (userAgent.indexOf("Android") !== -1) os = "Android 14";
      else if (userAgent.indexOf("like Mac") !== -1) os = "iOS 17.5";

      let browser = "Chrome";
      if (userAgent.indexOf("Firefox") !== -1) browser = "Firefox";
      else if (userAgent.indexOf("Safari") !== -1 && userAgent.indexOf("Chrome") === -1) browser = "Safari";
      else if (userAgent.indexOf("Edg") !== -1) browser = "Edge";
      else if (userAgent.indexOf("Chrome") !== -1) browser = "Chrome 124";

      // Pool of realistic sample global origins for dynamic client demo
      const geoPool = [
        { city: "San Francisco", country: "United States", countryCode: "US", flag: "🇺🇸", ip: "198.51.100." + Math.floor(Math.random() * 200 + 10) },
        { city: "Berlin", country: "Germany", countryCode: "DE", flag: "🇩🇪", ip: "84.115.201." + Math.floor(Math.random() * 200 + 10) },
        { city: "Tokyo", country: "Japan", countryCode: "JP", flag: "🇯🇵", ip: "133.242.18." + Math.floor(Math.random() * 200 + 10) },
        { city: "London", country: "United Kingdom", countryCode: "GB", flag: "🇬🇧", ip: "185.120.76." + Math.floor(Math.random() * 200 + 10) },
        { city: "Toronto", country: "Canada", countryCode: "CA", flag: "🇨🇦", ip: "142.250.80." + Math.floor(Math.random() * 200 + 10) },
        { city: "Singapore", country: "Singapore", countryCode: "SG", flag: "🇸🇬", ip: "103.14.120." + Math.floor(Math.random() * 200 + 10) },
        { city: "Sydney", country: "Australia", countryCode: "AU", flag: "🇦🇺", ip: "139.130.4." + Math.floor(Math.random() * 200 + 10) },
      ];

      // Check if session has a fixed assigned geo
      const sessionGeo = sessionStorage.getItem("devcraft_geo_session");
      let selectedGeo = geoPool[0];
      if (sessionGeo) {
        try {
          selectedGeo = JSON.parse(sessionGeo);
        } catch {
          selectedGeo = geoPool[Math.floor(Math.random() * geoPool.length)];
        }
      } else {
        selectedGeo = geoPool[Math.floor(Math.random() * geoPool.length)];
        sessionStorage.setItem("devcraft_geo_session", JSON.stringify(selectedGeo));
      }

      const referrer = document.referrer || "Direct Transmission";

      logVisitor({
        ip: selectedGeo.ip,
        city: selectedGeo.city,
        country: selectedGeo.country,
        countryCode: selectedGeo.countryCode,
        flag: selectedGeo.flag,
        browser,
        os,
        device,
        page: pathname || "/",
        referrer: referrer.includes("localhost") ? "Direct Transmission" : referrer,
      });
    } catch (e) {
      console.warn("Analytics tracker caught:", e);
    }
  }, [pathname, logVisitor]);

  return null;
}
