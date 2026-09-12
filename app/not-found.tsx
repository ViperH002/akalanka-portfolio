import Link from "next/link";
import { ArrowLeft, Terminal } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#050209] text-white flex items-center justify-center p-6 relative overflow-hidden select-none">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-rose-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Cyber HUD Grid */}
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />

      <div className="w-full max-w-md p-8 sm:p-10 rounded-[32px] bg-[#0c0614]/90 border border-white/10 backdrop-blur-2xl shadow-2xl relative space-y-6 text-center">
        {/* Terminal Badge */}
        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-red-400">
          <Terminal size={30} />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 font-mono text-[10px] uppercase font-bold tracking-widest">
            ERROR_CODE: 404_NOT_FOUND
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-sans tracking-tight text-white">
            Node Desynchronized
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 font-sans leading-relaxed">
            The requested coordinate does not exist in this neural network topology or has been decommissioned.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/"
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-mono text-xs font-bold tracking-wider uppercase shadow-lg shadow-red-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <ArrowLeft size={14} />
            <span>Return to Command Core</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
