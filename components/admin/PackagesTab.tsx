"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { PricingPackage, PackageFeature } from "@/types";

export function PackagesTab() {
  const { packages, addPackage, updatePackage, deletePackage } = useAppStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<PricingPackage | null>(null);

  // Form State
  const [tier, setTier] = useState("Tier 01");
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number>(299);
  const [currency, setCurrency] = useState("$");
  const [description, setDescription] = useState("");
  const [delivery, setDelivery] = useState("3-5 Days Delivery");
  const [badge, setBadge] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [ctaText, setCtaText] = useState("SELECT TIER");
  const [features, setFeatures] = useState<PackageFeature[]>([
    { text: "Custom Responsive UI/UX", included: true },
    { text: "React / Next.js Implementation", included: true },
    { text: "API Integration", included: true },
    { text: "Source Code + 30-Day Support", included: true },
  ]);
  const [newFeatureText, setNewFeatureText] = useState("");

  const openAddModal = () => {
    setEditingPackage(null);
    setTier(`Tier 0${packages.length + 1}`);
    setName("");
    setPrice(499);
    setCurrency("$");
    setDescription("");
    setDelivery("4-7 Days Delivery");
    setBadge("");
    setIsFeatured(false);
    setCtaText("COMMISSION TIER");
    setFeatures([
      { text: "1-5 High Conversion Pages", included: true },
      { text: "Next.js 14 + Tailwind CSS", included: true },
      { text: "SEO & Speed Optimization (95+)", included: true },
      { text: "Contact Form & Email Transmission", included: true },
      { text: "Continuous Deployment Setup", included: true },
    ]);
    setIsModalOpen(true);
  };

  const openEditModal = (pkg: PricingPackage) => {
    setEditingPackage(pkg);
    setTier(pkg.tier);
    setName(pkg.name);
    setPrice(pkg.price);
    setCurrency(pkg.currency || "$");
    setDescription(pkg.description);
    setDelivery(pkg.delivery);
    setBadge(pkg.badge || "");
    setIsFeatured(!!pkg.isFeatured);
    setCtaText(pkg.ctaText || "SELECT TIER");
    setFeatures(pkg.features || []);
    setIsModalOpen(true);
  };

  const handleAddFeature = () => {
    if (!newFeatureText.trim()) return;
    setFeatures([...features, { text: newFeatureText.trim(), included: true }]);
    setNewFeatureText("");
  };

  const handleRemoveFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const handleToggleFeature = (index: number) => {
    setFeatures(
      features.map((f, i) => (i === index ? { ...f, included: !f.included } : f))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pkgData = {
      tier,
      name,
      price: Number(price),
      currency,
      description,
      delivery,
      badge: badge || undefined,
      isFeatured,
      ctaText,
      features,
    };

    if (editingPackage) {
      updatePackage(editingPackage.id, pkgData);
    } else {
      addPackage(pkgData);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove the pricing tier "${name}"?`)) {
      deletePackage(id);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Tab Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#0d0714]/80 border border-white/10 backdrop-blur-xl">
        <div>
          <h2 className="text-xl font-black text-white font-mono tracking-wide flex items-center gap-2">
            <span>💎</span> PACKAGES_&_PRICING_MATRIX
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Real-time control over public service packages, tiered pricing, deliverables, feature checklists and featured badges.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-mono text-xs font-bold tracking-wide shadow-lg shadow-red-600/30 transition-all cursor-pointer"
        >
          <span>+</span> CREATE NEW TIER
        </button>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className={`rounded-2xl p-6 relative flex flex-col justify-between transition-all duration-300 ${
              pkg.isFeatured
                ? "bg-[#160b1e]/90 border-2 border-red-500/80 shadow-2xl shadow-red-950/60"
                : "bg-[#0d0714]/80 border border-white/10"
            }`}
          >
            {/* Top row */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono font-bold tracking-widest text-red-400 uppercase">
                  {pkg.tier}
                </span>
                {pkg.badge && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-gradient-to-r from-red-600 to-rose-600 text-white uppercase tracking-wider">
                    {pkg.badge}
                  </span>
                )}
              </div>

              <h3 className="text-xl font-black text-white font-mono">{pkg.name}</h3>
              <p className="text-xs text-neutral-400 mt-2 min-h-[36px]">{pkg.description}</p>

              {/* Price & Timeline */}
              <div className="my-6 pb-6 border-b border-white/10">
                <div className="flex items-baseline gap-1">
                  <span className="text-base font-mono text-red-400 font-bold">{pkg.currency || "$"}</span>
                  <span className="text-4xl font-black font-mono text-white">{pkg.price}</span>
                  <span className="text-xs font-mono text-neutral-400 ml-1">/ project</span>
                </div>
                <div className="text-xs font-mono text-neutral-300 mt-2 flex items-center gap-1.5">
                  <span>⏱️</span> {pkg.delivery}
                </div>
              </div>

              {/* Features list */}
              <div className="space-y-2.5 mb-6">
                <div className="text-[11px] font-mono font-semibold text-neutral-400 uppercase tracking-wider">
                  Deliverables Included:
                </div>
                {pkg.features?.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs font-mono">
                    <span className={feat.included ? "text-emerald-400" : "text-neutral-600"}>
                      {feat.included ? "✓" : "✕"}
                    </span>
                    <span className={feat.included ? "text-neutral-200" : "text-neutral-500 line-through"}>
                      {feat.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-[11px] font-mono text-neutral-400">
                CTA: <span className="text-white font-semibold">{pkg.ctaText || "SELECT"}</span>
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEditModal(pkg)}
                  className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-200 text-xs font-mono border border-white/10 transition-all cursor-pointer"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(pkg.id, pkg.name)}
                  className="px-3 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-mono border border-red-500/20 transition-all cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Package Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#0e0716] border border-red-500/30 p-6 shadow-2xl space-y-5 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-lg font-mono font-bold text-white flex items-center gap-2">
                <span>⚡</span> {editingPackage ? "EDIT_PRICING_PACKAGE" : "CREATE_PRICING_PACKAGE"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-400 hover:text-white font-mono text-sm p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Tier & Name */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-neutral-300">Tier Tag</label>
                  <input
                    type="text"
                    required
                    value={tier}
                    onChange={(e) => setTier(e.target.value)}
                    placeholder="e.g. Tier 01"
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white font-mono text-xs focus:border-red-500 focus:outline-none"
                  />
                </div>
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-mono text-neutral-300">Package Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Cyber Starter Architecture"
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white font-mono text-xs focus:border-red-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Price, Currency & Delivery */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-neutral-300">Price (Number) *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white font-mono text-xs focus:border-red-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-mono text-neutral-300">Currency Symbol</label>
                  <input
                    type="text"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white font-mono text-xs focus:border-red-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-mono text-neutral-300">Delivery Timeline *</label>
                  <input
                    type="text"
                    required
                    value={delivery}
                    onChange={(e) => setDelivery(e.target.value)}
                    placeholder="e.g. 5-8 Days Delivery"
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white font-mono text-xs focus:border-red-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-xs font-mono text-neutral-300">Package Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short summary of target audience and ideal use case..."
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white font-mono text-xs focus:border-red-500 focus:outline-none"
                />
              </div>

              {/* Badge & Featured Toggle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-neutral-300">Badge Label (Optional)</label>
                  <input
                    type="text"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    placeholder="e.g. MOST POPULAR"
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white font-mono text-xs focus:border-red-500 focus:outline-none"
                  />
                </div>
                <div className="flex items-center gap-3 pt-4">
                  <input
                    type="checkbox"
                    id="featuredToggle"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="w-4 h-4 rounded accent-red-600 cursor-pointer"
                  />
                  <label htmlFor="featuredToggle" className="text-xs font-mono text-white cursor-pointer select-none">
                    Highlight as Featured (Glow Frame)
                  </label>
                </div>
              </div>

              {/* Feature Items List Manager */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <label className="text-xs font-mono text-neutral-300">Feature Deliverables ({features.length})</label>
                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {features.map((feat, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between gap-2 p-2 rounded-lg bg-black/40 border border-white/5 text-xs font-mono"
                    >
                      <button
                        type="button"
                        onClick={() => handleToggleFeature(idx)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          feat.included ? "bg-emerald-500/20 text-emerald-400" : "bg-neutral-800 text-neutral-500"
                        }`}
                      >
                        {feat.included ? "Included" : "Excluded"}
                      </button>
                      <span className="flex-1 text-neutral-200 truncate">{feat.text}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(idx)}
                        className="text-red-400 hover:text-red-300 px-1"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add new feature input */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    value={newFeatureText}
                    onChange={(e) => setNewFeatureText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddFeature();
                      }
                    }}
                    placeholder="Add deliverable feature..."
                    className="flex-1 px-3 py-1.5 rounded-xl bg-black/50 border border-white/10 text-white font-mono text-xs focus:border-red-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-bold"
                  >
                    + Add
                  </button>
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
                  {editingPackage ? "SAVE PACKAGE" : "CREATE PACKAGE"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
