"use client";

import React from "react";
import { Volume2, VolumeX, Square, Mic, MicOff } from "lucide-react";
import { STTOptions } from "@/types/ai";

interface VoiceButtonProps {
  isSpeaking: boolean;
  autoSpeak: boolean;
  onToggleAutoSpeak: () => void;
  onStopSpeaking: () => void;
  // Extensible Speech-to-Text hooks for future microphone input
  isListening?: boolean;
  onStartListening?: (options?: STTOptions) => void;
  onStopListening?: () => void;
  supportsSTT?: boolean;
  className?: string;
}

export const VoiceButton: React.FC<VoiceButtonProps> = ({
  isSpeaking,
  autoSpeak,
  onToggleAutoSpeak,
  onStopSpeaking,
  isListening = false,
  onStartListening,
  onStopListening,
  supportsSTT = false,
  className = "",
}) => {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      {/* If speaking, prioritize STOP SPEAKING button */}
      {isSpeaking ? (
        <button
          type="button"
          onClick={onStopSpeaking}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-400 text-xs font-mono transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500/50"
          aria-label="Stop vocal transmission"
          title="Stop speech"
        >
          <Square className="w-3.5 h-3.5 fill-red-400 animate-pulse" />
          <span className="hidden sm:inline">STOP AUDIO</span>
        </button>
      ) : (
        /* Global Auto-Speak Audio Output Toggle */
        <button
          type="button"
          onClick={onToggleAutoSpeak}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-mono transition-all duration-200 focus:outline-none focus:ring-2 ${
            autoSpeak
              ? "bg-cyber-cyan/15 hover:bg-cyber-cyan/25 border-cyber-cyan/40 text-cyber-cyan focus:ring-cyber-cyan/50 shadow-[0_0_10px_rgba(0,240,255,0.15)]"
              : "bg-background-tertiary/60 hover:bg-background-tertiary border-border-subtle text-content-tertiary hover:text-content-secondary focus:ring-brand-blue/50"
          }`}
          aria-label={autoSpeak ? "Disable automated speech output" : "Enable automated speech output"}
          title={autoSpeak ? "Voice output enabled" : "Voice output muted"}
        >
          {autoSpeak ? (
            <>
              <Volume2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">VOICE ON</span>
            </>
          ) : (
            <>
              <VolumeX className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">VOICE MUTED</span>
            </>
          )}
        </button>
      )}

      {/* Future Speech-to-Text Microphone Integration Button */}
      {supportsSTT && (
        <button
          type="button"
          onClick={isListening ? onStopListening : () => onStartListening?.()}
          className={`p-1.5 rounded-lg border text-xs transition-all duration-200 focus:outline-none focus:ring-2 ${
            isListening
              ? "bg-cyber-green/20 border-cyber-green/50 text-cyber-green animate-pulse focus:ring-cyber-green/50"
              : "bg-background-tertiary/60 hover:bg-background-tertiary border-border-subtle text-content-tertiary hover:text-content-secondary focus:ring-brand-blue/50"
          }`}
          aria-label={isListening ? "Stop listening" : "Start voice input (Speech to Text)"}
          title={isListening ? "Listening..." : "Microphone input"}
        >
          {isListening ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
        </button>
      )}
    </div>
  );
};
