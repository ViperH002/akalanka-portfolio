"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { DeployedArchitecture } from "@/types";

export function ProjectsTab() {
  const { projects, addProject, updateProject, deleteProject } = useAppStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<DeployedArchitecture | null>(null);
  const [previewMedia, setPreviewMedia] = useState<{ type: "video" | "image"; url: string; title: string } | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<DeployedArchitecture["category"]>("saas");
  const [description, setDescription] = useState("");
  const [languagesStr, setLanguagesStr] = useState("");
  const [tagsStr, setTagsStr] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [client, setClient] = useState("");
  const [completionDate, setCompletionDate] = useState("");

  const openAddModal = () => {
    setEditingProject(null);
    setTitle("");
    setCategory("saas");
    setDescription("");
    setLanguagesStr("TypeScript, Next.js 14, Tailwind CSS, PostgreSQL");
    setTagsStr("Full Stack, Web App, High Performance");
    setImageUrl("https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop");
    setVideoUrl("");
    setLiveUrl("https://example.com");
    setGithubUrl("https://github.com/example/repo");
    setClient("");
    setCompletionDate(new Date().toISOString().split("T")[0]);
    setIsModalOpen(true);
  };

  const openEditModal = (proj: DeployedArchitecture) => {
    setEditingProject(proj);
    setTitle(proj.title);
    setCategory(proj.category);
    setDescription(proj.description);
    setLanguagesStr(proj.languages ? proj.languages.join(", ") : "");
    setTagsStr(proj.tags ? proj.tags.join(", ") : "");
    setImageUrl(proj.imageUrl || "");
    setVideoUrl(proj.videoUrl || "");
    setLiveUrl(proj.liveUrl || "");
    setGithubUrl(proj.githubUrl || "");
    setClient(proj.client || "");
    setCompletionDate(proj.completionDate || "");
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const languages = languagesStr
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const tags = tagsStr
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const projectData = {
      title,
      category,
      type: category as any,
      description,
      languages: languages.length ? languages : ["TypeScript", "React"],
      tags: tags.length ? tags : languages,
      gradient: "linear-gradient(135deg, rgba(220, 38, 38, 0.25) 0%, rgba(14, 10, 24, 0.9) 100%)",
      imageUrl: imageUrl || undefined,
      videoUrl: videoUrl || undefined,
      liveUrl: liveUrl || undefined,
      githubUrl: githubUrl || undefined,
      client: client || undefined,
      completionDate: completionDate || undefined,
    };

    if (editingProject) {
      updateProject(editingProject.id, projectData);
    } else {
      addProject(projectData);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to decommission and delete "${name}"?`)) {
      deleteProject(id);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Tab Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#0d0714]/80 border border-white/10 backdrop-blur-xl">
        <div>
          <h2 className="text-xl font-black text-white font-mono tracking-wide flex items-center gap-2">
            <span>🚀</span> DEPLOYED_ARCHITECTURES_REGISTRY
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Manage public portfolio showcases with interactive video demonstrations, photo galleries, tech stacks & client details.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-mono text-xs font-bold tracking-wide shadow-lg shadow-red-600/30 transition-all cursor-pointer"
        >
          <span>+</span> DEPLOY NEW ARCHITECTURE
        </button>
      </div>

      {/* Architectures Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((proj) => (
          <div
            key={proj.id}
            className="rounded-2xl bg-[#0d0714]/80 border border-white/10 overflow-hidden flex flex-col justify-between group hover:border-red-500/50 transition-all duration-300 shadow-xl"
          >
            {/* Media Banner */}
            <div className="relative h-48 w-full bg-black/60 overflow-hidden">
              {proj.imageUrl ? (
                <img
                  src={proj.imageUrl}
                  alt={proj.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-neutral-600 font-mono text-xs">
                  No Media Attached
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d0714] via-transparent to-transparent" />

              {/* Category Badge */}
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase bg-black/70 backdrop-blur-md border border-white/15 text-red-400">
                {proj.category}
              </div>

              {/* Media Controls Preview */}
              <div className="absolute top-3 right-3 flex items-center gap-2">
                {proj.videoUrl && (
                  <button
                    onClick={() => setPreviewMedia({ type: "video", url: proj.videoUrl!, title: proj.title })}
                    className="p-1.5 rounded-lg bg-red-600/80 hover:bg-red-600 text-white text-xs backdrop-blur-md transition-all flex items-center gap-1 font-mono px-2"
                    title="Watch Demo Video"
                  >
                    <span>▶</span> Demo Video
                  </button>
                )}
                {proj.imageUrl && (
                  <button
                    onClick={() => setPreviewMedia({ type: "image", url: proj.imageUrl!, title: proj.title })}
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs backdrop-blur-md transition-all"
                    title="View Full Photo"
                  >
                    🔍
                  </button>
                )}
              </div>

              {/* Client Name if available */}
              {proj.client && (
                <div className="absolute bottom-3 left-4 text-xs font-mono text-neutral-300">
                  Client: <span className="text-white font-semibold">{proj.client}</span>
                </div>
              )}
            </div>

            {/* Body Info */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="text-base font-bold text-white font-mono group-hover:text-red-400 transition-colors">
                  {proj.title}
                </h3>
                <p className="text-xs text-neutral-400 mt-2 line-clamp-3 leading-relaxed">
                  {proj.description}
                </p>

                {/* Languages and Tech Stack Tags */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {proj.languages?.map((lang, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-white/[0.04] border border-white/10 text-neutral-300"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {proj.liveUrl && (
                    <a
                      href={proj.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-mono text-red-400 hover:text-red-300 flex items-center gap-1 underline"
                    >
                      Live System ↗
                    </a>
                  )}
                  {proj.githubUrl && (
                    <a
                      href={proj.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-mono text-neutral-400 hover:text-white flex items-center gap-1"
                    >
                      GitHub ↗
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(proj)}
                    className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-200 text-xs font-mono border border-white/10 transition-all cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(proj.id, proj.title)}
                    className="px-3 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-mono border border-red-500/20 transition-all cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Architecture Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#0e0716] border border-red-500/30 p-6 shadow-2xl space-y-5 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-lg font-mono font-bold text-white flex items-center gap-2">
                <span>⚡</span> {editingProject ? "EDIT_DEPLOYED_ARCHITECTURE" : "DEPLOY_NEW_ARCHITECTURE"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-400 hover:text-white font-mono text-sm p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-mono text-neutral-300">Architecture Title *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. SaaS Analytics Cloud Platform"
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white font-mono text-xs focus:border-red-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-mono text-neutral-300">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-black/80 border border-white/10 text-white font-mono text-xs focus:border-red-500 focus:outline-none"
                  >
                    <option value="saas">SaaS App</option>
                    <option value="ecommerce">E-Commerce</option>
                    <option value="landing">Landing Page</option>
                    <option value="realestate">Real Estate</option>
                    <option value="webapp">Web App</option>
                    <option value="ai">AI System</option>
                    <option value="mobile">Mobile App</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-xs font-mono text-neutral-300">Rich Description *</label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe technical architecture, key features, performance metrics..."
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white font-mono text-xs focus:border-red-500 focus:outline-none"
                />
              </div>

              {/* Languages & Tags */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-neutral-300">Languages & Tech (comma-separated)</label>
                  <input
                    type="text"
                    value={languagesStr}
                    onChange={(e) => setLanguagesStr(e.target.value)}
                    placeholder="TypeScript, Next.js 14, Tailwind, PostgreSQL"
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white font-mono text-xs focus:border-red-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-mono text-neutral-300">Category Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={tagsStr}
                    onChange={(e) => setTagsStr(e.target.value)}
                    placeholder="Full Stack, Real-time, 99 PageSpeed"
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white font-mono text-xs focus:border-red-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Image URL & Demo Video URL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-neutral-300">Photo / Thumbnail URL</label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white font-mono text-xs focus:border-red-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-mono text-neutral-300">Demo Video URL (.mp4 or stream)</label>
                  <input
                    type="url"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="https://assets.mixkit.co/.../video.mp4"
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white font-mono text-xs focus:border-red-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Live URL & GitHub URL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-neutral-300">Live Preview URL</label>
                  <input
                    type="url"
                    value={liveUrl}
                    onChange={(e) => setLiveUrl(e.target.value)}
                    placeholder="https://my-deployed-app.com"
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white font-mono text-xs focus:border-red-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-mono text-neutral-300">GitHub Repository URL</label>
                  <input
                    type="url"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/username/project"
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white font-mono text-xs focus:border-red-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Client & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-neutral-300">Client / Company Name</label>
                  <input
                    type="text"
                    value={client}
                    onChange={(e) => setClient(e.target.value)}
                    placeholder="e.g. Apex Metrics Global"
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white font-mono text-xs focus:border-red-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-mono text-neutral-300">Completion Date</label>
                  <input
                    type="date"
                    value={completionDate}
                    onChange={(e) => setCompletionDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white font-mono text-xs focus:border-red-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 font-mono text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-mono text-xs font-bold tracking-wide shadow-lg shadow-red-600/30"
                >
                  {editingProject ? "SAVE CHANGES" : "PUBLISH ARCHITECTURE"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Media Preview Modal */}
      {previewMedia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="w-full max-w-3xl rounded-2xl bg-[#0d0714] border border-red-500/30 p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-mono font-bold text-white">{previewMedia.title}</h4>
              <button
                onClick={() => setPreviewMedia(null)}
                className="text-neutral-400 hover:text-white font-mono text-sm"
              >
                ✕ Close
              </button>
            </div>
            <div className="rounded-xl overflow-hidden bg-black flex items-center justify-center max-h-[70vh]">
              {previewMedia.type === "video" ? (
                <video src={previewMedia.url} controls autoPlay className="w-full max-h-[65vh] object-contain" />
              ) : (
                <img src={previewMedia.url} alt={previewMedia.title} className="w-full max-h-[65vh] object-contain" />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
