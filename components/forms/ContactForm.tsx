"use client";

import { useState } from "react";
import { Send, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { ContactFormData } from "@/types";
import { useAppStore } from "@/lib/store";

export function ContactForm() {
  const { addTransmission } = useAppStore();
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    projectType: "",
    budget: "",
    message: "",
  });

  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Transmission failed. Please verify fields and retry.");
        setStatus("idle");
        return;
      }

      // Sync with client-side reactive store for session preview
      addTransmission({
        name: formData.name.trim(),
        email: formData.email.trim(),
        projectType: formData.projectType,
        budget: formData.budget,
        message: formData.message.trim(),
      });

      setStatus("success");
      setFormData({
        name: "",
        email: "",
        projectType: "",
        budget: "",
        message: "",
      });

      setTimeout(() => {
        setStatus("idle");
      }, 5000);
    } catch (err) {
      console.error("Transmission error:", err);
      setErrorMessage("Network error: Unable to contact server. Please verify your connection.");
      setStatus("idle");
    }
  };

  return (
    <div className="p-8 sm:p-10 rounded-[32px] liquid-glass-card shadow-2xl relative select-none">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Name */}
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="text-xs font-sans font-medium text-white/70 uppercase tracking-wider">
            Your Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Alex Vance"
            required
            maxLength={100}
            className="px-4 py-3 rounded-xl bg-white/[0.05] border border-white/15 text-white placeholder-white/30 text-sm font-sans focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/20 transition-all"
          />
        </div>

        {/* Email */}
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-xs font-sans font-medium text-white/70 uppercase tracking-wider">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="alex@example.com"
            required
            maxLength={150}
            className="px-4 py-3 rounded-xl bg-white/[0.05] border border-white/15 text-white placeholder-white/30 text-sm font-sans focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/20 transition-all"
          />
        </div>

        {/* Project Type */}
        <div className="flex flex-col gap-2">
          <label htmlFor="projectType" className="text-xs font-sans font-medium text-white/70 uppercase tracking-wider">
            Project Architecture
          </label>
          <select
            id="projectType"
            name="projectType"
            value={formData.projectType}
            onChange={handleChange}
            required
            className="px-4 py-3 rounded-xl bg-[#14141c] border border-white/15 text-white text-sm font-sans focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/20 transition-all cursor-pointer"
          >
            <option value="" disabled>
              Select Architecture
            </option>
            <option value="landing">Cyber Landing Page</option>
            <option value="business">Full Stack Web Portal</option>
            <option value="ecommerce">High-Conversion E-Commerce</option>
            <option value="webapp">Cloud SaaS Application</option>
            <option value="portfolio">Personal Brand / Portfolio</option>
            <option value="fivem">FiveM Game Systems / Scripts</option>
            <option value="other">Custom Scalable Architecture</option>
          </select>
        </div>

        {/* Budget */}
        <div className="flex flex-col gap-2">
          <label htmlFor="budget" className="text-xs font-sans font-medium text-white/70 uppercase tracking-wider">
            Budget Allocation
          </label>
          <select
            id="budget"
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            required
            className="px-4 py-3 rounded-xl bg-[#14141c] border border-white/15 text-white text-sm font-sans focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/20 transition-all cursor-pointer"
          >
            <option value="" disabled>
              Select Budget Tier
            </option>
            <option value="starter">$150 – $300 (Starter Tier)</option>
            <option value="business">$500 – $1,000 (Pro Tier)</option>
            <option value="enterprise">$1,500 – $3,000 (Enterprise Tier)</option>
            <option value="custom">$3,000+ (Custom Scalable Deployment)</option>
          </select>
        </div>

        {/* Message */}
        <div className="flex flex-col gap-2 sm:col-span-2">
          <label htmlFor="message" className="text-xs font-sans font-medium text-white/70 uppercase tracking-wider">
            Specification Details
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            value={formData.message}
            onChange={handleChange}
            placeholder="Detail system objectives, feature requirements, delivery expectations, and reference benchmarks..."
            required
            minLength={10}
            maxLength={2000}
            className="px-4 py-3 rounded-2xl bg-white/[0.05] border border-white/15 text-white placeholder-white/30 text-sm font-sans focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/20 transition-all resize-y min-h-[100px]"
          />
        </div>

        {/* Error Alert Message */}
        {errorMessage && (
          <div className="sm:col-span-2 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Submit Button */}
        <div className="sm:col-span-2 pt-2">
          <button
            type="submit"
            disabled={status === "submitting"}
            className={`w-full py-4 rounded-full text-sm font-semibold tracking-tight flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer ${
              status === "success"
                ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                : status === "submitting"
                ? "bg-white/70 text-black cursor-wait"
                : "bg-white hover:bg-neutral-100 text-black shadow-[0_4px_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] active:scale-[0.98]"
            }`}
          >
            {status === "submitting" && (
              <>
                <Loader2 size={16} className="animate-spin text-black" />
                <span>Transmitting Secure Inquiry...</span>
              </>
            )}
            {status === "success" && (
              <>
                <CheckCircle2 size={16} className="text-white" />
                <span>Transmission Confirmed & Secured</span>
              </>
            )}
            {status === "idle" && (
              <>
                <span>Send Message</span>
                <Send size={15} />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
