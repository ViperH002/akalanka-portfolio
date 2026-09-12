"use client";

import { useState } from "react";
import Image from "next/image";
import { useAppStore } from "@/lib/store";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { DeployedArchitecture } from "@/types";

function renderProjectMockup(type?: DeployedArchitecture["type"]) {
  switch (type) {
    case "saas":
      return (
        <div className="portfolio-mockup">
          <div className="mockup-bar">
            <span />
            <span />
            <span />
          </div>
          <div className="mockup-content">
            <div className="mockup-sidebar" />
            <div className="mockup-main">
              <div className="mockup-chart" />
              <div className="mockup-cards">
                <div className="mockup-mini-card" />
                <div className="mockup-mini-card" />
                <div className="mockup-mini-card" />
              </div>
            </div>
          </div>
        </div>
      );
    case "ecommerce":
      return (
        <div className="portfolio-mockup">
          <div className="mockup-bar">
            <span />
            <span />
            <span />
          </div>
          <div className="mockup-content mockup-ecommerce">
            <div className="mockup-hero-block" />
            <div className="mockup-products">
              <div className="mockup-product" />
              <div className="mockup-product" />
              <div className="mockup-product" />
              <div className="mockup-product" />
            </div>
          </div>
        </div>
      );
    case "landing":
      return (
        <div className="portfolio-mockup">
          <div className="mockup-bar">
            <span />
            <span />
            <span />
          </div>
          <div className="mockup-content mockup-landing">
            <div className="mockup-nav-bar" />
            <div className="mockup-hero-text" />
            <div className="mockup-hero-text short" />
            <div className="mockup-cta-btn" />
            <div className="mockup-features-row">
              <div className="mockup-feature-box" />
              <div className="mockup-feature-box" />
              <div className="mockup-feature-box" />
            </div>
          </div>
        </div>
      );
    case "realestate":
      return (
        <div className="portfolio-mockup">
          <div className="mockup-bar">
            <span />
            <span />
            <span />
          </div>
          <div className="mockup-content mockup-realestate">
            <div className="mockup-map-area" />
            <div className="mockup-listing-cards">
              <div className="mockup-listing" />
              <div className="mockup-listing" />
            </div>
          </div>
        </div>
      );
    default:
      return null;
  }
}

export function Portfolio() {
  const { projects } = useAppStore();
  const [selectedVideo, setSelectedVideo] = useState<{ url: string; title: string } | null>(null);

  return (
    <section id="portfolio" className="py-24 relative z-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader
          backdropText="WORKS"
          scriptTag="Recent Creations"
          tag="DEPLOYED ARCHITECTURES"
          title={
            <>
              Featured <span className="text-red-500">Live Productions</span>
            </>
          }
          subtitle="Enterprise-grade production web applications engineered for global scalability, high throughput, and maximum conversion rates."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <div
              key={project.id}
              className="portfolio-card rounded-[32px] liquid-glass-card overflow-hidden flex flex-col justify-between group transition-all duration-300 relative select-none"
            >
              {/* Media Preview Container */}
              <div
                className="h-64 flex items-center justify-center relative overflow-hidden border-b border-white/10 bg-black/60"
                style={{ background: project.imageUrl ? undefined : project.gradient }}
              >
                {project.imageUrl ? (
                  <Image
                    src={project.imageUrl}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                  />
                ) : (
                  renderProjectMockup(project.type)
                )}

                {/* Top Overlay Badges */}
                <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
                  <span className="px-3 py-1 rounded-full bg-black/70 border border-white/15 font-mono text-[10px] text-white/90 uppercase tracking-wider backdrop-blur-md">
                    ARCH // 0{index + 1}
                  </span>
                  {project.client && (
                    <span className="px-3 py-1 rounded-full bg-black/60 border border-white/10 font-mono text-[10px] text-white/70 backdrop-blur-md">
                      {project.client}
                    </span>
                  )}
                </div>

                {/* Video Play Button if Demo Video is available */}
                {project.videoUrl && (
                  <button
                    onClick={() => setSelectedVideo({ url: project.videoUrl!, title: project.title })}
                    className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-white text-black hover:bg-neutral-100 flex items-center justify-center shadow-2xl shadow-white/30 backdrop-blur-md border border-white/30 transition-all transform hover:scale-110 cursor-pointer z-10"
                    title="Watch Architecture Demo Video"
                  >
                    <span className="text-xl ml-0.5">▶</span>
                  </button>
                )}
              </div>

              {/* Info Container */}
              <div className="p-7 sm:p-8 flex flex-col justify-between flex-1 space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-white/90 transition-colors font-sans tracking-tight">
                    {project.title}
                  </h3>
                  <p className="text-white/60 text-sm leading-relaxed mt-2.5 font-sans">
                    {project.description}
                  </p>
                </div>

                {/* Tech Stack & External Links */}
                <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex flex-wrap gap-1.5">
                    {(project.languages || project.tags || []).map((tag, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-full text-[11px] font-mono text-white/70 bg-white/[0.05] border border-white/10"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 shrink-0">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-sans font-semibold text-white hover:underline flex items-center gap-1 transition-colors"
                      >
                        Live Preview ↗
                      </a>
                    )}
                    {project.videoUrl && (
                      <button
                        onClick={() => setSelectedVideo({ url: project.videoUrl!, title: project.title })}
                        className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-neutral-300 hover:text-white transition-all cursor-pointer"
                      >
                        Video Demo
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Video Modal Player */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg">
          <div className="w-full max-w-4xl rounded-2xl bg-[#0d0714] border border-red-500/40 p-5 shadow-2xl space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <h4 className="text-sm font-mono font-bold text-white tracking-wide">
                  SYSTEM DEMO // {selectedVideo.title}
                </h4>
              </div>
              <button
                onClick={() => setSelectedVideo(null)}
                className="text-neutral-400 hover:text-white font-mono text-xs px-2 py-1 rounded-lg bg-white/5"
              >
                ✕ Close Stream
              </button>
            </div>
            <div className="rounded-xl overflow-hidden bg-black flex items-center justify-center">
              <video
                src={selectedVideo.url}
                controls
                autoPlay
                className="w-full max-h-[75vh] object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
