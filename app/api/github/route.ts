import { NextResponse } from "next/server";
import { telemetryService } from "@/services/telemetry.service";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await telemetryService.getGitHubTelemetry();

    return NextResponse.json(data, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=600, stale-while-revalidate=1200",
      },
    });
  } catch (err) {
    logger.error("Error in /api/github route", {
      subsystem: "telemetry",
      error: err,
    });
    return NextResponse.json(
      { error: "Internal telemetry synchronization failure." },
      { status: 500 }
    );
  }
}
