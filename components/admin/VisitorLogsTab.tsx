"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";

export function VisitorLogsTab() {
  const { visitorLogs } = useAppStore();
  const [filterQuery, setFilterQuery] = useState("");
  const [deviceFilter, setDeviceFilter] = useState<string>("all");

  const filteredLogs = visitorLogs.filter((log) => {
    if (deviceFilter !== "all" && log.device !== deviceFilter) return false;
    if (filterQuery.trim()) {
      const q = filterQuery.toLowerCase();
      return (
        log.ip.toLowerCase().includes(q) ||
        log.city.toLowerCase().includes(q) ||
        log.country.toLowerCase().includes(q) ||
        log.countryCode.toLowerCase().includes(q) ||
        log.browser.toLowerCase().includes(q) ||
        log.os.toLowerCase().includes(q) ||
        log.page.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#0d0714]/80 border border-white/10 backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-white font-mono tracking-wide">
              🛰️ VISITOR_TELEMETRY_LOGS
            </h2>
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> LIVE STREAM
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Real-time origin coordinates, IP signatures, browser headers, and pathway navigation events.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <select
            value={deviceFilter}
            onChange={(e) => setDeviceFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white font-mono text-xs focus:border-red-500 focus:outline-none"
          >
            <option value="all">All Devices</option>
            <option value="Desktop">🖥️ Desktop</option>
            <option value="Mobile">📱 Mobile</option>
            <option value="Tablet">📟 Tablet</option>
          </select>

          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="Search IP, City, Flag, Page..."
            className="w-full sm:w-56 px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white font-mono text-xs focus:border-red-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Telemetry Table */}
      <div className="rounded-2xl bg-[#0d0714]/80 border border-white/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-mono text-xs">
            <thead>
              <tr className="bg-black/40 border-b border-white/10 text-neutral-400 uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Client IP</th>
                <th className="py-3 px-4">Geographic Origin</th>
                <th className="py-3 px-4">Device / OS</th>
                <th className="py-3 px-4">Browser Engine</th>
                <th className="py-3 px-4">Entry Vector</th>
                <th className="py-3 px-4">Referrer Source</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-neutral-500 font-mono">
                    No telemetry packets recorded matching query.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr
                    key={log.id}
                    className="hover:bg-white/[0.02] transition-colors group"
                  >
                    {/* Timestamp */}
                    <td className="py-3.5 px-4 text-neutral-400 whitespace-nowrap text-[11px]">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                      <span className="block text-[9px] text-neutral-600">
                        {new Date(log.timestamp).toLocaleDateString()}
                      </span>
                    </td>

                    {/* IP */}
                    <td className="py-3.5 px-4 font-mono font-bold text-red-400 whitespace-nowrap">
                      {log.ip}
                    </td>

                    {/* Geo Location */}
                    <td className="py-3.5 px-4 text-white whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{log.flag}</span>
                        <div>
                          <span className="font-semibold block">{log.city}, {log.country}</span>
                          <span className="text-[9px] text-neutral-500 uppercase">{log.countryCode}</span>
                        </div>
                      </div>
                    </td>

                    {/* Device & OS */}
                    <td className="py-3.5 px-4 text-neutral-300 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-white/[0.04] border border-white/5 text-[10px]">
                        {log.device === "Desktop" ? "🖥️" : log.device === "Mobile" ? "📱" : "📟"} {log.os}
                      </span>
                    </td>

                    {/* Browser */}
                    <td className="py-3.5 px-4 text-neutral-400 whitespace-nowrap text-[11px]">
                      {log.browser}
                    </td>

                    {/* Page */}
                    <td className="py-3.5 px-4 text-cyan-400 whitespace-nowrap font-mono text-[11px]">
                      {log.page}
                    </td>

                    {/* Referrer */}
                    <td className="py-3.5 px-4 text-neutral-500 whitespace-nowrap text-[11px] truncate max-w-[150px]">
                      {log.referrer}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
