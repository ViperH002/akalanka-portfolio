import { NextResponse } from "next/server";
import { z } from "zod";
import { checkRateLimit, getClientIp } from "@/lib/security/rate-limit";
import { validateOrigin, csrfErrorResponse } from "@/lib/security/csrf";
import { contactService } from "@/services/contact.service";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

// Zod Schema with strict boundary checks
const contactSchema = z.object({
  name: z
    .string()
    .min(2, "Name must contain at least 2 characters")
    .max(100, "Name must not exceed 100 characters"),
  email: z
    .string()
    .email("A valid email address is required")
    .max(150, "Email must not exceed 150 characters"),
  projectType: z.enum(
    ["landing", "business", "ecommerce", "webapp", "portfolio", "fivem", "other"],
    { message: "Invalid project architecture selected." }
  ),
  budget: z.enum(["starter", "business", "enterprise", "custom"], {
    message: "Invalid budget tier selected.",
  }),
  message: z
    .string()
    .min(10, "Specification details must contain at least 10 characters")
    .max(2000, "Specification details must not exceed 2000 characters"),
});

export async function POST(req: Request) {
  try {
    // 0. Validate Request Origin (CSRF defense)
    if (!validateOrigin(req)) {
      return csrfErrorResponse();
    }

    const ip = getClientIp(req);

    // 1. IP Rate Limiting: Max 5 transmissions per hour per IP
    const rateLimitKey = `contact:${ip}`;
    const limit = checkRateLimit(rateLimitKey, 5, 3600_000);

    if (!limit.allowed) {
      logger.warn("Contact transmission rate limit exceeded", {
        subsystem: "contact",
        data: { ip, resetTime: limit.resetTime },
      });
      return NextResponse.json(
        {
          error: `Transmission rate limit reached. Please wait ${limit.resetTime} seconds before submitting again.`,
          retryAfter: limit.resetTime,
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(limit.resetTime),
            "Cache-Control": "no-store, private",
          },
        }
      );
    }

    // 2. Parse body safely
    let rawBody: unknown;
    try {
      rawBody = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON transmission payload." },
        { status: 400, headers: { "Cache-Control": "no-store, private" } }
      );
    }

    // 3. Schema validation
    const parsed = contactSchema.safeParse(rawBody);
    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      const firstErrorMessage =
        Object.values(fieldErrors)[0]?.[0] || "Invalid submission parameters.";

      return NextResponse.json(
        { error: firstErrorMessage, details: fieldErrors },
        { status: 422, headers: { "Cache-Control": "no-store, private" } }
      );
    }

    // 4. Delegate to Contact Domain Service
    const result = await contactService.processInquiry({
      name: parsed.data.name,
      email: parsed.data.email,
      projectType: parsed.data.projectType,
      budget: parsed.data.budget,
      message: parsed.data.message,
      sourceIp: ip,
    });

    return NextResponse.json(result, {
      status: 200,
      headers: {
        "Cache-Control": "no-store, private",
      },
    });
  } catch (err) {
    logger.error("Unexpected failure in contact route handler", {
      subsystem: "contact",
      error: err,
    });
    return NextResponse.json(
      { error: "Transmission gateway error. Please try again later." },
      { status: 500, headers: { "Cache-Control": "no-store, private" } }
    );
  }
}
