"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { TransmissionMessage } from "@/types";

export function TransmissionsTab() {
  const { transmissions, updateTransmissionStatus, deleteTransmission } = useAppStore();
  const [filter, setFilter] = useState<"all" | "unread" | "read" | "replied" | "archived">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeMessage, setActiveMessage] = useState<TransmissionMessage | null>(null);

  const filteredMessages = transmissions.filter((msg) => {
    if (filter !== "all" && msg.status !== filter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        msg.name.toLowerCase().includes(q) ||
        msg.email.toLowerCase().includes(q) ||
        msg.projectType.toLowerCase().includes(q) ||
        msg.message.toLowerCase().includes(q) ||
        (msg.location && msg.location.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const unreadCount = transmissions.filter((m) => m.status === "unread").length;

  const handleOpenMessage = (msg: TransmissionMessage) => {
    setActiveMessage(msg);
    if (msg.status === "unread") {
      updateTransmissionStatus(msg.id, "read");
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this transmission permanently?")) {
      deleteTransmission(id);
      if (activeMessage?.id === id) setActiveMessage(null);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Tab Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#0d0714]/80 border border-white/10 backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-white font-mono tracking-wide">
              📥 INCOMING_TRANSMISSIONS_HUB
            </h2>
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-red-600 text-white animate-pulse">
                {unreadCount} NEW
              </span>
            )}
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Real-time intake stream of prospective client project briefs, budget proposals, and encrypted communications.
          </p>
        </div>

        {/* Search input */}
        <div className="w-full sm:w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search sender, budget, text..."
            className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white font-mono text-xs focus:border-red-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {(["all", "unread", "read", "replied", "archived"] as const).map((tabKey) => {
          const count =
            tabKey === "all"
              ? transmissions.length
              : transmissions.filter((m) => m.status === tabKey).length;
          return (
            <button
              key={tabKey}
              onClick={() => setFilter(tabKey)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold uppercase transition-all flex items-center gap-1.5 ${
                filter === tabKey
                  ? "bg-red-600 text-white shadow-lg shadow-red-600/30"
                  : "bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10"
              }`}
            >
              <span>{tabKey}</span>
              <span className="text-[10px] opacity-70 px-1.5 py-0.2 rounded-full bg-black/40">
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Message List */}
      <div className="space-y-3">
        {filteredMessages.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-[#0d0714]/60 border border-white/5">
            <div className="text-3xl mb-2">📡</div>
            <p className="text-sm font-mono text-neutral-400">No transmission packets match this filter.</p>
          </div>
        ) : (
          filteredMessages.map((msg) => (
            <div
              key={msg.id}
              onClick={() => handleOpenMessage(msg)}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col md:flex-row items-start md:items-center justify-between gap-4 group ${
                msg.status === "unread"
                  ? "bg-[#180d24] border-red-500/50 shadow-lg shadow-red-950/40"
                  : "bg-[#0d0714]/80 border-white/10 hover:border-white/20"
              }`}
            >
              {/* Left Info */}
              <div className="flex items-start gap-3.5 flex-1 min-w-0">
                <div className="mt-1">
                  {msg.status === "unread" ? (
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 block animate-pulse" />
                  ) : msg.status === "replied" ? (
                    <span className="text-emerald-400 text-xs">↩</span>
                  ) : (
                    <span className="text-neutral-500 text-xs">●</span>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono font-bold text-white text-sm group-hover:text-red-400 transition-colors">
                      {msg.name}
                    </span>
                    <span className="text-xs font-mono text-neutral-400">{msg.email}</span>
                    {msg.location && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/[0.04] text-neutral-300 border border-white/5">
                        📍 {msg.location}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-neutral-300 mt-1 line-clamp-1 font-mono">
                    <span className="text-red-400 font-semibold">[{msg.projectType}]</span> {msg.message}
                  </p>
                </div>
              </div>

              {/* Right Details */}
              <div className="flex items-center gap-3 self-end md:self-auto shrink-0">
                <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  {msg.budget}
                </span>

                <span className="text-[10px] font-mono text-neutral-500">
                  {new Date(msg.createdAt).toLocaleDateString()} {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>

                <span className="text-neutral-400 group-hover:text-white text-xs">→</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Message Modal View */}
      {activeMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-2xl rounded-2xl bg-[#0e0716] border border-red-500/30 p-6 shadow-2xl space-y-6 animate-scaleUp">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-white/10 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-mono font-bold text-white">{activeMessage.name}</h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold ${
                    activeMessage.status === "unread" ? "bg-red-500/20 text-red-400" :
                    activeMessage.status === "replied" ? "bg-emerald-500/20 text-emerald-400" :
                    "bg-white/10 text-neutral-300"
                  }`}>
                    Status: {activeMessage.status}
                  </span>
                </div>
                <div className="text-xs font-mono text-neutral-400 mt-1 flex flex-wrap gap-x-4 gap-y-1">
                  <span>✉️ {activeMessage.email}</span>
                  {activeMessage.ip && <span>🌐 IP: {activeMessage.ip}</span>}
                  {activeMessage.location && <span>📍 {activeMessage.location}</span>}
                </div>
              </div>

              <button
                onClick={() => setActiveMessage(null)}
                className="text-neutral-400 hover:text-white font-mono text-sm p-1"
              >
                ✕
              </button>
            </div>

            {/* Scope / Budget highlights */}
            <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-black/40 border border-white/5 text-xs font-mono">
              <div>
                <span className="text-neutral-500 block text-[10px]">PROJECT SCOPE</span>
                <span className="text-white font-semibold">{activeMessage.projectType}</span>
              </div>
              <div>
                <span className="text-neutral-500 block text-[10px]">STATED BUDGET</span>
                <span className="text-amber-400 font-semibold">{activeMessage.budget}</span>
              </div>
            </div>

            {/* Message Body */}
            <div className="space-y-1">
              <label className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider">Transmission Payload</label>
              <div className="p-4 rounded-xl bg-black/50 border border-white/10 text-neutral-200 font-mono text-xs leading-relaxed whitespace-pre-wrap">
                {activeMessage.message}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/10">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateTransmissionStatus(activeMessage.id, "replied")}
                  className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-xs font-mono transition-all"
                >
                  Mark Replied
                </button>
                <button
                  onClick={() => updateTransmissionStatus(activeMessage.id, "archived")}
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 border border-white/10 text-xs font-mono transition-all"
                >
                  Archive
                </button>
                <button
                  onClick={() => handleDelete(activeMessage.id)}
                  className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-mono transition-all"
                >
                  Delete
                </button>
              </div>

              <a
                href={`mailto:${activeMessage.email}?subject=Regarding your inquiry for ${encodeURIComponent(activeMessage.projectType)}`}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-mono text-xs font-bold tracking-wide shadow-lg shadow-red-600/30 flex items-center gap-2"
              >
                <span>✉️</span> COMPOSE DIRECT EMAIL REPLY
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
