import { packagesData } from "@/data/packages";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Check, Sparkles } from "lucide-react";

export function Packages() {
  const packages = packagesData;

  // Ambient chromatic reflections for each card
  const getAmbientGlow = (index: number) => {
    switch (index) {
      case 0:
        return (
          <div
            aria-hidden="true"
            className="absolute top-1/4 -right-12 w-48 h-48 bg-emerald-400/15 rounded-full blur-[60px] pointer-events-none"
          />
        );
      case 1:
        return (
          <div
            aria-hidden="true"
            className="absolute top-8 -right-10 w-52 h-52 bg-rose-500/15 rounded-full blur-[65px] pointer-events-none"
          />
        );
      case 2:
      default:
        return (
          <div
            aria-hidden="true"
            className="absolute bottom-16 -left-10 w-48 h-48 bg-purple-500/15 rounded-full blur-[65px] pointer-events-none"
          />
        );
    }
  };

  return (
    <section id="packages" className="py-28 relative z-10 overflow-hidden">
      {/* Soft Ambient Background Mesh */}
      <div
        aria-hidden="true"
        className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none -z-10"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-1/4 right-1/4 w-[550px] h-[550px] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none -z-10"
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <SectionHeader
          backdropText="PRICING"
          tag="DEPLOYMENT PACKAGES"
          title={
            <>
              Liquid Glass <span className="text-white">Deployment</span> Tiers
            </>
          }
          subtitle="Fixed-price deployment tiers with zero hidden fees. Includes full intellectual property rights, spotless codebase, and post-launch warranty."
        />

        {/* 3-Column Liquid Glass Card Deck */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch pt-6 sm:pt-8">
          {packages.map((pkg, idx) => (
            <div
              key={pkg.id}
              className={`relative rounded-[32px] sm:rounded-[36px] p-8 sm:p-9 liquid-glass-card flex flex-col justify-between select-none ${
                pkg.isFeatured ? "border-white/30 shadow-[0_0_50px_rgba(255,255,255,0.08)]" : ""
              }`}
            >
              {/* Internal Chromatic Liquid Glow Reflection (Clipped to Card Radius) */}
              <div className="absolute inset-0 rounded-[32px] sm:rounded-[36px] overflow-hidden pointer-events-none">
                {getAmbientGlow(idx)}
                <div className="absolute inset-0 rounded-[32px] sm:rounded-[36px] border border-white/10" />
              </div>

              {/* "MOST POPULAR" Floating Badge on Featured Card - Fully Unclipped */}
              {pkg.isFeatured && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-white text-black text-[11px] font-bold uppercase tracking-wider shadow-[0_4px_25px_rgba(255,255,255,0.5)] whitespace-nowrap flex items-center gap-1.5 z-30 pointer-events-none">
                  <Sparkles size={11} className="text-black fill-black" />
                  <span>{pkg.badge || "MOST POPULAR"}</span>
                </div>
              )}

              {/* Card Header & Content */}
              <div className="relative z-10">
                {/* Plan Tier Title */}
                <h3 className="text-2xl font-normal text-white font-sans tracking-tight mb-1">
                  {pkg.tier}
                </h3>

                {/* Big Bold Price & Period */}
                <div className="flex items-baseline gap-1 my-3">
                  <span className="text-4xl sm:text-5xl font-bold text-white tracking-tight font-sans">
                    {pkg.currency || "$"}{pkg.price.toLocaleString()}
                  </span>
                  <span className="text-xs font-sans text-white/50 ml-1.5">
                    / project
                  </span>
                </div>

                {/* Subtitle description */}
                <p className="text-xs sm:text-[13px] text-white/60 leading-relaxed font-sans mb-8">
                  {pkg.description}
                </p>

                {/* Feature List with Circular Frosted Checkmarks */}
                <ul className="space-y-3.5 mb-10">
                  {pkg.features?.map((feature, fIdx) => (
                    <li
                      key={fIdx}
                      className={`flex items-center gap-3 text-xs sm:text-[13px] font-sans leading-relaxed ${
                        feature.included ? "text-white/85" : "text-white/35 opacity-25"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                          feature.included
                            ? "bg-white/[0.08] border border-white/10 text-white/80 shadow-sm"
                            : "bg-white/[0.03] text-white/20 border border-white/5"
                        }`}
                      >
                        <Check size={11} strokeWidth={2.5} />
                      </div>
                      <span>{feature.text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bottom Capsule Pill Action Button */}
              <div className="relative z-10 pt-4">
                <a
                  href="#contact"
                  className="w-full py-3.5 rounded-full bg-white hover:bg-neutral-100 text-black font-semibold text-sm tracking-tight text-center block shadow-[0_4px_20px_rgba(255,255,255,0.18)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 font-sans"
                >
                  {pkg.ctaText || "Get Started"}
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Bespoke Proposal Note */}
        <div className="mt-14 text-center">
          <p className="text-xs sm:text-sm font-sans text-white/50">
            Need a bespoke architecture or custom scale?{" "}
            <a
              href="#contact"
              className="text-white font-semibold underline underline-offset-4 hover:text-cyber-cyan transition-colors"
            >
              Transmit specifications
            </a>{" "}
            for a tailored proposal.
          </p>
        </div>
      </div>
    </section>
  );
}
