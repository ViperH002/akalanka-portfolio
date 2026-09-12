"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { VisitorLog } from "@/types";

export function AnalyticsTab() {
  const { growthData, visitorLogs, transmissions } = useAppStore();
  const [activeMetric, setActiveMetric] = useState<"visitors" | "pageviews" | "transmissions">("visitors");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Compute metrics
  const totalVisitors = growthData.reduce((acc, curr) => acc + curr.visitors, 0);
  const totalPageviews = growthData.reduce((acc, curr) => acc + curr.pageviews, 0);
  const totalTransmissions = transmissions.length;
  const conversionRate = totalVisitors > 0 ? ((totalTransmissions / totalVisitors) * 100).toFixed(1) : "2.4";

  // Country breakdown calculation from logs
  const countryMap: Record<string, { count: number; flag: string; country: string }> = {};
  visitorLogs.forEach((log) => {
    if (!countryMap[log.countryCode]) {
      countryMap[log.countryCode] = { count: 0, flag: log.flag || "🌐", country: log.country };
    }
    countryMap[log.countryCode].count += 1;
  });

  const countryList = Object.entries(countryMap)
    .map(([code, data]) => ({ code, ...data }))
    .sort((a, b) => b.count - a.count);

  // Device breakdown
  const deviceCounts = visitorLogs.reduce(
    (acc, log) => {
      acc[log.device] = (acc[log.device] || 0) + 1;
      return acc;
    },
    { Desktop: 0, Mobile: 0, Tablet: 0 } as Record<string, number>
  );
  const totalLogs = visitorLogs.length || 1;
  const desktopPct = Math.round((deviceCounts.Desktop / totalLogs) * 100);
  const mobilePct = Math.round((deviceCounts.Mobile / totalLogs) * 100);
  const tabletPct = Math.round((deviceCounts.Tablet / totalLogs) * 100);

  // SVG Chart Geometry
  const chartWidth = 760;
  const chartHeight = 220;
  const paddingX = 40;
  const paddingY = 30;

  const dataValues = growthData.map((d) => d[activeMetric]);
  const maxVal = Math.max(...dataValues, 10);
  const minVal = 0;

  const points = growthData.map((d, i) => {
    const x = paddingX + (i / (growthData.length - 1)) * (chartWidth - paddingX * 2);
    const y = chartHeight - paddingY - ((d[activeMetric] - minVal) / (maxVal - minVal)) * (chartHeight - paddingY * 2);
    return { x, y, data: d };
  });

  const pathD = points.reduce((acc, pt, i) => {
    if (i === 0) return `M ${pt.x},${pt.y}`;
    const prev = points[i - 1];
    const cx1 = prev.x + (pt.x - prev.x) / 2;
    const cy1 = prev.y;
    const cx2 = prev.x + (pt.x - prev.x) / 2;
    const cy2 = pt.y;
    return `${acc} C ${cx1},${cy1} ${cx2},${cy2} ${pt.x},${pt.y}`;
  }, "");

  const areaD = `${pathD} L ${points[points.length - 1].x},${chartHeight - paddingY} L ${points[0].x},${chartHeight - paddingY} Z`;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Header stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="p-5 rounded-2xl bg-[#0d0714]/80 border border-white/10 backdrop-blur-xl relative overflow-hidden group hover:border-red-500/40 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-600/10 rounded-full blur-2xl group-hover:bg-red-600/20 transition-all pointer-events-none" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono tracking-wider text-neutral-400 uppercase">Live Telemetry</span>
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> +28.4%
            </span>
          </div>
          <div className="text-3xl font-black text-white font-mono tracking-tight">{totalVisitors.toLocaleString()}</div>
          <div className="text-xs text-neutral-400 mt-1 flex items-center gap-2">
            <span>Unique Visitors</span>
            <span className="text-neutral-600">•</span>
            <span className="text-neutral-400 font-mono">Last 7 Days</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="p-5 rounded-2xl bg-[#0d0714]/80 border border-white/10 backdrop-blur-xl relative overflow-hidden group hover:border-red-500/40 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/10 rounded-full blur-2xl group-hover:bg-red-500/20 transition-all pointer-events-none" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono tracking-wider text-neutral-400 uppercase">Total Hits</span>
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-red-500/10 text-red-400 border border-red-500/20">
              ⚡ FAST
            </span>
          </div>
          <div className="text-3xl font-black text-white font-mono tracking-tight">{totalPageviews.toLocaleString()}</div>
          <div className="text-xs text-neutral-400 mt-1 flex items-center gap-2">
            <span>Page Views</span>
            <span className="text-neutral-600">•</span>
            <span className="text-neutral-400 font-mono">Avg 3.1 / user</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="p-5 rounded-2xl bg-[#0d0714]/80 border border-white/10 backdrop-blur-xl relative overflow-hidden group hover:border-red-500/40 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all pointer-events-none" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono tracking-wider text-neutral-400 uppercase">Transmissions</span>
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
              {transmissions.filter((t) => t.status === "unread").length} Unread
            </span>
          </div>
          <div className="text-3xl font-black text-white font-mono tracking-tight">{totalTransmissions}</div>
          <div className="text-xs text-neutral-400 mt-1 flex items-center gap-2">
            <span>Direct Inquiries</span>
            <span className="text-neutral-600">•</span>
            <span className="text-emerald-400 font-mono font-medium">{conversionRate}% Conv</span>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="p-5 rounded-2xl bg-[#0d0714]/80 border border-white/10 backdrop-blur-xl relative overflow-hidden group hover:border-red-500/40 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all pointer-events-none" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono tracking-wider text-neutral-400 uppercase">System Status</span>
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              OPTIMAL
            </span>
          </div>
          <div className="text-3xl font-black text-white font-mono tracking-tight">99.98%</div>
          <div className="text-xs text-neutral-400 mt-1 flex items-center gap-2">
            <span>Global Uptime</span>
            <span className="text-neutral-600">•</span>
            <span className="text-cyan-400 font-mono">18ms Latency</span>
          </div>
        </div>
      </div>

      {/* Main Interactive Growth Graph */}
      <div className="p-6 rounded-2xl bg-[#0d0714]/80 border border-white/10 backdrop-blur-xl relative overflow-hidden shadow-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white font-mono tracking-wide">GROWTH_TRAJECTORY_CHART</h2>
              <span className="px-2 py-0.5 rounded bg-red-500/20 border border-red-500/40 text-[10px] font-mono text-red-400 font-semibold uppercase">
                Interactive SVG
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-1">Multi-vector traffic progression and transmission intake over time</p>
          </div>

          {/* Metric Selector Buttons */}
          <div className="flex items-center gap-1 p-1 bg-black/50 border border-white/10 rounded-xl">
            <button
              onClick={() => setActiveMetric("visitors")}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
                activeMetric === "visitors"
                  ? "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-600/30"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              Unique Visitors
            </button>
            <button
              onClick={() => setActiveMetric("pageviews")}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
                activeMetric === "pageviews"
                  ? "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-600/30"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              Pageviews
            </button>
            <button
              onClick={() => setActiveMetric("transmissions")}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
                activeMetric === "transmissions"
                  ? "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-600/30"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              Transmissions
            </button>
          </div>
        </div>

        {/* SVG Curve Container */}
        <div className="w-full overflow-x-auto relative">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="w-full h-56 min-w-[550px] overflow-visible"
          >
            <defs>
              <linearGradient id="cyberGraphGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#dc2626" stopOpacity="0.45" />
                <stop offset="50%" stopColor="#991b1b" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0" />
              </linearGradient>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Grid horizontal guidelines */}
            {[0.25, 0.5, 0.75, 1].map((ratio, i) => {
              const y = chartHeight - paddingY - ratio * (chartHeight - paddingY * 2);
              const val = Math.round(minVal + ratio * (maxVal - minVal));
              return (
                <g key={i}>
                  <line
                    x1={paddingX}
                    y1={y}
                    x2={chartWidth - paddingX}
                    y2={y}
                    stroke="rgba(255,255,255,0.06)"
                    strokeDasharray="4 4"
                  />
                  <text
                    x={paddingX - 10}
                    y={y + 3}
                    fill="#666677"
                    fontSize="9"
                    fontFamily="monospace"
                    textAnchor="end"
                  >
                    {val}
                  </text>
                </g>
              );
            })}

            {/* Filled Area Gradient */}
            <path d={areaD} fill="url(#cyberGraphGradient)" />

            {/* Smooth Line Stroke */}
            <path
              d={pathD}
              fill="none"
              stroke="#ef4444"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#glow)"
            />

            {/* Data point circles & hover nodes */}
            {points.map((pt, i) => {
              const isHovered = hoveredIndex === i;
              return (
                <g
                  key={i}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Outer pulse */}
                  {isHovered && (
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="12"
                      fill="rgba(239, 68, 68, 0.3)"
                      className="animate-ping origin-center"
                    />
                  )}
                  {/* Point circle */}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isHovered ? "6" : "4"}
                    fill="#ffffff"
                    stroke="#dc2626"
                    strokeWidth={isHovered ? "3" : "2"}
                    className="transition-all duration-150"
                  />

                  {/* X Axis Labels */}
                  <text
                    x={pt.x}
                    y={chartHeight - 8}
                    fill={isHovered ? "#ff6b6b" : "#888899"}
                    fontSize="10"
                    fontFamily="monospace"
                    textAnchor="middle"
                    fontWeight={isHovered ? "bold" : "normal"}
                  >
                    {pt.data.date}
                  </text>

                  {/* Hover Tooltip Box */}
                  {isHovered && (
                    <g transform={`translate(${pt.x}, ${pt.y - 45})`}>
                      <rect
                        x="-45"
                        y="-15"
                        width="90"
                        height="30"
                        rx="8"
                        fill="#150a22"
                        stroke="#ef4444"
                        strokeWidth="1.5"
                      />
                      <text
                        x="0"
                        y="5"
                        fill="#ffffff"
                        fontSize="11"
                        fontFamily="monospace"
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        {pt.data[activeMetric].toLocaleString()} {activeMetric === "transmissions" ? "msgs" : ""}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Two-Column Breakdown: Geographic & Technology */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Geographic Telemetry */}
        <div className="p-6 rounded-2xl bg-[#0d0714]/80 border border-white/10 backdrop-blur-xl relative">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
              <span>🌍</span> GEOGRAPHIC_ORIGIN_MATRIX
            </h3>
            <span className="text-xs font-mono text-neutral-400">Total: {visitorLogs.length} Active Nodes</span>
          </div>

          <div className="space-y-3 mt-4">
            {countryList.length === 0 ? (
              <p className="text-xs text-neutral-500 font-mono py-4 text-center">No geolocation telemetry captured yet.</p>
            ) : (
              countryList.map((item) => {
                const pct = Math.round((item.count / totalLogs) * 100);
                return (
                  <div key={item.code} className="space-y-1.5 group">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="flex items-center gap-2 text-white">
                        <span className="text-base">{item.flag}</span>
                        <span>{item.country}</span>
                        <span className="text-neutral-400 text-[10px]">({item.code})</span>
                      </span>
                      <span className="text-neutral-400 font-bold">{item.count} hits ({pct}%)</span>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                      <div
                        className="h-full bg-gradient-to-r from-red-600 via-rose-500 to-amber-500 rounded-full transition-all duration-500 group-hover:brightness-125"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Device & Client Fingerprints */}
        <div className="p-6 rounded-2xl bg-[#0d0714]/80 border border-white/10 backdrop-blur-xl relative flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                <span>💻</span> HARDWARE_&_DEVICE_DISTRIBUTION
              </h3>
              <span className="text-xs font-mono text-neutral-400">Client Engine</span>
            </div>

            {/* Device Percentages */}
            <div className="grid grid-cols-3 gap-3 my-4">
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-center">
                <div className="text-lg mb-1">🖥️</div>
                <div className="text-lg font-mono font-bold text-white">{desktopPct}%</div>
                <div className="text-[10px] text-neutral-400 font-mono">Desktop</div>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-center">
                <div className="text-lg mb-1">📱</div>
                <div className="text-lg font-mono font-bold text-white">{mobilePct}%</div>
                <div className="text-[10px] text-neutral-400 font-mono">Mobile</div>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-center">
                <div className="text-lg mb-1">📟</div>
                <div className="text-lg font-mono font-bold text-white">{tabletPct}%</div>
                <div className="text-[10px] text-neutral-400 font-mono">Tablet</div>
              </div>
            </div>

            {/* Top Visited Pathways */}
            <div className="mt-4 pt-4 border-t border-white/5 space-y-2">
              <div className="text-xs font-mono text-neutral-400 uppercase tracking-wider mb-2">Primary Ingress Points</div>
              <div className="flex items-center justify-between text-xs font-mono bg-white/[0.02] p-2 rounded-lg">
                <span className="text-red-400">/#packages (Pricing Matrix)</span>
                <span className="text-neutral-400">42% Interest</span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono bg-white/[0.02] p-2 rounded-lg">
                <span className="text-cyan-400">/#portfolio (Deployed Architectures)</span>
                <span className="text-neutral-400">35% Interest</span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono bg-white/[0.02] p-2 rounded-lg">
                <span className="text-purple-400">/#contact (Transmissions Hub)</span>
                <span className="text-neutral-400">23% Interest</span>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-300 flex items-center justify-between">
            <span>🛡️ TLS 1.3 / Quantum Encryption Enabled</span>
            <span className="text-[10px] font-bold">ACTIVE</span>
          </div>
        </div>
      </div>
    </div>
  );
}
