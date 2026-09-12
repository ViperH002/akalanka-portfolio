"use client";

import React from "react";
import { AssistantState } from "@/types/ai";

interface AssistantStatusProps {
  state: AssistantState;
  className?: string;
}

export const AssistantStatus: React.FC<AssistantStatusProps> = ({ state, className = "" }) => {
  const getStatusDetails = (s: AssistantState) => {
    switch (s) {
      case "THINKING":
        return {
          label: "ANALYZING TELEMETRY...",
          color: "bg-amber-400 text-amber-300 border-amber-500/30",
          dotColor: "bg-amber-400 shadow-[0_0_8px_#f59e0b]",
          ariaText: "AI assistant is thinking.",
        };
      case "SPEAKING":
        return {
          label: "VOCAL TRANSMISSION ACTIVE",
          color: "bg-cyber-cyan/10 text-cyber-cyan border-cyber-cyan/40",
          dotColor: "bg-cyber-cyan shadow-[0_0_8px_#00f0ff] animate-pulse",
          ariaText: "AI assistant is speaking.",
        };
      case "ERROR":
        return {
          label: "CORE WARNING",
          color: "bg-red-500/10 text-red-400 border-red-500/40",
          dotColor: "bg-red-500 shadow-[0_0_8px_#ef4444]",
          ariaText: "AI assistant encountered an error.",
        };
      case "OFFLINE":
        return {
          label: "STANDBY / OFFLINE",
          color: "bg-gray-800 text-gray-400 border-gray-700",
          dotColor: "bg-gray-500",
          ariaText: "AI assistant is offline.",
        };
      case "IDLE":
      default:
        return {
          label: "NEURAL CORE READY",
          color: "bg-cyber-green/10 text-cyber-green border-cyber-green/30",
          dotColor: "bg-cyber-green shadow-[0_0_8px_#00ff88]",
          ariaText: "AI assistant is online and ready.",
        };
    }
  };

  const details = getStatusDetails(state);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Screen reader notification */}
      <span className="sr-only" aria-live="polite">
        {details.ariaText}
      </span>

      {/* Visual Badge */}
      <div
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[11px] font-mono tracking-wider transition-colors duration-300 ${details.color}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${details.dotColor}`} />
        <span>{details.label}</span>
      </div>
    </div>
  );
};
