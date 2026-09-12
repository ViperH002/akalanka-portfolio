"use client";

import React, { useState } from "react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import {
  FigmaIcon,
  GitHubIcon,
  IsometricCubesIcon,
  TerminalCLIIcon,
  SDKHexIcon,
  GitLabIcon,
  AzureIcon,
  NextjsIcon,
  ReactIcon,
  TypeScriptIcon,
  TailwindIcon,
  NodejsIcon,
  PostgreSQLIcon,
  MongoDBIcon,
  DockerIcon,
  StripeIcon,
  RedisIcon,
} from "./TechIcons";
import { Cpu, Sparkles, Terminal, Layers, Database, Cloud } from "lucide-react";

export type TechCategoryType = "all" | "frontend" | "backend" | "database" | "cloud";

export interface TechMatrixItem {
  id: string;
  name: string;
  category: "frontend" | "backend" | "database" | "cloud" | "core";
  categoryLabel: string;
  role: string;
  description: string;
  color: string;
  glowColor: string;
  icon: React.ComponentType<{ className?: string }>;
  isHero?: boolean;
}

// Full catalogue of technologies engineered into the squircle launchpad
const TECH_ITEMS: Record<string, TechMatrixItem> = {
  figma: {
    id: "figma",
    name: "Figma",
    category: "frontend",
    categoryLabel: "Design System",
    role: "UI/UX & Design Tokens",
    description: "Component design systems, atomic tokens, and fluid responsive wireframes.",
    color: "#F24E1E",
    glowColor: "rgba(242, 78, 30, 0.55)",
    icon: FigmaIcon,
  },
  github: {
    id: "github",
    name: "GitHub",
    category: "cloud",
    categoryLabel: "DevOps & VCS",
    role: "Version Control & Actions",
    description: "Distributed Git workflows, automated CI/CD deployment pipelines, and code auditing.",
    color: "#FFFFFF",
    glowColor: "rgba(255, 255, 255, 0.45)",
    icon: GitHubIcon,
  },
  core: {
    id: "core",
    name: "Full-Stack Core",
    category: "core",
    categoryLabel: "Neural Architecture",
    role: "Isomorphic Architecture",
    description: "Holistic full-stack orchestration combining high-throughput microservices and real-time interfaces.",
    color: "#8C6BFB",
    glowColor: "rgba(140, 107, 251, 0.75)",
    icon: IsometricCubesIcon,
    isHero: true,
  },
  terminal: {
    id: "terminal",
    name: "Terminal CLI",
    category: "backend",
    categoryLabel: "POSIX Runtime",
    role: "Automated Shell & Bash",
    description: "Automated cron daemons, system scripting, network sockets, and container orchestration.",
    color: "#22C55E",
    glowColor: "rgba(34, 197, 94, 0.55)",
    icon: TerminalCLIIcon,
  },
  sdk: {
    id: "sdk",
    name: "SDK Platform",
    category: "cloud",
    categoryLabel: "Developer Tools",
    role: "Type-Safe SDKs & APIs",
    description: "RESTful, GraphQL, and gRPC client generation with automated end-to-end type contracts.",
    color: "#A855F7",
    glowColor: "rgba(168, 85, 247, 0.55)",
    icon: SDKHexIcon,
  },
  gitlab: {
    id: "gitlab",
    name: "GitLab",
    category: "cloud",
    categoryLabel: "DevOps Pipeline",
    role: "Enterprise CI/CD Pipelines",
    description: "Multi-stage automated test suites, container registries, and zero-downtime cluster rollouts.",
    color: "#E24329",
    glowColor: "rgba(226, 67, 41, 0.55)",
    icon: GitLabIcon,
  },
  azure: {
    id: "azure",
    name: "Microsoft Azure",
    category: "cloud",
    categoryLabel: "Cloud Infrastructure",
    role: "Cloud Compute & AKS",
    description: "Elastic cloud VMs, geo-redundant storage, Kubernetes orchestration, and serverless compute.",
    color: "#0078D4",
    glowColor: "rgba(0, 120, 212, 0.55)",
    icon: AzureIcon,
  },
  nextjs: {
    id: "nextjs",
    name: "Next.js 15",
    category: "frontend",
    categoryLabel: "SSR Framework",
    role: "React Server Components",
    description: "Server Actions, incremental static regeneration, streaming SSR, and edge execution.",
    color: "#FFFFFF",
    glowColor: "rgba(255, 255, 255, 0.4)",
    icon: NextjsIcon,
  },
  react: {
    id: "react",
    name: "React 19",
    category: "frontend",
    categoryLabel: "UI Framework",
    role: "Concurrent Virtual DOM",
    description: "Composable component trees, reactive hook lifecycles, and high-performance render engines.",
    color: "#61DAFB",
    glowColor: "rgba(97, 218, 251, 0.55)",
    icon: ReactIcon,
  },
  typescript: {
    id: "typescript",
    name: "TypeScript",
    category: "frontend",
    categoryLabel: "Strict Language",
    role: "Strict Compile-Time Safety",
    description: "Zero-defect runtime guarantees, generic inference, and enterprise code maintainability.",
    color: "#3178C6",
    glowColor: "rgba(49, 120, 198, 0.55)",
    icon: TypeScriptIcon,
  },
  tailwind: {
    id: "tailwind",
    name: "Tailwind CSS",
    category: "frontend",
    categoryLabel: "Design System",
    role: "Utility Design Tokens",
    description: "Atomic design tokens, hardware-accelerated transitions, and liquid-glass styling.",
    color: "#06B6D4",
    glowColor: "rgba(6, 182, 212, 0.55)",
    icon: TailwindIcon,
  },
  nodejs: {
    id: "nodejs",
    name: "Node.js",
    category: "backend",
    categoryLabel: "V8 Engine",
    role: "Event-Driven Asynchronous I/O",
    description: "Non-blocking event loop runtime powering microservices, websockets, and backend APIs.",
    color: "#53A04E",
    glowColor: "rgba(83, 160, 78, 0.55)",
    icon: NodejsIcon,
  },
  postgresql: {
    id: "postgresql",
    name: "PostgreSQL",
    category: "database",
    categoryLabel: "Relational DB",
    role: "ACID Relational Storage",
    description: "Relational modeling, robust index trees, full-text vector search, and JSONB schemas.",
    color: "#336791",
    glowColor: "rgba(51, 103, 145, 0.55)",
    icon: PostgreSQLIcon,
  },
  mongodb: {
    id: "mongodb",
    name: "MongoDB",
    category: "database",
    categoryLabel: "NoSQL Database",
    role: "Distributed Document Stores",
    description: "Dynamic JSON schemas, horizontal sharding, and real-time change stream listeners.",
    color: "#47A248",
    glowColor: "rgba(71, 162, 72, 0.55)",
    icon: MongoDBIcon,
  },
  docker: {
    id: "docker",
    name: "Docker",
    category: "cloud",
    categoryLabel: "Virtualization",
    role: "Containerized Microservices",
    description: "Hermetic container images, compose environments, and lightweight deployable runtimes.",
    color: "#2496ED",
    glowColor: "rgba(36, 150, 237, 0.55)",
    icon: DockerIcon,
  },
  stripe: {
    id: "stripe",
    name: "Stripe API",
    category: "backend",
    categoryLabel: "Fintech Gateway",
    role: "Encrypted Global Billing",
    description: "Zero-trust webhook verification, recurring subscription engines, and automated invoicing.",
    color: "#635BFF",
    glowColor: "rgba(99, 91, 255, 0.55)",
    icon: StripeIcon,
  },
  redis: {
    id: "redis",
    name: "Redis",
    category: "database",
    categoryLabel: "In-Memory Cache",
    role: "Sub-Millisecond Key-Value Store",
    description: "Distributed token bucket rate-limiting, pub/sub communication, and high-speed cache layers.",
    color: "#DC382D",
    glowColor: "rgba(220, 56, 45, 0.55)",
    icon: RedisIcon,
  },
};

