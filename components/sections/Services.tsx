import { servicesData } from "@/data/services";
import { SectionHeader } from "@/components/ui/SectionHeader";
import {
  Smartphone,
  Code2,
  ShieldCheck,
  CreditCard,
  SearchCheck,
  CloudCog,
} from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  MonitorSmartphone: <Smartphone size={24} />,
  Code2: <Code2 size={24} />,
  ShieldCheck: <ShieldCheck size={24} />,
  CreditCard: <CreditCard size={24} />,
  SearchCheck: <SearchCheck size={24} />,
  CloudCog: <CloudCog size={24} />,
};

export function Services() {
  return (
    <section id="services" className="py-24 relative z-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader
          backdropText="SERVICES"
          tag="CORE CAPABILITIES"
          title={
            <>
              Engineered for <span className="text-white">Peak Velocity</span> &amp; Scale
            </>
          }
          subtitle="Full stack digital architecture built to convert, scale, and withstand modern enterprise demands."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicesData.map((service, index) => (
            <div
              key={service.id}
              className="group p-8 rounded-[28px] liquid-glass-card relative overflow-hidden flex flex-col justify-between select-none"
            >
              {/* Specular Inner Rim */}
              <div className="absolute inset-0 rounded-[28px] border border-white/10 pointer-events-none" />

              {/* Ambient Glow on Hover */}
              <div className="absolute -top-10 -right-10 w-36 h-36 bg-blue-500/10 rounded-full blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

              <div>
                <div className="flex items-center justify-between mb-6">
                  {/* Frosted Glass Icon Bubble */}
                  <div className="w-12 h-12 rounded-2xl bg-white/[0.08] border border-white/15 flex items-center justify-center text-white group-hover:scale-105 group-hover:bg-white group-hover:text-black group-hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all duration-300 backdrop-blur-xl">
                    {iconMap[service.iconName] || <Code2 size={24} />}
                  </div>
                  <span className="font-mono text-[10px] text-white/50 tracking-widest uppercase px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/10">
                    MOD_{String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-white mb-2.5 font-sans tracking-tight">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-white/60 text-sm leading-relaxed mb-6 font-sans">
                  {service.description}
                </p>
              </div>

              {/* Category Tag Pill */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="inline-block px-3 py-1 rounded-full text-[11px] font-mono text-white/70 bg-white/[0.05] border border-white/10">
                  {service.tag}
                </span>
                <span className="text-xs font-mono text-white/30 group-hover:text-white group-hover:translate-x-1 transition-all">
                  →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
