import { NextRequest, NextResponse } from "next/server";
import { extractSessionContext, hasPermission } from "@/lib/security/rbac";
import { leadStore } from "@/lib/storage/lead-store";
import { TransmissionMessage } from "@/types";
import { z } from "zod";

export const dynamic = "force-dynamic";

const noCacheHeaders = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, private",
  Pragma: "no-cache",
  Expires: "0",
};

export async function GET(request: NextRequest) {
  const session = extractSessionContext(request);
  if (!session.authenticated || !hasPermission(session.role, "READ_LEADS")) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401, headers: noCacheHeaders });
  }

  const leads = await leadStore.getRecentLeads(100);
  const transmissions: TransmissionMessage[] = leads.map((l) => ({
    id: l.id,
    name: l.name,
    email: l.email,
    projectType: l.projectType,
    budget: l.budget,
    message: l.message,
    status: l.status || "unread",
    createdAt: l.receivedAt,
    ip: l.sourceIp,
    location: "Ingress Gateway",
    countryCode: "US",
  }));

  return NextResponse.json({ transmissions, total: transmissions.length }, { status: 200, headers: noCacheHeaders });
}

const patchSchema = z.object({
  id: z.string().min(1),
  status: z.enum(["unread", "read", "replied", "archived"]),
});

export async function PATCH(request: NextRequest) {
  const session = extractSessionContext(request);
  if (!session.authenticated || !hasPermission(session.role, "READ_LEADS")) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401, headers: noCacheHeaders });
  }

  try {
    const body = await request.json();
    const parsed = patchSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid status update payload" }, { status: 400, headers: noCacheHeaders });
    }

    const ok = await leadStore.updateLeadStatus(parsed.data.id, parsed.data.status);
    if (!ok) {
      return NextResponse.json({ error: "Transmission not found" }, { status: 404, headers: noCacheHeaders });
    }

    return NextResponse.json({ success: true }, { status: 200, headers: noCacheHeaders });
  } catch {
    return NextResponse.json({ error: "Malformed request payload" }, { status: 400, headers: noCacheHeaders });
  }
}

const deleteSchema = z.object({
  id: z.string().min(1),
});

export async function DELETE(request: NextRequest) {
  const session = extractSessionContext(request);
  if (!session.authenticated || !hasPermission(session.role, "DELETE_LEADS")) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401, headers: noCacheHeaders });
  }

  try {
    const { searchParams } = new URL(request.url);
    const queryId = searchParams.get("id");
    let targetId = queryId;

    if (!targetId) {
      try {
        const body = await request.json();
        const parsed = deleteSchema.safeParse(body);
        if (parsed.success) targetId = parsed.data.id;
      } catch {
        // Fallback
      }
    }

    if (!targetId) {
      return NextResponse.json({ error: "Transmission id is required" }, { status: 400, headers: noCacheHeaders });
    }

    const ok = await leadStore.deleteLead(targetId);
    return NextResponse.json({ success: ok }, { status: 200, headers: noCacheHeaders });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500, headers: noCacheHeaders });
  }
}
