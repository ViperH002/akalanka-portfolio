import { NextRequest, NextResponse } from "next/server";
import { chatRequestSchema } from "@/lib/validation/chat";
import { checkRateLimitAsync, getClientIp } from "@/lib/security/rate-limit";
import { validateOrigin, csrfErrorResponse } from "@/lib/security/csrf";
import { aiService } from "@/services/ai.service";
import { logger } from "@/lib/logger";
import { ChatApiResponse } from "@/types/ai";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    // 0. Validate Request Origin (CSRF defense)
    if (!validateOrigin(req)) {
      return csrfErrorResponse();
    }

    // 1. Enforce IP-based rate limiting (Distributed Upstash Redis with in-memory fallback)
    const clientIp = getClientIp(req);
    const maxChatPerMinute = parseInt(process.env.RATE_LIMIT_CHAT_PER_MINUTE || "25", 10);
    const rateLimit = await checkRateLimitAsync(`chat_${clientIp}`, maxChatPerMinute, 60_000);

    if (!rateLimit.allowed) {
      logger.warn("AI chat rate limit reached", {
        subsystem: "chat",
        data: { ip: clientIp, resetTime: rateLimit.resetTime },
      });
      return NextResponse.json<ChatApiResponse>(
        {
          success: false,
          message: `Rate limit reached. Neural link cooling down. Please retry in ${rateLimit.resetTime} seconds.`,
          conversationId: "rate_limited",
          shouldSpeak: false,
        },
        { status: 429, headers: { "Retry-After": String(rateLimit.resetTime) } }
      );
    }

    // 2. Validate request payload with Zod
    let rawBody: unknown;
    try {
      rawBody = await req.json();
    } catch {
      return NextResponse.json<ChatApiResponse>(
        {
          success: false,
          message: "Malformed transmission format. Please provide valid JSON.",
          conversationId: "error",
          shouldSpeak: false,
        },
        { status: 400 }
      );
    }

    const validationResult = chatRequestSchema.safeParse(rawBody);
    if (!validationResult.success) {
      const errorMsg = validationResult.error.issues[0]?.message || "Invalid input parameters.";
      return NextResponse.json<ChatApiResponse>(
        {
          success: false,
          message: errorMsg,
          conversationId: "validation_error",
          shouldSpeak: false,
        },
        { status: 400 }
      );
    }

    const { message, conversationId, history } = validationResult.data;

    // 3. Delegate generation to AI Domain Service
    const assistantReply = await aiService.generateReply({
      message,
      history,
    });

    return NextResponse.json<ChatApiResponse>(
      {
        success: true,
        message: assistantReply,
        conversationId,
        shouldSpeak: true,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch (error) {
    logger.error("Unexpected error in /api/chat route", {
      subsystem: "chat",
      error,
    });
    return NextResponse.json<ChatApiResponse>(
      {
        success: false,
        message: "AI systems are temporarily unavailable. Please try again.",
        conversationId: "internal_error",
        shouldSpeak: false,
      },
      { status: 500 }
    );
  }
}