type MatrixSlot = { type: "item"; key: string } | { type: "ghost" };

// 3 Staggered Rows configured to reproduce the reference matrix composition
const MATRIX_ROWS: MatrixSlot[][] = [
  // ROW 1: Staggered Top Row (Features GitLab above center, flanked by React, TypeScript, Docker, Redis & Ghost Sockets)
  [
    { type: "ghost" },
    { type: "item", key: "react" },
    { type: "item", key: "typescript" },
    { type: "item", key: "gitlab" }, // Prominent in reference image (Top center)
    { type: "item", key: "docker" },
    { type: "item", key: "redis" },
    { type: "ghost" },
  ],
  // ROW 2: Primary Showcase Row (Direct match to reference image: Figma, GitHub, Hero Purple Cube, Terminal, SDK)
  [
    { type: "ghost" },
    { type: "item", key: "figma" },
    { type: "item", key: "github" },
    { type: "item", key: "core" }, // HERO ISOMETRIC PURPLE TILE
    { type: "item", key: "terminal" },
    { type: "item", key: "sdk" },
    { type: "item", key: "tailwind" },
    { type: "ghost" },
  ],
  // ROW 3: Staggered Bottom Row (Features Azure below center, flanked by Next.js, Node.js, PostgreSQL, MongoDB, Stripe & Ghost Sockets)
  [
    { type: "ghost" },
    { type: "item", key: "nextjs" },
    { type: "item", key: "azure" }, // Prominent in reference image (Bottom center)
    { type: "item", key: "nodejs" },
    { type: "item", key: "postgresql" },
    { type: "item", key: "mongodb" },
    { type: "item", key: "stripe" },
    { type: "ghost" },
  ],
];

