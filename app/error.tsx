"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";

export default function GlobalErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[CRITICAL] Uncaught application runtime error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#050209] text-white flex items-center justify-center p-6 relative overflow-hidden select-none">
      {/* Background glow matrix */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-rose-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-lg p-8 sm:p-10 rounded-[32px] bg-[#0c0614]/90 border border-red-500/30 backdrop-blur-2xl shadow-2xl relative space-y-6 text-center">
        {/* Warning Icon */}
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto text-red-400 shadow-lg shadow-red-500/20">
          <AlertTriangle size={32} />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 font-mono text-[10px] uppercase font-bold tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
            NODE_RUNTIME_ANOMALY
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-sans tracking-tight text-white">
            System Interrupted
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 font-sans leading-relaxed">
            The neural interface encountered an unexpected rendering exception. System state has been quarantined to prevent data degradation.
          </p>
        </div>

        {/* Error Details (Safe preview) */}
        <div className="p-3.5 rounded-xl bg-black/60 border border-white/10 text-left font-mono text-xs text-red-300/80 overflow-x-auto">
          <code>{error.message || "Unknown runtime fault detected."}</code>
          {error.digest && (
            <div className="text-[10px] text-neutral-500 mt-1">
              DIGEST: {error.digest}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="w-full sm:flex-1 py-3.5 px-6 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-mono text-xs font-bold tracking-wider uppercase shadow-lg shadow-red-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <RotateCcw size={14} />
            <span>Re-initialize Node</span>
          </button>

          <Link
            href="/"
            className="w-full sm:flex-1 py-3.5 px-6 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-mono text-xs font-medium tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Home size={14} />
            <span>Return Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
