import React from "react";

interface SectionHeaderProps {
  tag?: string;
  scriptTag?: string;
  backdropText?: string;
  title: React.ReactNode;
  subtitle?: string;
  align?: "center" | "left";
  className?: string;
}

export function SectionHeader({
  tag,
  scriptTag,
  backdropText,
  title,
  subtitle,
  align = "center",
  className = "",
}: SectionHeaderProps) {
  return (
    <div
      className={`relative mb-12 md:mb-16 ${
        align === "center" ? "text-center" : "text-left"
      } ${className}`}
    >
      {/* Subtle Backdrop Watermark */}
      {backdropText && (
        <div
          aria-hidden="true"
          className="absolute -top-10 sm:-top-14 left-1/2 -translate-x-1/2 w-full text-center pointer-events-none select-none -z-10 overflow-hidden"
        >
          <span className="font-display text-[14vw] sm:text-[16vw] lg:text-[14vw] leading-none font-black text-white/[0.02] uppercase tracking-wider block drop-shadow-sm">
            {backdropText}
          </span>
        </div>
      )}

      {/* Script Tag */}
      {scriptTag && (
        <span className="font-script text-3xl sm:text-4xl text-white/70 italic -mb-1 block transform -rotate-2 select-none">
          {scriptTag}
        </span>
      )}

      {/* Frosted Liquid Glass Pill Badge */}
      {tag && (
        <div
          className={`inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/[0.06] border border-white/15 rounded-full text-xs font-mono font-medium text-white/90 mb-3 tracking-wider uppercase backdrop-blur-xl shadow-sm ${
            align === "center" ? "mx-auto" : ""
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-cyber-cyan shadow-[0_0_8px_#00f0ff] animate-pulse" />
          <span>{tag}</span>
        </div>
      )}

      {/* Main Section Headline */}
      <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-[1.08] tracking-tight mb-4 drop-shadow-md">
        {title}
      </h2>

      {/* Subtitle */}
      {subtitle && (
        <p className="text-sm sm:text-base text-white/60 max-w-2xl mx-auto leading-relaxed font-sans">
          {subtitle}
        </p>
      )}
    </div>
  );
}
