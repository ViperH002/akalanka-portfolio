import { NextResponse } from "next/server";
import { getClientIp, checkRateLimit } from "@/lib/security/rate-limit";
import { telemetryStore } from "@/lib/storage/telemetry-store";
import { z } from "zod";

export const dynamic = "force-dynamic";

const visitSchema = z.object({
  page: z.string().max(256).default("/"),
  referrer: z.string().max(512).optional(),
});

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);

    // 1. Rate-limit telemetry calls (max 30 per minute per IP)
    const rateCheck = checkRateLimit(`telemetry:${ip}`, 30, 60_000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: "Too many telemetry events" },
        { status: 429, headers: { "Cache-Control": "no-store, private" } }
      );
    }

    // 2. Validate payload boundary (max 4KB)
    const contentLength = req.headers.get("content-length");
    if (contentLength && parseInt(contentLength, 10) > 4096) {
      return NextResponse.json(
        { error: "Payload too large" },
        { status: 413, headers: { "Cache-Control": "no-store, private" } }
      );
    }

    let bodyData: unknown = {};
    const contentType = req.headers.get("content-type") || "";
    if (contentType.toLowerCase().includes("application/json")) {
      try {
        bodyData = await req.json();
      } catch {
        // Fallback for malformed beacon payload
      }
    }

    const parsed = visitSchema.safeParse(bodyData);
    const { page, referrer } = parsed.success ? parsed.data : { page: "/", referrer: "" };

    // 3. Extract Geo-IP headers from Vercel / edge proxies
    const countryCode = req.headers.get("x-vercel-ip-country") || (ip === "127.0.0.1" ? "LK" : "US");
    const city = req.headers.get("x-vercel-ip-city") || (ip === "127.0.0.1" ? "Local Dev" : "Edge Node");
    const userAgent = req.headers.get("user-agent") || "";

    // 4. Record visit in resilient telemetry store
    const log = await telemetryStore.recordVisit({
      ip,
      countryCode,
      city,
      userAgent,
      page,
      referrer,
    });

    return NextResponse.json(
      { success: true, id: log.id },
      {
        status: 200,
        headers: { "Cache-Control": "no-store, private" },
      }
    );
  } catch {
    return NextResponse.json(
      { error: "Telemetry recording error" },
      { status: 500, headers: { "Cache-Control": "no-store, private" } }
    );
  }
}
