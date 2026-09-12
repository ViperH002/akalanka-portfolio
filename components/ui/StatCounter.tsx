"use client";

import { useEffect, useRef, useState } from "react";

interface StatCounterProps {
  value: number;
  suffix?: string;
  label: string;
  duration?: number;
}

export function StatCounter({
  value,
  suffix = "",
  label,
  duration = 2000,
}: StatCounterProps) {
  const [count, setCount] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const startTime = performance.now();

          const updateCounter = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(value * eased);

            setCount(current);

            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            }
          };

          requestAnimationFrame(updateCounter);
        }
      },
      { threshold: 0.3 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [value, duration]);

  return (
    <div ref={containerRef} className="flex flex-col items-center sm:items-start">
      <div className="flex items-baseline">
        <span className="text-3xl sm:text-4xl font-extrabold text-content-heading tracking-tight">
          {count.toLocaleString()}
        </span>
        <span className="text-xl sm:text-2xl font-bold text-brand-blue ml-1">
          {suffix}
        </span>
      </div>
      <span className="text-xs sm:text-sm text-content-tertiary font-medium mt-1">
        {label}
      </span>
    </div>
  );
}
