"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useAppStore } from "@/lib/store";
import dynamic from "next/dynamic";

const TabLoading = () => (
  <div className="py-20 flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

const AnalyticsTab = dynamic(() => import("@/components/admin/AnalyticsTab").then((m) => m.AnalyticsTab), {
  loading: TabLoading,
});
const ProjectsTab = dynamic(() => import("@/components/admin/ProjectsTab").then((m) => m.ProjectsTab), {
  loading: TabLoading,
});
const PackagesTab = dynamic(() => import("@/components/admin/PackagesTab").then((m) => m.PackagesTab), {
  loading: TabLoading,
});
const TransmissionsTab = dynamic(() => import("@/components/admin/TransmissionsTab").then((m) => m.TransmissionsTab), {
  loading: TabLoading,
});
const VisitorLogsTab = dynamic(() => import("@/components/admin/VisitorLogsTab").then((m) => m.VisitorLogsTab), {
  loading: TabLoading,
});
const SettingsTab = dynamic(() => import("@/components/admin/SettingsTab").then((m) => m.SettingsTab), {
  loading: TabLoading,
});

type AdminTab = "analytics" | "projects" | "packages" | "transmissions" | "logs" | "settings";

export default function AdminDashboardPage() {
  const { transmissions, isLoaded } = useAppStore();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [passcode, setPasscode] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<AdminTab>("analytics");

  // Check server-side cryptographic session on mount
  const checkSession = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/session", {
        method: "GET",
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
        },
      });

      if (res.ok) {
        const data = await res.json();
        if (data.authenticated) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
    } catch (err) {
      console.error("Session verification failed:", err);
      setIsAuthenticated(false);
    } finally {
      setIsCheckingSession(false);
    }
  }, []);

  useEffect(() => {
    checkSession();

    // Defense against browser back-forward cache (bfcache) restoring authenticated view after logout
    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        checkSession();
      }
    };

    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, [checkSession]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode.trim()) return;

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ passcode: passcode.trim() }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setIsAuthenticated(true);
        setPasscode("");
        setErrorMsg("");
      } else {
        setErrorMsg(data.error || "ACCESS DENIED: Authentication failed.");
      }
    } catch (err) {
      console.error("Login request failed:", err);
      setErrorMsg("COMMUNICATION ERROR: Unable to contact authentication node.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", {
        method: "POST",
      });
    } catch (err) {
      console.error("Logout request error:", err);
    } finally {
      setIsAuthenticated(false);
      setPasscode("");
    }
  };

  const unreadCount = transmissions.filter((t) => t.status === "unread").length;

  if (!isLoaded || isCheckingSession) {
    return (
      <div className="min-h-screen bg-[#050209] flex items-center justify-center">
        <div className="text-center font-mono space-y-3">
          <div className="w-12 h-12 border-2 border-red-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-neutral-400">INITIALIZING NEURAL OVERRIDE...</p>
        </div>
      </div>
    );
  }

  // --- Passkey Security Gate Screen ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#050209] text-white flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background glow matrix */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md p-8 rounded-3xl bg-[#0c0614]/90 border border-red-500/40 backdrop-blur-2xl shadow-2xl relative space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 font-mono text-[10px] uppercase font-bold tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /> RESTRICTED_NODE_AUTH
            </div>
            <h1 className="text-2xl font-black font-mono tracking-tight text-white">
              COMMAND_CENTER
            </h1>
            <p className="text-xs text-neutral-400">
              Enter clearance passkey to access portfolio architectures, pricing controls, visitor telemetry & transmissions.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-neutral-300 flex items-center justify-between">
                <span>SECURITY PASSKEY</span>
                <span className="text-[10px] text-neutral-500 font-mono">ENCRYPTED CLEARANCE</span>
              </label>
              <input
                type="password"
                required
                autoFocus
                disabled={isSubmitting}
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/15 text-white font-mono text-sm tracking-widest focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 disabled:opacity-50"
              />
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-mono text-xs font-bold tracking-widest uppercase shadow-lg shadow-red-600/30 transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? "VERIFYING CREDENTIALS..." : "AUTHENTICATE ACCESS →"}
            </button>
          </form>

          <div className="pt-4 border-t border-white/10 text-center">
            <Link
              href="/"
              className="text-xs font-mono text-neutral-400 hover:text-white transition-colors"
            >
              ← Return to Public Portfolio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // --- Authenticated Master Dashboard ---
  return (
    <div className="min-h-screen bg-[#050209] text-white flex flex-col font-sans selection:bg-red-600/30">
      {/* Top Cyber Command Header */}
      <header className="sticky top-0 z-40 bg-[#0a0512]/90 border-b border-white/10 backdrop-blur-xl px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="group flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white font-mono text-xs transition-all"
          >
            <span>←</span>
            <span className="hidden sm:inline">Portfolio Front</span>
          </Link>

          <div className="h-4 w-px bg-white/10" />

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="font-mono font-black text-sm tracking-wider text-white">
              PORTFOLIO_CONTROL_PANEL
            </span>
            <span className="hidden md:inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-red-500/10 border border-red-500/20 text-red-400 font-bold uppercase">
              NODE: LIVE
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-neutral-400">
            <span>ADMIN:</span>
            <span className="text-white font-bold">SUPERUSER</span>
          </div>

          <button
            onClick={handleLogout}
            className="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 font-mono text-xs transition-all cursor-pointer"
          >
            🔒 Lock Terminal
          </button>
        </div>
      </header>

      {/* Main Layout Body */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8 space-y-8">
        {/* Navigation Bar / Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/10 no-scrollbar">
          {/* Tab 1: Analytics */}
          <button
            onClick={() => setActiveTab("analytics")}
            className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold tracking-wide uppercase transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "analytics"
                ? "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-600/30"
                : "bg-[#0d0714] text-neutral-400 hover:text-white border border-white/5 hover:border-white/15"
            }`}
          >
            <span>📈</span>
            <span>Analytics & Growth</span>
          </button>

          {/* Tab 2: Architectures */}
          <button
            onClick={() => setActiveTab("projects")}
            className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold tracking-wide uppercase transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "projects"
                ? "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-600/30"
                : "bg-[#0d0714] text-neutral-400 hover:text-white border border-white/5 hover:border-white/15"
            }`}
          >
            <span>🚀</span>
            <span>Deployed Architectures</span>
          </button>

          {/* Tab 3: Packages */}
          <button
            onClick={() => setActiveTab("packages")}
            className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold tracking-wide uppercase transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "packages"
                ? "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-600/30"
                : "bg-[#0d0714] text-neutral-400 hover:text-white border border-white/5 hover:border-white/15"
            }`}
          >
            <span>💎</span>
            <span>Packages & Pricing</span>
          </button>

          {/* Tab 4: Transmissions */}
          <button
            onClick={() => setActiveTab("transmissions")}
            className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold tracking-wide uppercase transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "transmissions"
                ? "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-600/30"
                : "bg-[#0d0714] text-neutral-400 hover:text-white border border-white/5 hover:border-white/15"
            }`}
          >
            <span>📥</span>
            <span>Transmissions</span>
            {unreadCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-red-500 text-white animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Tab 5: Live Logs */}
          <button
            onClick={() => setActiveTab("logs")}
            className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold tracking-wide uppercase transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "logs"
                ? "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-600/30"
                : "bg-[#0d0714] text-neutral-400 hover:text-white border border-white/5 hover:border-white/15"
            }`}
          >
            <span>🛰️</span>
            <span>Visitor Telemetry</span>
          </button>

          {/* Tab 6: Settings */}
          <button
            onClick={() => setActiveTab("settings")}
            className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold tracking-wide uppercase transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "settings"
                ? "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-600/30"
                : "bg-[#0d0714] text-neutral-400 hover:text-white border border-white/5 hover:border-white/15"
            }`}
          >
            <span>⚙️</span>
            <span>Profile & Settings</span>
          </button>
        </div>

        {/* Tab Content Panels */}
        <main>
          {activeTab === "analytics" && <AnalyticsTab />}
          {activeTab === "projects" && <ProjectsTab />}
          {activeTab === "packages" && <PackagesTab />}
          {activeTab === "transmissions" && <TransmissionsTab />}
          {activeTab === "logs" && <VisitorLogsTab />}
          {activeTab === "settings" && <SettingsTab />}
        </main>
      </div>
    </div>
  );
}
