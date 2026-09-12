import { ContactForm } from "@/components/forms/ContactForm";
import { Clock, CheckCircle, Shield } from "lucide-react";

export function ContactSection() {
  return (
    <section id="contact" className="py-24 relative z-10 overflow-hidden">
      {/* Giant Watermark Backdrop Text */}
      <div
        aria-hidden="true"
        className="absolute top-10 left-1/2 -translate-x-1/2 w-full text-center pointer-events-none select-none -z-10 overflow-hidden"
      >
        <span className="font-display text-[15vw] sm:text-[18vw] leading-none font-black text-white/[0.02] uppercase tracking-wider block drop-shadow-sm">
          CONTACT
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left Column: Heading & Value Proposition */}
          <div className="flex flex-col">
            <span className="font-script text-3xl sm:text-4xl text-white/70 italic -mb-1 block transform -rotate-2 select-none">
              Let&apos;s Connect
            </span>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/[0.06] border border-white/15 rounded-full text-xs font-mono font-medium text-white/90 mb-4 tracking-wider uppercase self-start backdrop-blur-xl">
              <span className="w-1.5 h-1.5 rounded-full bg-cyber-cyan animate-pulse shadow-[0_0_8px_#00f0ff]" />
              <span>TRANSMISSION LINK</span>
            </div>

            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.08] tracking-tight mb-6">
              Initiate <span className="text-white">Project</span> Protocol
            </h2>

            <p className="text-base sm:text-lg text-white/60 leading-relaxed mb-8 font-sans">
              Transmit your system requirements and project specifications directly. Expect technical analysis, architectural roadmap, and a tailored timeline within hours.
            </p>

            {/* Highlights in Frosted Glass Badges */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3.5 text-sm sm:text-base font-sans text-white/80">
                <div className="w-10 h-10 rounded-full bg-white/[0.08] border border-white/15 flex items-center justify-center text-white flex-shrink-0 shadow-sm">
                  <Clock size={18} />
                </div>
                <span>DIRECT RESPONSE &lt; 1 HOUR</span>
              </div>

              <div className="flex items-center gap-3.5 text-sm sm:text-base font-sans text-white/80">
                <div className="w-10 h-10 rounded-full bg-white/[0.08] border border-white/15 flex items-center justify-center text-white flex-shrink-0 shadow-sm">
                  <CheckCircle size={18} />
                </div>
                <span>ARCHITECTURAL CONSULTATION &amp; FEASIBILITY REVIEW</span>
              </div>

              <div className="flex items-center gap-3.5 text-sm sm:text-base font-sans text-white/80">
                <div className="w-10 h-10 rounded-full bg-white/[0.08] border border-white/15 flex items-center justify-center text-white flex-shrink-0 shadow-sm">
                  <Shield size={18} />
                </div>
                <span>FULL IP OWNERSHIP &amp; MUTUAL NDA SECURED</span>
              </div>
            </div>
          </div>

          {/* Right Column: Liquid Glass Contact Form */}
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
