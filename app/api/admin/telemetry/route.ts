import { NextRequest, NextResponse } from "next/server";
import { extractSessionContext, hasPermission } from "@/lib/security/rbac";
import { telemetryStore } from "@/lib/storage/telemetry-store";
import { leadStore } from "@/lib/storage/lead-store";

export const dynamic = "force-dynamic";

const noCacheHeaders = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, private",
  Pragma: "no-cache",
  Expires: "0",
};

export async function GET(request: NextRequest) {
  const session = extractSessionContext(request);
  if (!session.authenticated || !hasPermission(session.role, "SYSTEM_TELEMETRY")) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401, headers: noCacheHeaders });
  }

  try {
    const leads = await leadStore.getRecentLeads(100);
    const logs = await telemetryStore.getRecentLogs(100);
    const metrics = await telemetryStore.getAggregatedMetrics(leads.length);

    return NextResponse.json(
      {
        logs,
        metrics,
        totalLogs: logs.length,
        totalLeads: leads.length,
      },
      {
        status: 200,
        headers: noCacheHeaders,
      }
    );
  } catch {
    return NextResponse.json(
      { error: "Error compiling live telemetry" },
      {
        status: 500,
        headers: noCacheHeaders,
      }
    );
  }
}
