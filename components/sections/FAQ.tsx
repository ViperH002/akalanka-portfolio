"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { faqsData } from "@/data/faqs";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ChevronLeft, ChevronRight, CheckCircle2, Sparkles, MoveHorizontal } from "lucide-react";

// Categorized metadata for high-tech HUD styling
const faqCategories = [
  { tag: "DESIGN & FIGMA", short: "01 Figma", icon: "🎨" },
  { tag: "RESPONSIVENESS", short: "02 Mobile", icon: "📱" },
  { tag: "IP & SOURCE CODE", short: "03 Source", icon: "💻" },
  { tag: "API INTEGRATIONS", short: "04 APIs", icon: "⚡" },
  { tag: "DEPLOYMENT & SSL", short: "05 Hosting", icon: "🚀" },
  { tag: "CUSTOM ARCHITECTURE", short: "06 Custom", icon: "🛠️" },
  { tag: "LEGAL & SECURITY", short: "07 NDAs", icon: "🔒" },
  { tag: "PROJECT ONBOARDING", short: "08 Start", icon: "📋" },
];

const cardVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 90 : -90,
    opacity: 0,
    scale: 0.96,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      x: { type: "spring", stiffness: 380, damping: 30 },
      opacity: { duration: 0.2 },
      scale: { duration: 0.2 },
    },
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -90 : 90,
    opacity: 0,
    scale: 0.96,
    transition: {
      x: { duration: 0.16, ease: "easeOut" },
      opacity: { duration: 0.14 },
      scale: { duration: 0.14 },
    },
  }),
};

