import Link from "next/link";
import {
  footerQuickLinks,
  footerServiceLinks,
  footerConnectLinks,
} from "@/data/navigation";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-16 border-t border-white/10 relative z-10 glass-panel">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand Info */}
          <div className="flex flex-col gap-4">
            <Link
              href="/"
              className="flex items-center gap-3 text-white font-bold text-xl tracking-tight group"
            >
              <div className="w-9 h-9 rounded-xl bg-red-950/40 border border-red-500/30 flex items-center justify-center font-mono text-sm text-red-400 group-hover:border-red-500 group-hover:shadow-[0_0_15px_rgba(239,68,68,0.4)] transition-all backdrop-blur-lg">
                &lt;/&gt;
              </div>
              <span className="font-display text-2xl tracking-wider text-white group-hover:text-red-400 transition-colors">
                DEV.CRAFT
              </span>
            </Link>
            <p className="text-content-secondary text-xs font-mono leading-relaxed max-w-xs">
              Next-generation full stack digital engineering. From cybernetic blueprints to ultra-scalable production deployment.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-red-400 mb-4 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444]" />
              SYSTEM PROTOCOLS
            </h4>
            <ul className="space-y-2.5 font-mono text-xs">
              {footerQuickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-content-secondary hover:text-red-400 hover:translate-x-1 inline-block transition-all duration-200"
                  >
                    // {link.label}
                  </a>
                </li>
              ))}
              <li>
                <Link
                  href="/admin"
                  className="text-red-400/90 hover:text-red-400 hover:translate-x-1 inline-block transition-all duration-200 font-bold"
                >
                  ⚡ Admin Control Center
                </Link>
              </li>
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-red-400 mb-4 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444]" />
              CAPABILITIES
            </h4>
            <ul className="space-y-2.5 font-mono text-xs">
              {footerServiceLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-content-secondary hover:text-red-400 hover:translate-x-1 inline-block transition-all duration-200"
                  >
                    // {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect Links */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-red-400 mb-4 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444]" />
              TELEMETRY &amp; SOCIAL
            </h4>
            <ul className="space-y-2.5 font-mono text-xs">
              {footerConnectLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target={link.href.startsWith("http") ? "_blank" : undefined}
                    rel={
                      link.href.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className="text-content-secondary hover:text-red-400 hover:translate-x-1 inline-block transition-all duration-200"
                  >
                    // {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-content-tertiary gap-4">
          <p>
            &copy; {currentYear} DEVCRAFT DIGITAL ARCHITECTS. ALL RIGHTS RESERVED.
          </p>
          <div className="flex items-center gap-2 text-white/90 px-3 py-1 rounded-full bg-red-950/40 border border-red-500/30">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_#ef4444]" />
            <span>ALL SYSTEMS OPERATIONAL</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
