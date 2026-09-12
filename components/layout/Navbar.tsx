"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, Shield, Sparkles } from "lucide-react";

interface NavItem {
  id: string;
  label: string;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: "hero", label: "Home", href: "#hero" },
  { id: "packages", label: "Pricing", href: "#packages" },
  { id: "portfolio", label: "Portfolio", href: "#portfolio" },
  { id: "faq", label: "FAQ", href: "#faq" },
  { id: "contact", label: "Contact", href: "#contact" },
];

export function Navbar() {
  const [activeSection, setActiveSection] = useState<string>("hero");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 40);

      const sectionIds = NAV_ITEMS.map((item) => item.id);
      const scrollPosition = window.scrollY + 200;

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string, id: string) => {
    e.preventDefault();
    setActiveSection(id);
    setDrawerOpen(false);

    if (id === "hero") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const target = document.getElementById(id);
    if (target) {
      const offset = 80;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const handleDownloadCV = () => {
    // Scroll to contact or trigger direct resume download
    const contactEl = document.getElementById("contact");
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="fixed top-5 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      {/* Floating Liquid Glass Dock Container */}
      <motion.nav
        initial={{ y: -30, opacity: 0, scale: 0.96 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 350, damping: 28 }}
        className={`pointer-events-auto relative flex items-center justify-between gap-1 sm:gap-2 px-2 py-1.5 rounded-full liquid-glass-dock transition-all duration-300 ${
          hasScrolled ? "scale-[0.98] shadow-[0_24px_60px_-10px_rgba(0,0,0,0.9)]" : ""
        }`}
        aria-label="Main Navigation Dock"
      >
        {/* Far Left: Circular Icon Button (Matches reference image with 'X') */}
        <button
          type="button"
          onClick={() => {
            if (drawerOpen) {
              setDrawerOpen(false);
            } else {
              setDrawerOpen(true);
            }
          }}
          className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/[0.08] hover:bg-white/[0.16] border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-all duration-200 active:scale-95 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]"
          aria-label={drawerOpen ? "Close menu" : "Quick actions"}
          title="Quick Navigation & Admin"
        >
          <X className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-300 ${drawerOpen ? "rotate-90 text-white" : ""}`} />
        </button>

        {/* Center: Navigation Links */}
        <div className="flex items-center">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={item.href}
                onClick={(e) => handleLinkClick(e, item.href, item.id)}
                className={`relative px-3 sm:px-4 py-1.5 sm:py-2 text-[13px] sm:text-sm font-sans tracking-tight transition-colors duration-200 select-none ${
                  isActive ? "text-white font-medium" : "text-white/60 hover:text-white"
                }`}
              >
                <span>{item.label}</span>

                {/* Liquid Glass Bottom Glow Pod (Accurately centered under active item) */}
                {isActive && (
                  <motion.div
                    layoutId="liquid-active-indicator"
                    className="absolute inset-x-0 -bottom-[3px] flex flex-col items-center pointer-events-none"
                    transition={{ type: "spring", stiffness: 420, damping: 32 }}
                  >
                    {/* Diffused liquid light puddle */}
                    <div
                      className="w-8 sm:w-10 h-2.5 rounded-full"
                      style={{
                        background:
                          "radial-gradient(ellipse at bottom, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.4) 45%, transparent 75%)",
                        filter: "blur(2.5px)",
                      }}
                    />
                    {/* Liquid glass specular rim highlight */}
                    <div className="w-6 sm:w-7 h-[1.5px] rounded-full bg-white shadow-[0_0_8px_#ffffff] -mt-1" />
                  </motion.div>
                )}
              </a>
            );
          })}
        </div>

        {/* Far Right: Pure White Pill Action Button ("Download" as in reference image) */}
        <button
          type="button"
          onClick={handleDownloadCV}
          aria-label="Download CV or jump to contact specifications"
          className="relative ml-1 sm:ml-2 px-4 sm:px-5 py-1.5 sm:py-2 rounded-full bg-white hover:bg-neutral-100 text-black text-xs sm:text-sm font-semibold tracking-tight shadow-[0_2px_10px_rgba(255,255,255,0.2)] hover:shadow-[0_0_20px_rgba(255,255,255,0.45)] transition-all duration-200 active:scale-95 flex items-center gap-1.5 select-none"
        >
          <span>Download</span>
        </button>
      </motion.nav>

      {/* Expandable Liquid Glass Quick Drawer (Accessible via Left Circular Button) */}
      <AnimatePresence>
        {drawerOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 360, damping: 28 }}
            className="pointer-events-auto absolute top-16 w-80 sm:w-96 rounded-2xl liquid-glass-dock p-4 shadow-[0_20px_50px_rgba(0,0,0,0.9)] flex flex-col gap-3"
          >
            <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs font-mono text-content-secondary">
              <span className="flex items-center gap-1.5 text-white font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-cyber-cyan" />
                <span>DEV.CRAFT SHORTCUTS</span>
              </span>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="p-1 rounded hover:bg-white/10 text-content-tertiary hover:text-white transition-colors"
                aria-label="Close shortcuts"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-2 gap-2 text-xs font-sans">
              {NAV_ITEMS.map((item) => (
                <a
                  key={`drawer-${item.id}`}
                  href={item.href}
                  onClick={(e) => handleLinkClick(e, item.href, item.id)}
                  className="px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/5 hover:border-white/15 text-white/80 hover:text-white transition-all flex items-center justify-between"
                >
                  <span>{item.label}</span>
                  <span className="text-[10px] text-white/30 font-mono">→</span>
                </a>
              ))}
            </div>

            {/* Admin Command Link & Action */}
            <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2">
              <Link
                href="/admin"
                onClick={() => setDrawerOpen(false)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs font-mono text-white/80 hover:text-white transition-colors"
              >
                <Shield className="w-3.5 h-3.5 text-red-400" />
                <span>ADMIN PANEL</span>
              </Link>

              <button
                type="button"
                onClick={() => {
                  setDrawerOpen(false);
                  handleDownloadCV();
                }}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition-colors"
              >
                <Download className="w-3 h-3" />
                <span>CV / RESUME</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
