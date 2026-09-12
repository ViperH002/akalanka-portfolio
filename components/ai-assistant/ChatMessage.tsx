"use client";

import React from "react";
import { Play, Pause, Loader2, AlertCircle, Volume2 } from "lucide-react";
import { ChatMessage as ChatMessageType } from "@/types/ai";

interface ChatMessageProps {
  message: ChatMessageType;
  isPlayingThisAudio: boolean;
  onPlayAudio: (msg: ChatMessageType) => void;
  onPauseAudio: () => void;
  className?: string;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  isPlayingThisAudio,
  onPlayAudio,
  onPauseAudio,
  className = "",
}) => {
  const isUser = message.role === "user";
  const isSystem = message.role === "system";

  if (isSystem) {
    return (
      <div className="flex justify-center my-3 text-[11px] font-mono text-white/40">
        <span className="px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-md">
          {message.content}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`flex w-full my-2.5 ${
        isUser ? "justify-end" : "justify-start"
      } ${className}`}
    >
      <div
        className={`relative max-w-[85%] sm:max-w-[75%] px-4 sm:px-5 py-3.5 transition-all ${
          isUser
            ? "bg-white/[0.14] text-white rounded-[22px] rounded-br-sm border border-white/10 shadow-[0_8px_25px_rgba(0,0,0,0.3)] backdrop-blur-xl"
            : "bg-white/[0.07] text-white/90 rounded-[22px] rounded-bl-sm border border-white/[0.08] shadow-[0_8px_25px_rgba(0,0,0,0.25)] backdrop-blur-xl"
        }`}
      >
        {/* Message Text Content */}
        <p className="whitespace-pre-wrap break-words font-sans text-xs sm:text-[13.5px] leading-relaxed select-text">
          {message.content}
        </p>

        {/* Footer: Audio listen action (for bot) & embedded timestamp */}
        <div
          className={`flex items-center gap-2 mt-2 pt-1 border-t border-white/[0.06] ${
            isUser ? "justify-end" : "justify-between"
          }`}
        >
          {/* Bot Voice Controls */}
          {!isUser && (
            <div className="flex items-center gap-2 text-[10px] font-mono">
              {message.isAudioLoading ? (
                <span className="flex items-center gap-1.5 text-red-400">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span className="text-[10px]">VOICE SYNTH...</span>
                </span>
              ) : message.audioError ? (
                <span className="flex items-center gap-1 text-red-400/80" title={message.audioError}>
                  <AlertCircle className="w-3 h-3" />
                  <span className="text-[10px]">OFFLINE</span>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    if (isPlayingThisAudio) {
                      onPauseAudio();
                    } else {
                      onPlayAudio(message);
                    }
                  }}
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] transition-all ${
                    isPlayingThisAudio
                      ? "bg-red-500/20 text-red-400 border border-red-500/40"
                      : "bg-white/[0.06] hover:bg-white/[0.12] text-white/60 hover:text-white border border-white/[0.06]"
                  }`}
                  aria-label={isPlayingThisAudio ? "Pause voice" : "Listen to response"}
                >
                  {isPlayingThisAudio ? (
                    <>
                      <Pause className="w-2.5 h-2.5 fill-red-400" />
                      <span>PAUSE</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-2.5 h-2.5" />
                      <span>LISTEN</span>
                    </>
                  )}
                </button>
              )}
            </div>
          )}

          {/* Embedded Timestamp */}
          <span className="text-[10px] font-mono text-white/40 tracking-wider">
            {message.timestamp}
          </span>
        </div>
      </div>
    </div>
  );
};
