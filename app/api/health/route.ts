import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { checkRateLimit, getClientIp, getRateLimiterStatus } from "@/lib/security/rate-limit";
import { metricsCollector } from "@/lib/observability/metrics";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const startTime = performance.now();
  const requestId = request.headers.get("x-request-id") || crypto.randomUUID();
  const probeType = request.nextUrl.searchParams.get("probe");

  const ip = getClientIp(request);
  const rateLimit = checkRateLimit(`health_${ip}`, 120, 60_000);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Health probe rate limit reached. Cool down." },
      { status: 429, headers: { "Retry-After": String(rateLimit.resetTime) } }
    );
  }

  const baseHeaders: Record<string, string> = {
    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    Pragma: "no-cache",
    Expires: "0",
    "x-request-id": requestId,
  };

  // 1. Kubernetes / Container Liveness Probe (Sub-millisecond alive verification)
  if (probeType === "liveness") {
    const duration = performance.now() - startTime;
    metricsCollector.recordRequest(duration, 200);

    return NextResponse.json(
      {
        status: "alive",
        uptimeSeconds: Math.floor(process.uptime()),
        timestamp: new Date().toISOString(),
      },
      {
        status: 200,
        headers: baseHeaders,
      }
    );
  }

  const rateLimiterInfo = getRateLimiterStatus();

  // 2. Kubernetes / Container Readiness Probe (Service readiness verification)
  if (probeType === "readiness") {
    const isReady = rateLimiterInfo.mode !== undefined;
    const duration = performance.now() - startTime;
    metricsCollector.recordRequest(duration, isReady ? 200 : 503);

    return NextResponse.json(
      {
        status: isReady ? "ready" : "unready",
        ready: isReady,
        timestamp: new Date().toISOString(),
        subsystems: {
          rateLimiter: "online",
          rateLimiterMode: rateLimiterInfo.mode,
          authentication: "online",
          aiGateway: "ready",
          ttsService: process.env.ELEVENLABS_API_KEY ? "configured" : "fallback_mode",
        },
      },
      {
        status: isReady ? 200 : 503,
        headers: baseHeaders,
      }
    );
  }

  // 3. Full Comprehensive Health & Observability Metrics Probe
  const memory = process.memoryUsage();
  const metricsSnapshot = metricsCollector.getSnapshot();

  logger.debug("System health probe queried", {
    subsystem: "health",
    data: { requestId },
  });

  const duration = performance.now() - startTime;
  metricsCollector.recordRequest(duration, 200);

  return NextResponse.json(
    {
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      environment: process.env.NODE_ENV || "development",
      ...(process.env.NODE_ENV !== "production" ? { nodeVersion: process.version } : {}),
      memoryUsage: {
        rssMb: Math.round((memory.rss / (1024 * 1024)) * 10) / 10,
        heapTotalMb: Math.round((memory.heapTotal / (1024 * 1024)) * 10) / 10,
        heapUsedMb: Math.round((memory.heapUsed / (1024 * 1024)) * 10) / 10,
      },
      subsystems: {
        rateLimiter: "online",
        rateLimiterMode: rateLimiterInfo.mode,
        authentication: "online",
        aiGateway: "ready",
        ttsService: process.env.ELEVENLABS_API_KEY ? "configured" : "fallback_mode",
      },
      metrics: metricsSnapshot,
    },
    {
      status: 200,
      headers: baseHeaders,
    }
  );
}
