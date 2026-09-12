"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[CRITICAL ROOT FAILURE] Root layout exception:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-[#050209] text-white min-h-screen flex items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full p-8 rounded-3xl bg-[#0c0614] border border-red-500/30 text-center space-y-4 shadow-2xl">
          <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mx-auto text-xl font-mono">
            !
          </div>
          <h1 className="text-xl font-bold font-mono text-white">SYSTEM LEVEL INTERRUPTION</h1>
          <p className="text-xs text-neutral-400 font-sans">
            A fatal root-level rendering error occurred. Please attempt to recover the session node.
          </p>
          <button
            onClick={() => reset()}
            className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
          >
            RECOVER NODE
          </button>
        </div>
      </body>
    </html>
  );
}
