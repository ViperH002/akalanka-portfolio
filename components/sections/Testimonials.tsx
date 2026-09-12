"use client";

import { useState } from "react";
import { testimonialsData } from "@/data/testimonials";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Star, CheckCircle2, Quote } from "lucide-react";

// Static 3x duplicated array for seamless continuous infinite loop without render-time reallocations
const duplicatedReviews = [
  ...testimonialsData,
  ...testimonialsData,
  ...testimonialsData,
];
const reversedReviews = [...duplicatedReviews].reverse();

export function Testimonials() {
  const [selectedReview, setSelectedReview] = useState<number | null>(null);

  return (
    <section id="testimonials" className="py-24 relative z-10 overflow-hidden select-none">
      {/* Giant Watermark Backdrop Text */}
      <div
        aria-hidden="true"
        className="absolute top-8 left-1/2 -translate-x-1/2 w-full text-center pointer-events-none select-none -z-10 overflow-hidden"
      >
        <span className="font-display text-[16vw] sm:text-[18vw] leading-none font-black text-[#dc2626]/10 uppercase tracking-wider block drop-shadow-[0_0_90px_rgba(220,38,38,0.25)]">
          REVIEWS
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader
          backdropText="REVIEWS"
          scriptTag="What Clients Say"
          tag="CLIENT TRANSMISSIONS"
          title={
            <>
              Client <span className="text-red-500">Feedback</span> Stream
            </>
          }
          subtitle="Continuous real-time stream of verified client reviews from high-growth startups and global enterprises."
        />

        {/* Continuous Infinite Stream - Moving to RIGHT SIDE */}
        <div className="relative w-full overflow-hidden py-4">
          {/* Left & Right Soft Blur Vignette Gradients */}
          <div className="absolute top-0 bottom-0 left-0 w-28 sm:w-44 bg-gradient-to-r from-[#030712] via-[#030712]/90 to-transparent z-20 pointer-events-none" />
          <div className="absolute top-0 bottom-0 right-0 w-28 sm:w-44 bg-gradient-to-l from-[#030712] via-[#030712]/90 to-transparent z-20 pointer-events-none" />

          {/* Row 1: Fast Continuous Stream Moving to RIGHT (GPU Hardware-Accelerated CSS) */}
          <div className="flex overflow-hidden mb-6">
            <div
              className="flex gap-6 w-max animate-matrix-row-right hover:[animation-play-state:paused]"
              style={{ animationDuration: "32s" }}
            >
              {duplicatedReviews.map((review, idx) => (
                <div
                  key={`row1-${review.id}-${idx}`}
                  onClick={() => setSelectedReview(idx % testimonialsData.length)}
                  className="w-[340px] sm:w-[380px] p-7 rounded-[30px] liquid-glass-card border border-white/15 hover:border-white/30 transition-all duration-300 flex flex-col justify-between flex-shrink-0 cursor-pointer group backdrop-blur-3xl select-none"
                >
                  <div>
                    {/* Stars & Rating */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1 text-amber-400">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            fill="currentColor"
                          />
                        ))}
                      </div>
                      <span className="font-mono text-[10px] text-white/80 bg-white/[0.06] border border-white/10 px-2.5 py-0.5 rounded-full font-bold">
                        5.0 ★
                      </span>
                    </div>

                    {/* Quote Text */}
                    <p className="text-white/70 text-sm leading-relaxed italic mb-6 font-sans group-hover:text-white transition-colors">
                      &ldquo;{review.text}&rdquo;
                    </p>
                  </div>

                  {/* Author Card Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white/[0.08] border border-white/15 flex items-center justify-center font-sans text-sm font-bold text-white flex-shrink-0">
                        {review.initials}
                      </div>
                      <div>
                        <strong className="block text-sm font-bold text-white font-sans">
                          {review.author}
                        </strong>
                        <span className="text-xs font-sans text-white/50">
                          {review.role}
                        </span>
                      </div>
                    </div>

                    <CheckCircle2 size={16} className="text-white/60 flex-shrink-0" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Row 2: Secondary Offset Stream also Moving to RIGHT */}
          <div className="flex overflow-hidden">
            <div
              className="flex gap-6 w-max animate-matrix-row-right hover:[animation-play-state:paused]"
              style={{ animationDuration: "40s" }}
            >
              {reversedReviews.map((review, idx) => (
                <div
                  key={`row2-${review.id}-${idx}`}
                  onClick={() => setSelectedReview(idx % testimonialsData.length)}
                  className="w-[340px] sm:w-[380px] p-7 rounded-[30px] liquid-glass-card border border-white/15 hover:border-white/30 transition-all duration-300 flex flex-col justify-between flex-shrink-0 cursor-pointer group backdrop-blur-3xl select-none"
                >
                  <div>
                    {/* Stars & Rating */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1 text-amber-400">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            fill="currentColor"
                          />
                        ))}
                      </div>
                      <span className="font-mono text-[10px] text-white/80 bg-white/[0.06] border border-white/10 px-2.5 py-0.5 rounded-full font-bold">
                        5.0 ★
                      </span>
                    </div>

                    {/* Quote Text */}
                    <p className="text-white/70 text-sm leading-relaxed italic mb-6 font-sans group-hover:text-white transition-colors">
                      &ldquo;{review.text}&rdquo;
                    </p>
                  </div>

                  {/* Author Card Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white/[0.08] border border-white/15 flex items-center justify-center font-sans text-sm font-bold text-white flex-shrink-0">
                        {review.initials}
                      </div>
                      <div>
                        <strong className="block text-sm font-bold text-white font-sans">
                          {review.author}
                        </strong>
                        <span className="text-xs font-sans text-white/50">
                          {review.role}
                        </span>
                      </div>
                    </div>

                    <CheckCircle2 size={16} className="text-white/60 flex-shrink-0" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Interactive Modal View when clicked */}
        {selectedReview !== null && (
          <div
            onClick={() => setSelectedReview(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-6 animate-in fade-in duration-200"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="max-w-xl w-full p-8 sm:p-10 rounded-[32px] liquid-glass-card border border-white/20 shadow-2xl relative select-none transform transition-all"
            >
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                <div className="flex items-center gap-1.5 text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={18} fill="currentColor" />
                  ))}
                  <span className="font-mono text-xs font-bold text-white ml-2">
                    5.0 / 5.0
                  </span>
                </div>
                <button
                  onClick={() => setSelectedReview(null)}
                  className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-xs font-mono text-white transition-colors"
                >
                  CLOSE ✕
                </button>
              </div>

              <Quote size={36} className="text-red-500/20 mb-3" />
              <p className="text-lg sm:text-xl text-white font-medium italic leading-relaxed mb-6 font-sans">
                &ldquo;{testimonialsData[selectedReview].text}&rdquo;
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-red-600 flex items-center justify-center font-display text-lg font-bold text-white shadow-lg shadow-red-600/40">
                    {testimonialsData[selectedReview].initials}
                  </div>
                  <div>
                    <strong className="block text-base font-bold text-white">
                      {testimonialsData[selectedReview].author}
                    </strong>
                    <span className="text-xs font-mono text-content-secondary">
                      {testimonialsData[selectedReview].role}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-mono text-red-400 bg-red-950/40 border border-red-500/30 px-3 py-1 rounded-full">
                  <CheckCircle2 size={13} className="text-red-500" />
                  <span>VERIFIED</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