export function FAQ() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = next, -1 = prev
  const [isNavigating, setIsNavigating] = useState(false);
  const total = faqsData.length;
  const navTimerRef = useRef<NodeJS.Timeout | null>(null);

  const startNavCooldown = () => {
    setIsNavigating(true);
    if (navTimerRef.current) clearTimeout(navTimerRef.current);
    navTimerRef.current = setTimeout(() => {
      setIsNavigating(false);
    }, 240);
  };

  const handleNext = useCallback(() => {
    if (isNavigating) return;
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % total);
    startNavCooldown();
  }, [total, isNavigating]);

  const handlePrev = useCallback(() => {
    if (isNavigating) return;
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + total) % total);
    startNavCooldown();
  }, [total, isNavigating]);

  const handleSelectIndex = (idx: number) => {
    if (idx === currentIndex || isNavigating) return;
    setDirection(idx > currentIndex ? 1 : -1);
    setCurrentIndex(idx);
    startNavCooldown();
  };

  // Cleanup cooldown timer on unmount
  useEffect(() => {
    return () => {
      if (navTimerRef.current) clearTimeout(navTimerRef.current);
    };
  }, []);

  // Keyboard navigation support (Arrow keys)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName.toLowerCase();
      if (activeTag === "input" || activeTag === "textarea") return;

      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev]);

  return (
    <section id="faq" className="py-28 relative z-10 overflow-hidden">
      {/* Giant Watermark Backdrop Text */}
      <div
        aria-hidden="true"
        className="absolute top-8 left-1/2 -translate-x-1/2 w-full text-center pointer-events-none select-none -z-10 overflow-hidden"
      >
        <span className="font-display text-[16vw] sm:text-[18vw] leading-none font-black text-[#dc2626]/10 uppercase tracking-wider block drop-shadow-[0_0_90px_rgba(220,38,38,0.25)]">
          QUESTIONS
        </span>
      </div>

      <div className="max-w-6xl mx-auto px-6">
        <SectionHeader
          backdropText="QUESTIONS"
          scriptTag="Got Questions?"
          tag="KNOWLEDGE BASE"
          title={
            <>
              Interactive <span className="text-red-500">3D FAQ</span> Deck
            </>
          }
          subtitle="Swipe or click through answers regarding technical architecture, delivery milestones, and operational protocols."
        />

        {/* Quick Category Jump Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10 max-w-4xl mx-auto">
          {faqCategories.map((meta, idx) => {
            const isSelected = idx === currentIndex;
            return (
              <button
                key={idx}
                onClick={() => handleSelectIndex(idx)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-sans font-medium transition-all duration-300 flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-white text-black font-semibold shadow-lg shadow-white/20 scale-105"
                    : "bg-white/[0.05] border border-white/10 text-white/60 hover:text-white hover:bg-white/[0.1]"
                }`}
              >
                <span>{meta.short}</span>
              </button>
            );
          })}
        </div>

        {/* 3D Card Swiping Viewport */}
        <div
          className="relative w-full max-w-2xl mx-auto min-h-[390px] sm:min-h-[350px] flex items-center justify-center select-none"
          style={{ perspective: "1200px" }}
        >
          {/* Background Card 3 (Lowest in deck - Ambient Glass Plate) */}
          {total > 2 && (
            <div
              className="absolute inset-0 rounded-[32px] liquid-glass-card border border-white/[0.04] pointer-events-none transition-all duration-500"
              style={{
                transform: "translate3d(0, 24px, -80px) scale(0.92)",
                opacity: 0.3,
                zIndex: 5,
              }}
            />
          )}

          {/* Background Card 2 (Middle in deck - Cyber Depth Plate) */}
          {total > 1 && (
            <div
              className="absolute inset-0 rounded-[32px] liquid-glass-card border border-white/[0.08] pointer-events-none transition-all duration-500 shadow-xl"
              style={{
                transform: "translate3d(0, 12px, -40px) scale(0.96)",
                opacity: 0.55,
                zIndex: 10,
              }}
            >
              {/* Subtle cybernetic corner indicator */}
              <div className="absolute top-5 right-7 font-mono text-[10px] text-white/25 tracking-widest uppercase flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500/50 animate-pulse" />
                <span>DECK PROTOCOL // 0{((currentIndex + 1) % total) + 1}</span>
              </div>
            </div>
          )}

          {/* Active Interactive Top Card (Framer Motion Fluid Slide & Swipe) */}
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={cardVariants}
              initial="enter"
              animate="center"
              exit="exit"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.4}
              whileDrag={{ scale: 1.015, cursor: "grabbing" }}
              onDragEnd={(_, info) => {
                const offsetThreshold = 50;
                const velocityThreshold = 220;

                if (info.offset.x < -offsetThreshold || info.velocity.x < -velocityThreshold) {
                  handleNext();
                } else if (info.offset.x > offsetThreshold || info.velocity.x > velocityThreshold) {
                  handlePrev();
                }
              }}
              className="w-full min-h-[360px] sm:min-h-[320px] rounded-[32px] liquid-glass-card border border-white/20 p-8 sm:p-9 shadow-2xl relative cursor-grab active:cursor-grabbing backdrop-blur-3xl flex flex-col justify-between z-20"
            >
              {/* Internal Ambient Radial Lighting */}
              <div className="absolute inset-0 rounded-[32px] overflow-hidden pointer-events-none">
                <div
                  className="absolute -top-24 -right-24 w-72 h-72 rounded-full blur-3xl opacity-20 pointer-events-none"
                  style={{ background: "radial-gradient(circle, rgba(220, 38, 38, 0.45) 0%, transparent 70%)" }}
                />
                <div
                  className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full blur-3xl opacity-15 pointer-events-none"
                  style={{ background: "radial-gradient(circle, rgba(255, 255, 255, 0.25) 0%, transparent 70%)" }}
                />
              </div>

              {/* Card Header */}
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-5 pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-full bg-white/[0.08] border border-white/15 flex items-center justify-center text-sm shadow-sm">
                      {faqCategories[currentIndex]?.icon || "❓"}
                    </span>
                    <span className="font-mono text-xs font-semibold text-white/80 uppercase tracking-wider">
                      {faqCategories[currentIndex]?.tag || "INQUIRY"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-display text-2xl font-black text-white">
                      0{currentIndex + 1}
                    </span>
                    <span className="font-mono text-xs text-content-tertiary">
                      / 0{total}
                    </span>
                  </div>
                </div>

                {/* Question */}
                <h3 className="text-xl sm:text-2xl font-black text-white leading-snug tracking-tight mb-4 font-sans drop-shadow-md">
                  {faqsData[currentIndex].question}
                </h3>

                {/* Answer */}
                <p className="text-content-secondary text-sm sm:text-base leading-relaxed font-sans mb-4">
                  {faqsData[currentIndex].answer}
                </p>
              </div>

              {/* Card Footer Features */}
              <div className="relative z-10 flex items-center justify-between pt-4 border-t border-white/10 mt-2">
                <div className="flex items-center gap-2 text-xs font-mono text-red-400">
                  <CheckCircle2 size={15} className="text-red-500" />
                  <span>VERIFIED SPECIFICATION</span>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] font-mono text-content-tertiary">
                  <MoveHorizontal size={14} className="animate-pulse text-red-400" />
                  <span className="hidden sm:inline">SWIPE TO NAVIGATE</span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 3D Navigation Controls & Counter */}
        <div className="flex items-center justify-between max-w-md mx-auto mt-10 pt-4">
          {/* Prev Button */}
          <button
            onClick={handlePrev}
            aria-label="Previous question"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl glass-pill hover:bg-red-950/40 hover:border-red-500/50 hover:text-white text-content-secondary font-mono text-xs font-bold uppercase tracking-wider transition-all duration-200 group active:scale-95 shadow-lg select-none"
          >
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform text-red-500" />
            <span>PREV</span>
          </button>

          {/* Dots Indicator */}
          <div className="flex items-center gap-2">
            {faqsData.map((_, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === currentIndex
                    ? "w-8 bg-red-500 shadow-[0_0_10px_#ef4444]"
                    : "w-2 bg-white/20 hover:bg-white/40"
                }`}
              />
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={handleNext}
            aria-label="Next question"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold uppercase tracking-wider shadow-lg shadow-red-600/30 hover:shadow-red-600/60 hover:-translate-y-0.5 transition-all duration-200 group active:scale-95 select-none"
          >
            <span>NEXT</span>
            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Drag Hint Footer Badge */}
        <div className="flex items-center justify-center gap-2 mt-8 text-center text-xs font-mono text-content-tertiary">
          <Sparkles size={13} className="text-red-500 animate-pulse" />
          <span>DRAG CARDS HORIZONTALLY IN 3D OR USE KEYBOARD ARROW KEYS</span>
        </div>
      </div>
    </section>
  );
}
