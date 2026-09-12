import { NextResponse } from "next/server";
import { telemetryService } from "@/services/telemetry.service";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

export async function GET() {
  const apiKey = process.env.WAKATIME_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "WakaTime API key not configured." },
      { status: 503 }
    );
  }

  try {
    const data = await telemetryService.getWakaTimeTelemetry();

    return NextResponse.json(data, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (err) {
    logger.error("Error in /api/wakatime route", {
      subsystem: "telemetry",
      error: err,
    });
    return NextResponse.json(
      { error: "Internal WakaTime telemetry gateway failure." },
      { status: 500 }
    );
  }
}