const CATEGORY_TABS: { id: TechCategoryType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "all", label: "ALL RUNTIMES", icon: Sparkles },
  { id: "frontend", label: "FRONTEND", icon: Layers },
  { id: "backend", label: "BACKEND", icon: Terminal },
  { id: "database", label: "DATABASE", icon: Database },
  { id: "cloud", label: "CLOUD & TOOLS", icon: Cloud },
];

export function TechStack() {
  const [activeCategory, setActiveCategory] = useState<TechCategoryType>("all");
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const [selectedKey, setSelectedKey] = useState<string>("core");

  const currentItem = hoveredKey
    ? TECH_ITEMS[hoveredKey]
    : TECH_ITEMS[selectedKey] || TECH_ITEMS.core;

  const isMatchCategory = (item: TechMatrixItem) => {
    if (activeCategory === "all") return true;
    if (item.category === "core") return true;
    return item.category === activeCategory;
  };

  return (
    <section id="tech" className="py-24 md:py-32 relative z-10 overflow-hidden">
      {/* Subtle ambient accent glow behind the matrix */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[900px] h-[500px] bg-gradient-to-r from-[#6b47ff]/5 via-transparent to-[#22c55e]/5 blur-[140px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <SectionHeader
          backdropText="STACK"
          tag="TACTILE SQUIRCLE MATRIX"
          title={
            <>
              Engineered With <span className="text-white">Precision</span> Runtimes
            </>
          }
          subtitle="A tactile multi-tiered keyboard matrix of mission-critical technologies built for micro-second latency, zero downtime, and infinite scalability."
        />

        {/* Category Filter Controls */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-12 sm:mb-16">
          {CATEGORY_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeCategory === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveCategory(tab.id)}
                className={`group relative flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs font-mono font-semibold tracking-wider transition-all duration-300 focus:outline-none ${
                  isActive
                    ? "text-white bg-white/[0.12] border border-white/25 shadow-[0_0_20px_rgba(255,255,255,0.15)] scale-[1.03]"
                    : "text-white/50 bg-white/[0.03] hover:bg-white/[0.07] hover:text-white/90 border border-white/5 hover:border-white/15"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 transition-colors ${isActive ? "text-cyber-cyan" : "text-white/40 group-hover:text-white/70"}`} />
                <span>{tab.label}</span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-cyber-cyan shadow-[0_0_8px_#00f0ff] animate-pulse" />
                )}
              </button>
            );
          })}
        </div>

        {/* Auto-Drift Telemetry Indicator */}
        <div className="flex items-center justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.03] border border-white/10 text-[11px] font-mono text-white/50 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-cyber-green shadow-[0_0_6px_#00ff66] animate-pulse" />
            <span>KINETIC MATRIX STREAMING • HOVER TO FREEZE &amp; INSPECT</span>
          </div>
        </div>

        {/* The Tactile Squircle Keycap Kinetic Matrix Container with transparent alpha edge fading */}
        <div className="relative w-full overflow-hidden py-6 select-none group/matrix [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">

          <div className="flex flex-col items-center justify-center gap-4 sm:gap-5 md:gap-6">
            {MATRIX_ROWS.map((row, rowIndex) => {
              // Row 0: play to right, Row 1: play to left, Row 2: play to right
              const animClass =
                rowIndex === 0
                  ? "animate-matrix-row-right"
                  : rowIndex === 1
                  ? "animate-matrix-row-left"
                  : "animate-matrix-row-right-alt";

              // Replicate row 4 times for mathematically seamless infinite marquee loop
              const quadRow = [...row, ...row, ...row, ...row];

              return (
                <div
                  key={`marquee-row-${rowIndex}`}
                  className={`flex items-center gap-3.5 sm:gap-4 md:gap-5 ${animClass} hover:[animation-play-state:paused]`}
                  style={{
                    animationPlayState: hoveredKey ? "paused" : undefined,
                  }}
                >
                  {quadRow.map((slot, slotIndex) => {
                    if (slot.type === "ghost") {
                      return (
                        <div
                          key={`ghost-${rowIndex}-${slotIndex}`}
                          className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-[22px] sm:rounded-[26px] md:rounded-[28px] bg-[#0c0c10]/45 backdrop-blur-sm border border-white/[0.04] shadow-[inset_0_3px_6px_rgba(0,0,0,0.85),inset_0_1px_1px_rgba(255,255,255,0.02)] flex items-center justify-center select-none pointer-events-none shrink-0"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-white/[0.03]" />
                        </div>
                      );
                    }

                    const item = TECH_ITEMS[slot.key];
                    if (!item) return null;

                    const Icon = item.icon;
                    const isHero = !!item.isHero;
                    const matchesCategory = isMatchCategory(item);
                    const isHovered = hoveredKey === item.id;
                    const isSelected = selectedKey === item.id;

                    return (
                      <div
                        key={`slot-${rowIndex}-${slotIndex}-${item.id}`}
                        className="relative flex items-center justify-center shrink-0"
                      >
                        {/* Ambient Floor Underglow (Light spilling onto floor, precisely matching reference) */}
                        <div
                          className="absolute -bottom-3 sm:-bottom-4 left-1/2 -translate-x-1/2 w-[85%] h-8 sm:h-10 rounded-full blur-xl pointer-events-none transition-all duration-300 ease-out"
                          style={{
                            backgroundColor: item.glowColor,
                            opacity: !matchesCategory
                              ? 0.04
                              : isHovered
                              ? 1
                              : isHero
                              ? 0.85
                              : 0.5,
                            transform: `translateX(-50%) scale(${isHovered ? 1.3 : 1})`,
                          }}
                        />

                        {/* Interactive Squircle Keycap Tile with liquid glass backdrop */}
                        <button
                          type="button"
                          onClick={() => setSelectedKey(item.id)}
                          onMouseEnter={() => setHoveredKey(item.id)}
                          onMouseLeave={() => setHoveredKey(null)}
                          className={`relative group flex items-center justify-center select-none cursor-pointer focus:outline-none transition-all duration-200 hover:-translate-y-1.5 hover:scale-105 active:scale-95 ${
                            isHero
                              ? "w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-[22px] sm:rounded-[26px] md:rounded-[28px] bg-gradient-to-br from-[#6842ed]/90 via-[#7d5dfc]/90 to-[#9274fd]/90 backdrop-blur-md border border-white/35 shadow-[0_12px_32px_-4px_rgba(125,93,252,0.65),inset_0_1px_2px_rgba(255,255,255,0.4)]"
                              : "w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-[22px] sm:rounded-[26px] md:rounded-[28px] bg-[#121217]/80 hover:bg-[#16161d]/90 backdrop-blur-md border border-white/[0.09] hover:border-white/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.12),0_8px_20px_rgba(0,0,0,0.6)]"
                          } ${
                            !matchesCategory ? "opacity-25 grayscale-[60%] pointer-events-none" : "opacity-100"
                          } ${isSelected && !isHero ? "ring-2 ring-white/20 border-white/30" : ""}`}
                          aria-label={`${item.name} - ${item.role}`}
                        >
                          {/* Inner Bevel Top Rim Highlight */}
                          {!isHero && (
                            <div className="absolute inset-x-3 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
                          )}

                          {/* Subtle Internal Ambient Color Wash */}
                          {!isHero && (
                            <div
                              className="absolute inset-0 rounded-[inherit] pointer-events-none transition-opacity duration-300"
                              style={{
                                background: `radial-gradient(circle at 50% 120%, ${item.glowColor}, transparent 68%)`,
                                opacity: isHovered ? 0.45 : 0.2,
                              }}
                            />
                          )}

                          {/* Vector SVG Brand Icon */}
                          <div className="relative z-10 transition-transform duration-300 group-hover:scale-110 flex items-center justify-center">
                            <Icon
                              className={
                                isHero
                                  ? "w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 drop-shadow-[0_4px_12px_rgba(0,0,0,0.35)]"
                                  : "w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
                              }
                            />
                          </div>

                          {/* Pulsing indicator on hero */}
                          {isHero && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-white shadow-[0_0_8px_white] animate-ping opacity-75" />
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>

        {/* Dynamic Telemetry HUD / Inspector Card below matrix */}
        <div className="max-w-2xl mx-auto mt-8 sm:mt-10">
          <div
            key={currentItem.id}
            className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#111116]/80 backdrop-blur-xl border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.5)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-2 duration-200"
          >
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center p-2.5 shrink-0"
                style={{
                  backgroundColor: `${currentItem.color}15`,
                  border: `1px solid ${currentItem.color}35`,
                }}
              >
                <currentItem.icon className="w-full h-full object-contain" />
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h3 className="text-base sm:text-lg font-bold text-white tracking-wide">
                    {currentItem.name}
                  </h3>
                  <span
                    className="text-[10px] font-mono px-2 py-0.5 rounded-md uppercase font-bold tracking-wider"
                    style={{
                      backgroundColor: `${currentItem.color}20`,
                      color: currentItem.color === "#FFFFFF" ? "#E2E8F0" : currentItem.color,
                      border: `1px solid ${currentItem.color}40`,
                    }}
                  >
                    {currentItem.categoryLabel}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-white/60 mt-0.5 font-sans leading-relaxed">
                  {currentItem.description}
                </p>
              </div>
            </div>

            <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-white/5 shrink-0">
              <span className="text-[10px] font-mono text-cyber-cyan flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyber-cyan shadow-[0_0_6px_#00f0ff] animate-pulse" />
                PRODUCTION READY
              </span>
              <span className="text-[11px] font-mono text-white/40 mt-1">
                LATENCY &lt; 15MS
              </span>
            </div>
          </div>
        </div>

        {/* Global Architecture Summary Telemetry Dock */}
        <div className="mt-12 pt-8 border-t border-white/[0.06] grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-center">
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
            <div className="text-xl sm:text-2xl font-mono font-bold text-white">16+</div>
            <div className="text-[11px] font-mono text-white/50 uppercase tracking-wider mt-0.5">
              Integrated Runtimes
            </div>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
            <div className="text-xl sm:text-2xl font-mono font-bold text-cyber-cyan">99.99%</div>
            <div className="text-[11px] font-mono text-white/50 uppercase tracking-wider mt-0.5">
              Service Availability
            </div>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
            <div className="text-xl sm:text-2xl font-mono font-bold text-cyber-green">100%</div>
            <div className="text-[11px] font-mono text-white/50 uppercase tracking-wider mt-0.5">
              Strict Type Safety
            </div>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
            <div className="text-xl sm:text-2xl font-mono font-bold text-purple-400">&lt;50ms</div>
            <div className="text-[11px] font-mono text-white/50 uppercase tracking-wider mt-0.5">
              Edge Cold Starts
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TechStack;
