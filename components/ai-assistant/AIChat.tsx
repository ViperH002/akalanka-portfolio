"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Minimize2,
  Maximize2,
  Trash2,
  AlertCircle,
} from "lucide-react";
import { AIAvatar } from "./AIAvatar";
import { AudioVisualizer } from "./AudioVisualizer";
import { ChatMessage } from "./ChatMessage";
import { AssistantState, ChatMessage as ChatMessageType, ChatApiResponse } from "@/types/ai";

const INITIAL_GREETING: ChatMessageType = {
  id: "greeting-0",
  role: "assistant",
  content:
    "Portfolio AI online. I can provide verified details on Akalanka's skills, production projects, architecture, and professional experience.",
  timestamp: "Just now",
};

const SUGGESTED_PROMPTS = [
  "Tell me about Akalanka.",
  "What FiveM projects has he worked on?",
  "What technologies does he use?",
  "What is his educational background?",
  "How can I contact him?",
];

export const AIChat: React.FC = () => {
  // UI State
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);

  // Assistant & Chat State
  const [state, setState] = useState<AssistantState>("IDLE");
  const [messages, setMessages] = useState<ChatMessageType[]>([INITIAL_GREETING]);
  const [inputValue, setInputValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [conversationId, setConversationId] = useState<string>("");

  // Audio State (ElevenLabs background capability)
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeMessageId, setActiveMessageId] = useState<string | null>(null);
  const [amplitude, setAmplitude] = useState(0);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);

  // References
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const createdObjectUrlsRef = useRef<string[]>([]);

  // Scroll messages to bottom smoothly
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen, scrollToBottom]);

  // Clean up allocated Blob URLs on unmount
  useEffect(() => {
    const urls = createdObjectUrlsRef.current;
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  // Keyboard shortcut: Escape to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Stop currently playing speech
  const handleStopSpeaking = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setActiveMessageId(null);
    setState("IDLE");
    setAmplitude(0);
  }, []);

  // Synthesize and play audio for a message
  const playAudioForMessage = useCallback(
    async (messageToPlay: ChatMessageType) => {
      try {
        handleStopSpeaking();
        setActiveMessageId(messageToPlay.id);

        let audioUrl = messageToPlay.audioUrl;

        // If audio not already fetched, generate via /api/tts
        if (!audioUrl) {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === messageToPlay.id ? { ...m, isAudioLoading: true, audioError: undefined } : m
            )
          );

          const res = await fetch("/api/tts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: messageToPlay.content }),
          });

          if (!res.ok) throw new Error("Audio generation failed");

          const blob = await res.blob();
          audioUrl = URL.createObjectURL(blob);
          createdObjectUrlsRef.current.push(audioUrl);

          setMessages((prev) =>
            prev.map((m) =>
              m.id === messageToPlay.id
                ? { ...m, audioUrl, isAudioLoading: false, audioError: undefined }
                : m
            )
          );
        }

        if (!audioUrl) return;

        if (audioRef.current) {
          audioRef.current.src = audioUrl;
          audioRef.current
            .play()
            .then(() => {
              setIsPlaying(true);
              setState("SPEAKING");
              setAutoplayBlocked(false);
            })
            .catch(() => {
              setAutoplayBlocked(true);
              setIsPlaying(false);
              setState("IDLE");
            });
        }
      } catch (err) {
        console.error(err);
        setState("IDLE");
      }
    },
    [handleStopSpeaking]
  );

  // Send message to /api/chat
  const handleSendMessage = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || isSubmitting) return;

    handleStopSpeaking();
    setInputValue("");
    setIsSubmitting(true);
    setState("THINKING");

    const userMessage: ChatMessageType = {
      id: `user_${Date.now()}`,
      role: "user",
      content: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    try {
      const history = updatedMessages
        .filter((m) => m.role === "user" || m.role === "assistant")
        .slice(-8)
        .map((m) => ({ role: m.role as "user" | "assistant", content: m.content }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, conversationId: conversationId || undefined, history }),
      });

      const data: ChatApiResponse = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message);

      if (data.conversationId) {
        setConversationId(data.conversationId);
      }

      const botMessage: ChatMessageType = {
        id: `bot_${Date.now()}`,
        role: "assistant",
        content: data.message,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, botMessage]);
      setState("IDLE");

      if (!isOpen) {
        setHasUnread(true);
      }
    } catch (err) {
      setState("ERROR");
      const errorMessage: ChatMessageType = {
        id: `err_${Date.now()}`,
        role: "assistant",
        content:
          (err as Error)?.message ||
          "AI systems are temporarily unavailable. Please verify network and try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClearHistory = () => {
    handleStopSpeaking();
    setMessages([INITIAL_GREETING]);
    setState("IDLE");
  };

  return (
    <>
      {/* Hidden Audio Element for Web Audio API binding */}
      <audio
        ref={audioRef}
        onEnded={() => {
          setIsPlaying(false);
          setActiveMessageId(null);
          setState("IDLE");
          setAmplitude(0);
        }}
        onError={() => {
          setIsPlaying(false);
          setActiveMessageId(null);
          setState("IDLE");
          setAmplitude(0);
        }}
        className="hidden"
      />

      {/* Floating Futuristic HUD Trigger Button (Positioned cleanly above telemetry dock) */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 10 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-20 lg:bottom-[78px] right-4 sm:right-6 z-50 select-none"
          >
            <motion.button
              type="button"
              onClick={() => {
                setIsOpen(true);
                setHasUnread(false);
              }}
              className="relative group flex items-center gap-3 p-2.5 sm:px-4 sm:py-3 rounded-full bg-background-card/90 backdrop-blur-xl border border-white/20 hover:border-red-500/50 transition-all duration-300 shadow-[0_0_25px_rgba(220,38,38,0.25)] hover:shadow-[0_0_35px_rgba(220,38,38,0.5)] focus:outline-none"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Open AI Portfolio Assistant"
            >
              <AIAvatar state={state} amplitude={amplitude} size="sm" />
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-[11px] font-mono tracking-widest text-white font-semibold flex items-center gap-1.5">
                  <span>PORTFOLIO AI</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-pulse" />
                </span>
                <span className="text-[10px] text-white/50 font-mono">NEURAL ASSISTANT</span>
              </div>
              {hasUnread && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-red-500 animate-ping" />
              )}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Single Liquid Glass Messenger Dialog (Clean, focused, no sidebars or call buttons) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 25, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            className={`fixed z-50 flex flex-col bg-[#16161a]/90 backdrop-blur-3xl border border-white/15 shadow-[0_30px_100px_rgba(0,0,0,0.85)] overflow-hidden transition-all duration-300 ${
              isExpanded
                ? "inset-4 sm:inset-10 max-w-4xl mx-auto rounded-[32px]"
                : "bottom-6 right-4 sm:right-6 w-[calc(100vw-2rem)] sm:w-[480px] md:w-[520px] h-[640px] max-h-[88vh] rounded-[32px]"
            }`}
            role="dialog"
            aria-modal="true"
            aria-label="AI Portfolio Assistant Window"
          >
            {/* Ambient Radial Liquid Glow Inside Window */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
              <div
                className="absolute -top-32 -left-32 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none"
                style={{ background: "radial-gradient(circle, rgba(220, 38, 38, 0.4) 0%, transparent 70%)" }}
              />
              <div
                className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full blur-3xl opacity-15 pointer-events-none"
                style={{ background: "radial-gradient(circle, rgba(74, 222, 128, 0.3) 0%, transparent 70%)" }}
              />
            </div>

            {/* Header: Clean contact info + minimal window controls */}
            <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between bg-black/20 select-none">
              <div className="flex items-center gap-3 min-w-0">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-600 via-rose-600 to-red-800 flex items-center justify-center text-white font-bold text-xs shadow-md">
                    AE
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#4ade80] border-2 border-[#16161a]" />
                </div>

                {/* Name & Subtitle */}
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-sans text-sm font-semibold text-white tracking-tight truncate">
                      Akalanka Egodawatte
                    </h3>
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/[0.08] text-white/70 font-mono border border-white/10">
                      Portfolio AI
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-white/40 truncate">
                    Lead Full Stack Architect • Online
                  </span>
                </div>
              </div>

              {/* Clean Action Icons: Clear, Expand, Close */}
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  type="button"
                  onClick={handleClearHistory}
                  title="Clear conversation"
                  className="p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-all"
                  aria-label="Clear conversation"
                >
                  <Trash2 size={15} />
                </button>

                <button
                  type="button"
                  onClick={() => setIsExpanded(!isExpanded)}
                  title={isExpanded ? "Restore size" : "Expand window"}
                  className="p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-all hidden sm:flex"
                  aria-label="Toggle fullscreen"
                >
                  {isExpanded ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
                </button>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  title="Close Assistant"
                  className="p-2 rounded-full hover:bg-red-500/20 text-white/60 hover:text-red-400 transition-all ml-1"
                  aria-label="Close modal"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Dynamic Audio Visualizer Bar (Visible if audio is actively playing) */}
            {isPlaying && (
              <div className="bg-black/30 border-b border-white/5 px-4 py-1.5 flex items-center justify-between select-none">
                <div className="flex items-center gap-2 text-[10px] font-mono text-[#4ade80]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-ping" />
                  <span>AUDIO FEED ACTIVE</span>
                </div>
                <AudioVisualizer
                  audioElement={audioRef.current}
                  isPlaying={isPlaying}
                  onAmplitudeChange={setAmplitude}
                  barCount={24}
                  className="w-28 h-5"
                />
              </div>
            )}

            {/* Autoplay Blocked Fallback Notification */}
            {autoplayBlocked && (
              <div className="bg-red-500/15 border-b border-red-500/30 px-4 py-2 flex items-center justify-between text-xs text-red-300">
                <span className="flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4" />
                  <span>Browser blocked audio autoplay.</span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    audioRef.current?.play().then(() => {
                      setIsPlaying(true);
                      setAutoplayBlocked(false);
                    });
                  }}
                  className="px-2.5 py-1 rounded-full bg-red-600 text-white font-mono text-[11px]"
                >
                  PLAY
                </button>
              </div>
            )}

            {/* Message Feed Area */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
              {/* Date Badge ("Today") */}
              <div className="flex items-center justify-center my-3 select-none">
                <span className="text-[11px] font-sans text-white/35">
                  Today
                </span>
              </div>

              {/* Messages */}
              {messages.map((msg) => (
                <ChatMessage
                  key={msg.id}
                  message={msg}
                  isPlayingThisAudio={isPlaying && activeMessageId === msg.id}
                  onPlayAudio={playAudioForMessage}
                  onPauseAudio={handleStopSpeaking}
                />
              ))}

              {/* Typing Indicator Bubble (Three bouncing dots) */}
              {state === "THINKING" && (
                <div className="flex justify-start my-2.5">
                  <div className="px-4 py-3 rounded-[22px] rounded-bl-sm bg-white/[0.07] border border-white/[0.08] backdrop-blur-xl flex items-center gap-1.5 shadow-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-white/70 animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-white/70 animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-white/70 animate-bounce [animation-delay:-0.3s]" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestion Chips */}
            <div className="px-4 sm:px-6 py-2 flex gap-1.5 overflow-x-auto no-scrollbar border-t border-white/[0.06] bg-black/15 select-none">
              {SUGGESTED_PROMPTS.map((prompt, i) => (
                <button
                  key={i}
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleSendMessage(prompt)}
                  className="whitespace-nowrap flex-shrink-0 px-3 py-1 rounded-full text-[11px] font-sans bg-white/[0.05] hover:bg-white/[0.12] border border-white/10 text-white/70 hover:text-white transition-all disabled:opacity-40"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Bottom Input Bar (Clean text input + Green capsule Send button, no mic button) */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputValue);
              }}
              className="p-3.5 sm:p-4 border-t border-white/10 flex items-center gap-2.5 bg-black/25 select-none"
            >
              <div className="relative flex-1 flex items-center">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type your transmission..."
                  maxLength={1000}
                  disabled={isSubmitting}
                  className="w-full px-5 py-3 rounded-full bg-white/[0.06] border border-white/10 focus:border-white/30 text-xs sm:text-sm text-white placeholder-white/40 font-sans outline-none transition-all disabled:opacity-50"
                />
              </div>

              {/* Vibrant Green Capsule Send Button */}
              <button
                type="submit"
                disabled={!inputValue.trim() || isSubmitting}
                className="px-6 sm:px-7 py-3 rounded-full bg-[#4ade80] hover:bg-[#22c55e] text-black font-semibold text-xs sm:text-sm tracking-tight transition-all duration-200 shadow-[0_0_20px_rgba(74,222,128,0.35)] hover:shadow-[0_0_28px_rgba(74,222,128,0.55)] active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0 flex items-center gap-1.5"
                aria-label="Send message"
              >
                <span>Send</span>
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

