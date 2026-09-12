"use client";

import { useEffect, useRef } from "react";

export function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: -1000, y: -1000 });
  const currentPos = useRef({ x: -1000, y: -1000 });
  const rafId = useRef<number | null>(null);
  const isRunning = useRef(false);

  useEffect(() => {
    const startAnimation = () => {
      if (isRunning.current) return;
      isRunning.current = true;
      rafId.current = requestAnimationFrame(animate);
    };

    const animate = () => {
      const dx = mousePos.current.x - currentPos.current.x;
      const dy = mousePos.current.y - currentPos.current.y;

      // When settled within epsilon, pause RAF to save CPU cycles
      if (Math.abs(dx) < 0.2 && Math.abs(dy) < 0.2) {
        isRunning.current = false;
        rafId.current = null;
        return;
      }

      currentPos.current.x += dx * 0.08;
      currentPos.current.y += dy * 0.08;

      if (glowRef.current) {
        glowRef.current.style.transform = `translate(${currentPos.current.x - 300}px, ${currentPos.current.y - 300}px)`;
      }

      rafId.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      startAnimation();
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (rafId.current) {
          cancelAnimationFrame(rafId.current);
          rafId.current = null;
          isRunning.current = false;
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <div
      ref={glowRef}
      className="pointer-events-none fixed top-0 left-0 w-[600px] h-[600px] rounded-full z-0 transition-opacity duration-300 hidden md:block"
      style={{
        background: "radial-gradient(circle, rgba(220, 38, 38, 0.09) 0%, rgba(185, 28, 28, 0.04) 40%, transparent 70%)",
        willChange: "transform",
      }}
      aria-hidden="true"
    />
  );
}
