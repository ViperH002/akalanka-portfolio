"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";

export function SettingsTab() {
  const { settings, updateSettings, resetToDefaults } = useAppStore();

  const [developerName, setDeveloperName] = useState(
    settings.developerName && settings.developerName !== "Rayhan Aditya"
      ? settings.developerName
      : "Akalanka Egodawatte"
  );
  const [headlineName1, setHeadlineName1] = useState(
    settings.headlineName1 && settings.headlineName1 !== "RAYHAN"
      ? settings.headlineName1
      : "AKALANKA"
  );
  const [headlineName2, setHeadlineName2] = useState(
    settings.headlineName2 && settings.headlineName2 !== "ADITYA"
      ? settings.headlineName2
      : "EGODAWATTE"
  );
  const [subtitle, setSubtitle] = useState(settings.subtitle || "WEB DESIGNER & UI/UX CREATOR");
  const [bio, setBio] = useState(settings.bio || "");
  const [availableForFreelance, setAvailableForFreelance] = useState(!!settings.availableForFreelance);
  const [availableWorldwide, setAvailableWorldwide] = useState(!!settings.availableWorldwide);
  const [experienceYears, setExperienceYears] = useState(settings.experienceYears || 3);
  const [projectsCompleted, setProjectsCompleted] = useState(settings.projectsCompleted || 40);
  const [happyClients, setHappyClients] = useState(settings.happyClients || 20);
  const [githubUrl, setGithubUrl] = useState(settings.githubUrl || "https://github.com");
  const [linkedinUrl, setLinkedinUrl] = useState(settings.linkedinUrl || "https://linkedin.com");
  const [twitterUrl, setTwitterUrl] = useState(settings.twitterUrl || "https://twitter.com");
  const [fiverrUrl, setFiverrUrl] = useState(settings.fiverrUrl || "#contact");

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      developerName,
      headlineName1,
      headlineName2,
      subtitle,
      bio,
      availableForFreelance,
      availableWorldwide,
      experienceYears: Number(experienceYears),
      projectsCompleted: Number(projectsCompleted),
      happyClients: Number(happyClients),
      githubUrl,
      linkedinUrl,
      twitterUrl,
      fiverrUrl,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleReset = () => {
    if (confirm("Reset ALL data (Packages, Projects, Transmissions, Logs, Settings) back to initial factory defaults?")) {
      resetToDefaults();
      alert("System restored to factory seed state.");
      window.location.reload();
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#0d0714]/80 border border-white/10 backdrop-blur-xl">
        <div>
          <h2 className="text-xl font-black text-white font-mono tracking-wide flex items-center gap-2">
            <span>⚙️</span> PROFILE_&_SYSTEM_CONFIGURATION
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Configure global portfolio identity, hero headline wording, freelance availability flags, and live counter metrics.
          </p>
        </div>

        {savedSuccess && (
          <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-mono font-bold animate-bounce">
            ✓ CONFIGURATION SAVED
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Info */}
        <div className="p-6 rounded-2xl bg-[#0d0714]/80 border border-white/10 backdrop-blur-xl space-y-4">
          <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider text-red-400">
            01. Developer Identity & Hero Branding
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-mono text-neutral-300">Hero First Name (Large Outline)</label>
              <input
                type="text"
                value={headlineName1}
                onChange={(e) => setHeadlineName1(e.target.value)}
                placeholder="AKALANKA"
                className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white font-mono text-xs focus:border-red-500 focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-mono text-neutral-300">Hero Last Name (Gradient Fill)</label>
              <input
                type="text"
                value={headlineName2}
                onChange={(e) => setHeadlineName2(e.target.value)}
                placeholder="EGODAWATTE"
                className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white font-mono text-xs focus:border-red-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-mono text-neutral-300">Full Developer Name</label>
              <input
                type="text"
                value={developerName}
                onChange={(e) => setDeveloperName(e.target.value)}
                placeholder="Rayhan Aditya"
                className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white font-mono text-xs focus:border-red-500 focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-mono text-neutral-300">Subtitle / Role Tag</label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="WEB DESIGNER & UI/UX CREATOR"
                className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white font-mono text-xs focus:border-red-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono text-neutral-300">Hero Bio Description</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white font-mono text-xs focus:border-red-500 focus:outline-none"
            />
          </div>

          {/* Availability Toggles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <label className="flex items-center gap-3 p-3 rounded-xl bg-black/40 border border-white/5 cursor-pointer">
              <input
                type="checkbox"
                checked={availableForFreelance}
                onChange={(e) => setAvailableForFreelance(e.target.checked)}
                className="w-4 h-4 rounded accent-red-600 cursor-pointer"
              />
              <span className="text-xs font-mono text-white select-none">
                🟢 Available for Freelance / Contract
              </span>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-xl bg-black/40 border border-white/5 cursor-pointer">
              <input
                type="checkbox"
                checked={availableWorldwide}
                onChange={(e) => setAvailableWorldwide(e.target.checked)}
                className="w-4 h-4 rounded accent-red-600 cursor-pointer"
              />
              <span className="text-xs font-mono text-white select-none">
                🌍 Available Worldwide (Remote UTC-12 to UTC+12)
              </span>
            </label>
          </div>
        </div>

        {/* Counter Stats Metrics */}
        <div className="p-6 rounded-2xl bg-[#0d0714]/80 border border-white/10 backdrop-blur-xl space-y-4">
          <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider text-red-400">
            02. Live Experience Metrics Counters
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-mono text-neutral-300">Years of Experience</label>
              <input
                type="number"
                min={0}
                value={experienceYears}
                onChange={(e) => setExperienceYears(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white font-mono text-xs focus:border-red-500 focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-mono text-neutral-300">Projects Completed</label>
              <input
                type="number"
                min={0}
                value={projectsCompleted}
                onChange={(e) => setProjectsCompleted(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white font-mono text-xs focus:border-red-500 focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-mono text-neutral-300">Happy Clients Served</label>
              <input
                type="number"
                min={0}
                value={happyClients}
                onChange={(e) => setHappyClients(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white font-mono text-xs focus:border-red-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Social & Contact Links */}
        <div className="p-6 rounded-2xl bg-[#0d0714]/80 border border-white/10 backdrop-blur-xl space-y-4">
          <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider text-red-400">
            03. External Network & Platform Gateways
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-mono text-neutral-300">GitHub Profile URL</label>
              <input
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white font-mono text-xs focus:border-red-500 focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-mono text-neutral-300">LinkedIn Profile URL</label>
              <input
                type="url"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white font-mono text-xs focus:border-red-500 focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-mono text-neutral-300">Twitter / X Profile URL</label>
              <input
                type="url"
                value={twitterUrl}
                onChange={(e) => setTwitterUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white font-mono text-xs focus:border-red-500 focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-mono text-neutral-300">Fiverr / Marketplace Link</label>
              <input
                type="text"
                value={fiverrUrl}
                onChange={(e) => setFiverrUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white font-mono text-xs focus:border-red-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Submit & Reset actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-500/30 text-xs font-mono transition-all cursor-pointer"
          >
            ⚠️ Reset All Data to Seed Defaults
          </button>

          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-mono text-xs font-bold tracking-wider shadow-lg shadow-red-600/30 transition-all cursor-pointer uppercase"
          >
            Apply Configuration Changes
          </button>
        </div>
      </form>
    </div>
  );
}
