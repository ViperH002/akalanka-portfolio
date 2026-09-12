"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  cyberFramePaths,
  TOTAL_CYBER_FRAMES,
  cyberPhases,
  CyberTelemetryPhase,
} from "@/data/cyberFrames";

export function CyberScrollCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);
  const targetFrameRef = useRef<number>(0);
  const currentFrameRef = useRef<number>(0);
  const animationFrameIdRef = useRef<number | null>(null);
  const isLoopRunningRef = useRef<boolean>(false);

  // Direct DOM refs for telemetry badge to eliminate React re-render churn during scroll
  const syncDisplayRef = useRef<HTMLSpanElement | null>(null);
  const frameDisplayRef = useRef<HTMLSpanElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);

  const [isReady, setIsReady] = useState<boolean>(false);
  const [activePhase, setActivePhase] = useState<CyberTelemetryPhase>(cyberPhases[0]);
  const activePhaseRef = useRef<CyberTelemetryPhase>(cyberPhases[0]);

  // Render an image onto the canvas with cover sizing
  const renderImageToCanvas = useCallback(
    (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, img: HTMLImageElement) => {
      const cw = canvas.width;
      const ch = canvas.height;
      const iw = img.naturalWidth || 1280;
      const ih = img.naturalHeight || 720;

      const scale = Math.max(cw / iw, ch / ih);
      const nw = iw * scale;
      const nh = ih * scale;
      const nx = (cw - nw) / 2;
      const ny = (ch - nh) / 2;

      ctx.drawImage(img, nx, ny, nw, nh);
    },
    []
  );

  // Draw a specific frame with nearest-loaded fallback
  const drawFrame = useCallback(
    (frameIndex: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d", { alpha: false });
      if (!ctx) return;

      const clampedIndex = Math.max(0, Math.min(TOTAL_CYBER_FRAMES - 1, Math.round(frameIndex)));
      let img = imagesRef.current[clampedIndex];

      // If target image is not loaded yet, find the nearest loaded image
      if (!img || !img.complete || img.naturalWidth === 0) {
        for (let offset = 1; offset < TOTAL_CYBER_FRAMES; offset++) {
          const prev = clampedIndex - offset;
          if (prev >= 0 && imagesRef.current[prev]?.complete) {
            img = imagesRef.current[prev];
            break;
          }
          const next = clampedIndex + offset;
          if (next < TOTAL_CYBER_FRAMES && imagesRef.current[next]?.complete) {
            img = imagesRef.current[next];
            break;
          }
        }
      }

      if (img && img.complete && img.naturalWidth > 0) {
        renderImageToCanvas(ctx, canvas, img);
      }
    },
    [renderImageToCanvas]
  );

  // Resize canvas for display & resolution
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const width = window.innerWidth;
    const height = window.innerHeight;

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    drawFrame(currentFrameRef.current);
  }, [drawFrame]);

  // Progressive Priority Frame Loading:
  // Phase A: Load Frame 0 immediately for instant render (no blank screen)
  // Phase B: Load Keyframes (every 5th frame) to give immediate scrubbing capability
  // Phase C: Stream remaining frames in background during idle moments
  useEffect(() => {
    let isMounted = true;
    imagesRef.current = new Array(TOTAL_CYBER_FRAMES).fill(null);

    const loadSingleImage = (index: number): Promise<HTMLImageElement> => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = cyberFramePaths[index];
        img.onload = () => {
          if (isMounted) {
            imagesRef.current[index] = img;
            if (index === 0) {
              drawFrame(0);
              setIsReady(true);
            }
          }
          resolve(img);
        };
        img.onerror = () => resolve(img);
      });
    };

    // 1. First priority: Frame 0
    loadSingleImage(0).then(() => {
      if (!isMounted) return;

      // 2. Second priority: Keyframes spaced across the range (every 5th frame)
      const keyframeIndices: number[] = [];
      for (let i = 5; i < TOTAL_CYBER_FRAMES; i += 5) {
        keyframeIndices.push(i);
      }

      Promise.all(keyframeIndices.map((idx) => loadSingleImage(idx))).then(() => {
        if (!isMounted) return;

        // 3. Third priority: Remaining frames loaded progressively in batches of 4
        const remainingIndices: number[] = [];
        for (let i = 1; i < TOTAL_CYBER_FRAMES; i++) {
          if (i % 5 !== 0) remainingIndices.push(i);
        }

        let currentBatch = 0;
        const batchSize = 4;

        const loadNextBatch = () => {
          if (!isMounted || currentBatch >= remainingIndices.length) return;
          const batch = remainingIndices.slice(currentBatch, currentBatch + batchSize);
          currentBatch += batchSize;

          Promise.all(batch.map((idx) => loadSingleImage(idx))).then(() => {
            if ("requestIdleCallback" in window) {
              (window as any).requestIdleCallback(loadNextBatch, { timeout: 500 });
            } else {
              setTimeout(loadNextBatch, 80);
            }
          });
        };

        if ("requestIdleCallback" in window) {
          (window as any).requestIdleCallback(loadNextBatch, { timeout: 500 });
        } else {
          setTimeout(loadNextBatch, 100);
        }
      });
    });

    return () => {
      isMounted = false;
    };
  }, [drawFrame]);

  // Efficient Lerp loop that pauses automatically when target frame is reached
  const startLoopIfNeeded = useCallback(() => {
    if (isLoopRunningRef.current) return;
    isLoopRunningRef.current = true;

    const updateLoop = () => {
      const diff = targetFrameRef.current - currentFrameRef.current;

      if (Math.abs(diff) > 0.005) {
        currentFrameRef.current += diff * 0.18;
        drawFrame(currentFrameRef.current);

        const currentFrameNum = Math.min(
          TOTAL_CYBER_FRAMES,
          Math.max(1, Math.round(currentFrameRef.current) + 1)
        );

        // Update telemetry badge DOM directly to avoid React re-rendering churn
        if (frameDisplayRef.current) {
          frameDisplayRef.current.textContent = String(currentFrameNum);
        }

        animationFrameIdRef.current = requestAnimationFrame(updateLoop);
      } else {
        // Snap to exact target and sleep RAF loop until next scroll
        currentFrameRef.current = targetFrameRef.current;
        drawFrame(currentFrameRef.current);
        isLoopRunningRef.current = false;
        animationFrameIdRef.current = null;
      }
    };

    animationFrameIdRef.current = requestAnimationFrame(updateLoop);
  }, [drawFrame]);

  // Handle scroll calculation
  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        ticking = false;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (docHeight <= 0) return;

        const progress = Math.max(0, Math.min(1, window.scrollY / docHeight));
        targetFrameRef.current = progress * (TOTAL_CYBER_FRAMES - 1);

        const percent = Math.round(progress * 100);

        // Direct DOM update for top progress bar and badge
        if (progressBarRef.current) {
          progressBarRef.current.style.width = `${percent}%`;
        }
        if (syncDisplayRef.current) {
          syncDisplayRef.current.textContent = `${percent}%`;
        }

        // Update phase only when boundary is crossed
        const matchedPhase =
          cyberPhases.find((p) => progress >= p.range[0] && progress <= p.range[1]) ||
          cyberPhases[cyberPhases.length - 1];

        if (matchedPhase.phase !== activePhaseRef.current.phase) {
          activePhaseRef.current = matchedPhase;
          setActivePhase(matchedPhase);
        }

        // Wake animation loop
        startLoopIfNeeded();
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });
    handleResize();
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", handleResize);
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [handleResize, startLoopIfNeeded]);

  return (
    <>
      {/* Fixed Canvas Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#030712]">
        <canvas
          ref={canvasRef}
          className="w-full h-full object-cover transition-opacity duration-700"
          style={{
            opacity: isReady ? 1 : 0.4,
          }}
        />

        {/* Ambient Vignette & Gradient for Text Contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-[#030712]/80 opacity-90 pointer-events-none" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#030712]/30 to-[#030712]/90 pointer-events-none" />

        {/* Cyber HUD Grid & Scanlines */}
        <div className="absolute inset-0 cyber-scanlines opacity-25 pointer-events-none" />
        <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />

        {/* Left & Right Ambient Glow Bars */}
        <div className="absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-b from-transparent via-red-500/40 to-transparent pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-1 bg-gradient-to-b from-transparent via-rose-600/40 to-transparent pointer-events-none" />
      </div>

      {/* Cyber HUD Floating Telemetry Badge (Desktop & Tablet) */}
      <div className="hidden lg:flex fixed bottom-6 right-6 z-40 items-center gap-4 px-4 py-2.5 rounded-2xl glass-dock border border-red-500/20 shadow-2xl pointer-events-auto select-none">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_#ef4444]" />
          <span className="font-mono text-xs font-semibold text-red-400 tracking-wider">
            {activePhase.name}
          </span>
        </div>
        <div className="w-px h-4 bg-white/15" />
        <div className="font-mono text-xs text-content-secondary">
          SYNC:{" "}
          <span ref={syncDisplayRef} className="text-white font-bold">
            0%
          </span>
        </div>
        <div className="w-px h-4 bg-white/15" />
        <div className="font-mono text-xs text-content-tertiary">
          FRM:{" "}
          <span ref={frameDisplayRef} className="text-red-400 font-bold">
            1
          </span>
          /{TOTAL_CYBER_FRAMES}
        </div>
      </div>

      {/* Top HUD Glass Progress Line */}
      <div className="fixed top-0 left-0 right-0 z-50 h-[3px] bg-white/5 backdrop-blur-md pointer-events-none">
        <div
          ref={progressBarRef}
          className="h-full bg-gradient-to-r from-red-600 via-rose-500 to-red-400 transition-all duration-75 shadow-[0_0_8px_#ef4444]"
          style={{ width: "0%" }}
        />
      </div>
    </>
  );
}
