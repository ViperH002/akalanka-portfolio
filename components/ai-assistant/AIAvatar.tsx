"use client";

import React from "react";
import { motion } from "framer-motion";
import { AssistantState } from "@/types/ai";

interface AIAvatarProps {
  state: AssistantState;
  amplitude?: number; // 0 to 1, provided by Web Audio API visualizer
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const AIAvatar: React.FC<AIAvatarProps> = ({
  state,
  amplitude = 0,
  size = "md",
  className = "",
}) => {
  // Dimensions map
  const sizeMap = {
    sm: "w-10 h-10",
    md: "w-16 h-16",
    lg: "w-24 h-24",
  };

  const coreSizeMap = {
    sm: "w-4 h-4",
    md: "w-7 h-7",
    lg: "w-11 h-11",
  };

  // Color schemes based on state
  const isError = state === "ERROR";
  const isOffline = state === "OFFLINE";
  const isThinking = state === "THINKING";
  const isSpeaking = state === "SPEAKING";

  // Dynamic scale from audio amplitude
  const audioPulseScale = isSpeaking ? 1 + amplitude * 0.4 : 1;
  const audioGlowIntensity = isSpeaking ? 0.4 + amplitude * 0.6 : 0.3;

  return (
    <div
      className={`relative flex items-center justify-center select-none ${sizeMap[size]} ${className}`}
      role="img"
      aria-label={`AI Avatar Core - Current state: ${state}`}
    >
      {/* Outer ambient glow */}
      <motion.div
        className="absolute inset-0 rounded-full blur-md pointer-events-none"
        animate={{
          scale: isSpeaking ? [1, 1.25, 1] : isThinking ? [1, 1.15, 1] : [0.95, 1.05, 0.95],
          opacity: isOffline ? 0.05 : isError ? 0.6 : audioGlowIntensity,
        }}
        transition={{
          repeat: Infinity,
          duration: isThinking ? 1.2 : isSpeaking ? 0.4 : 3,
          ease: "easeInOut",
        }}
        style={{
          background: isError
            ? "radial-gradient(circle, rgba(239, 68, 68, 0.8) 0%, transparent 70%)"
            : isOffline
            ? "radial-gradient(circle, rgba(107, 114, 128, 0.5) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(0, 240, 255, 0.8) 0%, rgba(139, 92, 246, 0.4) 60%, transparent 80%)",
        }}
      />

      {/* Outer rotating cyber ring */}
      <motion.div
        className="absolute inset-0 rounded-full border border-dashed pointer-events-none"
        style={{
          borderColor: isError
            ? "rgba(239, 68, 68, 0.6)"
            : isOffline
            ? "rgba(107, 114, 128, 0.3)"
            : "rgba(0, 240, 255, 0.5)",
          borderWidth: "1.5px",
        }}
        animate={{
          rotate: isThinking ? 360 : isSpeaking ? 180 : 360,
          scale: audioPulseScale,
        }}
        transition={{
          rotate: {
            repeat: Infinity,
            duration: isThinking ? 2 : isSpeaking ? 4 : 12,
            ease: "linear",
          },
          scale: { duration: 0.08 },
        }}
      />

      {/* Middle segmented reactor ring */}
      <motion.div
        className="absolute inset-1.5 rounded-full border border-cyber-purple/40 pointer-events-none"
        animate={{
          rotate: -360,
          opacity: isOffline ? 0.2 : [0.4, 0.9, 0.4],
        }}
        transition={{
          rotate: {
            repeat: Infinity,
            duration: isThinking ? 3 : 16,
            ease: "linear",
          },
          opacity: {
            repeat: Infinity,
            duration: isSpeaking ? 0.5 : 2.5,
            ease: "easeInOut",
          },
        }}
      />

      {/* Inner Central Glowing Core */}
      <motion.div
        className={`relative z-10 rounded-full flex items-center justify-center ${coreSizeMap[size]}`}
        style={{
          background: isError
            ? "radial-gradient(circle, #ef4444 0%, #7f1d1d 100%)"
            : isOffline
            ? "radial-gradient(circle, #4b5563 0%, #1f2937 100%)"
            : "radial-gradient(circle, #00f0ff 0%, #3b82f6 50%, #1e1b4b 100%)",
          boxShadow: isError
            ? "0 0 15px rgba(239, 68, 68, 0.8)"
            : isOffline
            ? "none"
            : "0 0 20px rgba(0, 240, 255, 0.7), inset 0 0 8px rgba(255, 255, 255, 0.8)",
        }}
        animate={{
          scale: isSpeaking
            ? 1 + amplitude * 0.5
            : isThinking
            ? [0.85, 1.15, 0.85]
            : [0.95, 1.05, 0.95],
        }}
        transition={{
          scale: isSpeaking
            ? { duration: 0.05 }
            : { repeat: Infinity, duration: isThinking ? 0.8 : 2.5, ease: "easeInOut" },
        }}
      >
        {/* Core Center Pip */}
        <div
          className="w-1.5 h-1.5 rounded-full bg-white"
          style={{
            boxShadow: isError ? "0 0 6px #ef4444" : "0 0 8px #00f0ff",
          }}
        />
      </motion.div>
    </div>
  );
};
