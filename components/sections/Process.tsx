import { processStepsData } from "@/data/process";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function Process() {
  return (
    <section id="process" className="py-24 relative z-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader
          backdropText="WORKFLOW"
          tag="ENGINEERING PROTOCOL"
          title={
            <>
              Precision <span className="text-white">Execution</span> Protocol
            </>
          }
          subtitle="Transparent, methodical, and milestone-driven — from initial blueprinting to production deployment."
        />

        <div className="max-w-3xl mx-auto relative flex flex-col gap-6">
          {/* Subtle Liquid Glass Vertical Connector Line */}
          <div
            className="absolute left-8 top-10 bottom-10 w-0.5 bg-gradient-to-b from-white/30 via-white/10 to-transparent hidden sm:block pointer-events-none"
            aria-hidden="true"
          />

          {processStepsData.map((step) => (
            <div
              key={step.step}
              className="liquid-glass-card rounded-[28px] p-6 sm:p-8 flex flex-col sm:flex-row items-start gap-6 relative group transition-all duration-300 select-none"
            >
              {/* Step Number Badge */}
              <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-white/[0.08] border border-white/15 flex items-center justify-center font-sans text-xl font-bold text-white flex-shrink-0 z-10 group-hover:scale-105 group-hover:bg-white group-hover:text-black group-hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all duration-300 backdrop-blur-xl">
                {step.step}
              </div>

              {/* Step Content */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg sm:text-xl font-bold text-white font-sans tracking-tight">
                    {step.title}
                  </h3>
                  <span className="font-mono text-[10px] text-white/50 uppercase tracking-widest hidden sm:inline-block px-3 py-1 rounded-full bg-white/[0.04] border border-white/10">
                    STAGE {step.step}
                  </span>
                </div>
                <p className="text-white/60 text-sm sm:text-base leading-relaxed font-sans">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
