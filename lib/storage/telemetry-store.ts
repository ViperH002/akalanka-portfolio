import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { logger } from "@/lib/logger";
import { VisitorLog, AnalyticsGrowthPoint } from "@/types";

export function getCountryFlag(countryCode: string): string {
  if (!countryCode || countryCode.length !== 2) return "🌐";
  try {
    const codePoints = countryCode
      .toUpperCase()
      .split("")
      .map((char) => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  } catch {
    return "🌐";
  }
}

export function parseUserAgent(ua: string): {
  browser: string;
  os: string;
  device: "Desktop" | "Mobile" | "Tablet";
} {
  if (!ua) {
    return { browser: "Direct Transmission", os: "System Node", device: "Desktop" };
  }

  const isTablet = /iPad|Tablet|(Android(?!.*Mobile))/i.test(ua);
  const isMobile = !isTablet && /Mobile|iPhone|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(ua);
  const device: "Desktop" | "Mobile" | "Tablet" = isTablet ? "Tablet" : isMobile ? "Mobile" : "Desktop";

  let os = "Other OS";
  if (/Windows NT 10/i.test(ua)) os = "Windows 11/10";
  else if (/Windows/i.test(ua)) os = "Windows";
  else if (/iPhone|iPad|iPod/i.test(ua)) os = "iOS";
  else if (/Mac OS X/i.test(ua)) os = "macOS";
  else if (/Android/i.test(ua)) os = "Android";
  else if (/Linux/i.test(ua)) os = "Linux";

  let browser = "Other Browser";
  if (/Edg\//i.test(ua)) browser = "Edge";
  else if (/Chrome\//i.test(ua)) browser = "Chrome";
  else if (/Safari\//i.test(ua) && !/Chrome/i.test(ua)) browser = "Safari";
  else if (/Firefox\//i.test(ua)) browser = "Firefox";

  return { browser, os, device };
}

export interface AggregatedMetrics {
  totalVisitors: number;
  totalPageviews: number;
  activeToday: number;
  growthData: AnalyticsGrowthPoint[];
  deviceDistribution: {
    desktopPct: number;
    mobilePct: number;
    tabletPct: number;
  };
  countryList: Array<{
    code: string;
    country: string;
    flag: string;
    count: number;
    percentage: number;
  }>;
}

class TelemetryStore {
  private readonly maxInMemory = 1000;
  private readonly filePath = path.join(process.cwd(), "data", "visitor-telemetry.json");
  private memoryBuffer: VisitorLog[] = [];
  private initialized = false;
  private writeQueue: Promise<void> = Promise.resolve();

  private async ensureInitialized(): Promise<void> {
    if (this.initialized) return;
    this.initialized = true;

    try {
      const data = await fs.readFile(this.filePath, "utf-8");
      if (data.trim()) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) {
          this.memoryBuffer = parsed.slice(-this.maxInMemory);
        }
      }
    } catch {
      this.memoryBuffer = [];
    }
  }

  private async persistBufferAtomically(): Promise<void> {
    this.writeQueue = this.writeQueue
      .then(async () => {
        const dir = path.dirname(this.filePath);
        await fs.mkdir(dir, { recursive: true });
        const tempPath = `${this.filePath}.${Date.now()}.${Math.random().toString(36).substring(2, 8)}.tmp`;

        await fs.writeFile(tempPath, JSON.stringify(this.memoryBuffer, null, 2), "utf-8");
        await fs.rename(tempPath, this.filePath);
      })
      .catch((err) => {
        logger.warn("Disk atomic write error in telemetryStore", { subsystem: "storage", error: err });
      });

    await this.writeQueue;
  }

  /**
   * Records a visitor navigation event
   */
  async recordVisit(input: {
    ip: string;
    city?: string;
    country?: string;
    countryCode?: string;
    userAgent?: string;
    page: string;
    referrer?: string;
  }): Promise<VisitorLog> {
    await this.ensureInitialized();

    const { browser, os, device } = parseUserAgent(input.userAgent || "");
    const countryCode = (input.countryCode || "US").toUpperCase().slice(0, 2);
    const country = input.country || (countryCode === "US" ? "United States" : countryCode);
    const city = input.city || "Regional Gateway";

    const log: VisitorLog = {
      id: `log-${Date.now()}-${crypto.randomBytes(3).toString("hex")}`,
      ip: input.ip.replace(/[\r\n]/g, ""),
      city,
      country,
      countryCode,
      flag: getCountryFlag(countryCode),
      browser,
      os,
      device,
      page: input.page || "/",
      referrer: input.referrer || "Direct Transmission",
      timestamp: new Date().toISOString(),
    };

    this.memoryBuffer.push(log);
    if (this.memoryBuffer.length > this.maxInMemory) {
      this.memoryBuffer.shift();
    }

    try {
      await this.persistBufferAtomically();
    } catch (err) {
      logger.warn("Failed to persist visitor telemetry to disk", {
        subsystem: "storage",
        error: err,
      });
    }

    return log;
  }

  /**
   * Retrieves recent visitor logs in descending chronological order
   */
  async getRecentLogs(limit = 100): Promise<VisitorLog[]> {
    await this.ensureInitialized();
    return this.memoryBuffer.slice(-limit).reverse();
  }

  /**
   * Computes aggregated metrics, device distributions, country matrix, and 7-day trajectory
   */
  async getAggregatedMetrics(transmissionCount = 0): Promise<AggregatedMetrics> {
    await this.ensureInitialized();

    const logs = this.memoryBuffer;
    const totalPageviews = logs.length;

    // Unique visitors based on unique IPs
    const uniqueIps = new Set(logs.map((l) => l.ip));
    const totalVisitors = uniqueIps.size;

    // Active today
    const todayStr = new Date().toISOString().slice(0, 10);
    const todayLogs = logs.filter((l) => l.timestamp.startsWith(todayStr));
    const activeToday = new Set(todayLogs.map((l) => l.ip)).size;

    // Device breakdown
    const devices = { Desktop: 0, Mobile: 0, Tablet: 0 };
    logs.forEach((l) => {
      if (l.device in devices) {
        devices[l.device] += 1;
      } else {
        devices.Desktop += 1;
      }
    });

    const totalLogsForDevice = logs.length || 1;
    const desktopPct = Math.round((devices.Desktop / totalLogsForDevice) * 100);
    const mobilePct = Math.round((devices.Mobile / totalLogsForDevice) * 100);
    const tabletPct = Math.max(0, 100 - desktopPct - mobilePct);

    // Country breakdown
    const countryMap: Record<string, { country: string; flag: string; count: number }> = {};
    logs.forEach((l) => {
      const code = l.countryCode || "UN";
      if (!countryMap[code]) {
        countryMap[code] = {
          country: l.country || "Global",
          flag: l.flag || getCountryFlag(code),
          count: 0,
        };
      }
      countryMap[code].count += 1;
    });

    const countryList = Object.entries(countryMap)
      .map(([code, data]) => ({
        code,
        country: data.country,
        flag: data.flag,
        count: data.count,
        percentage: totalPageviews > 0 ? Math.round((data.count / totalPageviews) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count);

    // 7-day growth trajectory
    const days: Record<string, { visitors: Set<string>; pageviews: number }> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateKey = d.toISOString().slice(0, 10);
      days[dateKey] = { visitors: new Set<string>(), pageviews: 0 };
    }

    logs.forEach((l) => {
      const dateKey = l.timestamp.slice(0, 10);
      if (days[dateKey]) {
        days[dateKey].visitors.add(l.ip);
        days[dateKey].pageviews += 1;
      }
    });

    const growthData: AnalyticsGrowthPoint[] = Object.entries(days).map(([date, data]) => ({
      date: new Date(date).toLocaleDateString("en-US", { weekday: "short", month: "numeric", day: "numeric" }),
      visitors: data.visitors.size,
      pageviews: data.pageviews,
      transmissions: Math.round(transmissionCount / 7),
    }));

    return {
      totalVisitors,
      totalPageviews,
      activeToday,
      growthData,
      deviceDistribution: {
        desktopPct,
        mobilePct,
        tabletPct,
      },
      countryList,
    };
  }
}

export const telemetryStore = new TelemetryStore();
