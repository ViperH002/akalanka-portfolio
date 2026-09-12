"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { useAppStore } from "@/lib/store";

export function Hero() {
  const { settings } = useAppStore();
  const [stats, setStats] = useState({ exp: 0, projects: 0, clients: 0 });

  const targetExp = settings?.experienceYears ?? 3;
  const targetProjects = settings?.projectsCompleted ?? 40;
  const targetClients = settings?.happyClients ?? 20;

  useEffect(() => {
    let startTimestamp: number | null = null;
    const duration = 1800;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);

      setStats({
        exp: Math.floor(easeOut * targetExp),
        projects: Math.floor(easeOut * targetProjects),
        clients: Math.floor(easeOut * targetClients),
      });

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setStats({ exp: targetExp, projects: targetProjects, clients: targetClients });
      }
    };

    const animId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(animId);
  }, [targetExp, targetProjects, targetClients]);

  const handleSmoothScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    targetId: string
  ) => {
    e.preventDefault();
    const target = document.querySelector(targetId);
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

  return (
    <header
      id="hero"
      className="min-h-screen relative flex flex-col justify-between pt-24 pb-12 px-6 sm:px-10 lg:px-16 overflow-hidden z-10 select-none"
    >
      {/* Giant Red Backdrop Typography: PORTFOLIO */}
      <div className="absolute top-10 sm:top-14 left-1/2 -translate-x-1/2 w-full text-center pointer-events-none select-none z-0 overflow-hidden">
        <span className="font-display text-[21vw] sm:text-[22vw] lg:text-[23vw] leading-none font-black text-[#d61e2f]/45 tracking-wider uppercase drop-shadow-[0_0_100px_rgba(214,30,47,0.5)] transition-all">
          PORTFOLIO
        </span>
      </div>

      {/* Atmospheric Crimson Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#d61e2f]/15 rounded-full blur-[160px] pointer-events-none -z-10" />

      {/* Top Micro-Header Bar inside Hero */}
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between relative z-10 pt-2 pb-6">
        {/* Top Left Title */}
        <div className="flex flex-col">
          <span className="text-red-500 font-bold text-xs sm:text-sm uppercase tracking-widest leading-tight">
            {settings.subtitle ? settings.subtitle.split("&")[0]?.trim() || "WEB DESIGNER" : "WEB DESIGNER"}
          </span>
          <span className="text-red-500/80 font-medium text-xs sm:text-sm uppercase tracking-widest leading-tight">
            DIGITAL ARCHITECT
          </span>
        </div>

        {/* Top Right Availability Status */}
        {settings.availableForFreelance && (
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-pill border border-white/10 text-white/80 font-mono text-[11px] sm:text-xs uppercase tracking-wider shadow-sm">
            <span>AVAILABLE FOR FREELANCE</span>
            <span className="text-red-500 text-sm font-bold animate-pulse">✦</span>
          </div>
        )}
      </div>

      {/* Main Hero Body Grid (Left Info - Center Character Area - Right Metrics) */}
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 items-center my-auto relative z-10 py-6">
        
        {/* Left Column: Intro, Name, Bio, Badges (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-start text-left">
          {/* Cursive Script Intro */}
          <span className="font-script text-3xl sm:text-4xl text-white/95 italic -mb-2 transform -rotate-3 select-none drop-shadow-md">
            Hello, I&apos;m
          </span>

          {/* Massive Condensed Headline Name */}
          <h1 className="font-display text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-black uppercase tracking-tight text-white leading-[0.88] my-2 drop-shadow-2xl">
            {settings.headlineName1 && settings.headlineName1 !== "RAYHAN" ? settings.headlineName1 : "AKALANKA"}
            <br />
            {settings.headlineName2 && settings.headlineName2 !== "ADITYA" ? settings.headlineName2 : "EGODAWATTE"}
          </h1>

          {/* Crimson Subtitle */}
          <p className="text-red-500 font-bold text-sm sm:text-base uppercase tracking-widest font-sans mt-2 mb-4">
            {settings.subtitle || "WEB DESIGNER & UI/UX CREATOR"}
          </p>

          {/* Descriptive Bio Paragraph */}
          <p className="text-content-secondary text-sm sm:text-base leading-relaxed max-w-md mb-6 font-sans">
            {settings.bio || "I design and build stylish, user-focused web-experiences that combine creativity with strategy. Passionate about clean design, smooth interactions, and details that make a difference."}
          </p>

          {/* Worldwide Availability Pill */}
          {settings.availableWorldwide && (
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-red-950/50 border border-red-500/30 text-white/90 backdrop-blur-md shadow-lg shadow-red-950/40 mb-8">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_#ef4444]" />
              <span className="font-mono text-xs font-semibold tracking-wider uppercase">
                AVAILABLE WORLDWIDE
              </span>
            </div>
          )}

          {/* Interactive CTAs */}
          <div className="flex flex-wrap items-center gap-3.5">
            <a
              href="#contact"
              onClick={(e) => handleSmoothScroll(e, "#contact")}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold uppercase tracking-wider shadow-lg shadow-red-600/30 hover:shadow-red-600/60 hover:-translate-y-0.5 transition-all duration-300 group"
            >
              <span>Initialize Project</span>
              <ArrowRight
                size={14}
                className="group-hover:translate-x-1 transition-transform"
              />
            </a>
            <a
              href="#portfolio"
              onClick={(e) => handleSmoothScroll(e, "#portfolio")}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl glass-pill hover:bg-white/10 text-white/90 font-mono text-xs font-semibold uppercase tracking-wider border border-white/15 hover:border-red-500/40 hover:-translate-y-0.5 transition-all duration-300"
            >
              <span>Explore Work</span>
            </a>
          </div>
        </div>

        {/* Center Column: Open focal area framing the 3D cybernetic character reveal (3 cols) */}
        <div className="lg:col-span-3 min-h-[180px] lg:min-h-[420px] relative flex items-center justify-center pointer-events-none">
          {/* Subtle Cyber Reticle Frame */}
          <div className="hidden lg:block absolute inset-0 border border-red-500/10 rounded-3xl backdrop-blur-[1px]">
            <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-red-500/60" />
            <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-red-500/60" />
            <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-red-500/60" />
            <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-red-500/60" />
          </div>
        </div>

        {/* Right Column: Floating Badge & Vertical Stats (4 cols) */}
        <div className="lg:col-span-4 flex flex-col items-start lg:items-end justify-between h-full gap-8">
          
          {/* Floating Pill / Quote Widget */}
          <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-white/15 max-w-[280px] backdrop-blur-xl shadow-2xl hover:border-red-500/40 transition-all group">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-500 text-sm flex-shrink-0 group-hover:scale-110 transition-transform shadow-[0_0_12px_rgba(239,68,68,0.3)]">
                ✦
              </div>
              <p className="text-xs text-white/90 leading-snug font-sans">
                Turning ideas into powerful digital experiences.
              </p>
            </div>
          </div>

          {/* Vertical Stats Column */}
          <div className="flex flex-col gap-5 w-full max-w-[240px]">
            {/* Stat 1: Years Experience */}
            <div className="flex items-center gap-4 group">
              <span className="font-display text-5xl sm:text-6xl font-black text-red-500 tracking-tight leading-none min-w-[70px] group-hover:scale-105 transition-transform drop-shadow-[0_0_15px_rgba(239,68,68,0.3)]">
                {stats.exp}+
              </span>
              <div className="flex flex-col">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-white">
                  YEARS
                </span>
                <span className="text-[10px] font-mono uppercase tracking-widest text-content-secondary">
                  EXPERIENCE
                </span>
              </div>
            </div>

            <div className="h-px bg-white/10 w-full" />

            {/* Stat 2: Projects Completed */}
            <div className="flex items-center gap-4 group">
              <span className="font-display text-5xl sm:text-6xl font-black text-red-500 tracking-tight leading-none min-w-[70px] group-hover:scale-105 transition-transform drop-shadow-[0_0_15px_rgba(239,68,68,0.3)]">
                {stats.projects}+
              </span>
              <div className="flex flex-col">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-white">
                  PROJECTS
                </span>
                <span className="text-[10px] font-mono uppercase tracking-widest text-content-secondary">
                  COMPLETED
                </span>
              </div>
            </div>

            <div className="h-px bg-white/10 w-full" />

            {/* Stat 3: Happy Clients */}
            <div className="flex items-center gap-4 group">
              <span className="font-display text-5xl sm:text-6xl font-black text-red-500 tracking-tight leading-none min-w-[70px] group-hover:scale-105 transition-transform drop-shadow-[0_0_15px_rgba(239,68,68,0.3)]">
                {stats.clients}+
              </span>
              <div className="flex flex-col">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-white">
                  HAPPY
                </span>
                <span className="text-[10px] font-mono uppercase tracking-widest text-content-secondary">
                  CLIENTS
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Bottom Scroll Indicator */}
      <div className="w-full flex flex-col items-center gap-2 pt-4 relative z-10 select-none">
        <div className="w-5 h-9 border border-red-500/40 rounded-full relative">
          <div className="w-1 h-2 bg-red-500 rounded-full absolute top-1.5 left-1/2 -translate-x-1/2 animate-scrollWheel shadow-[0_0_8px_#ef4444]" />
        </div>
        <span className="text-[10px] uppercase tracking-widest font-mono text-red-400/80">
          SCROLL TO EXPLORE
        </span>
      </div>
    </header>
  );
}
