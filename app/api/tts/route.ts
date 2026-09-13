import { NextRequest, NextResponse } from "next/server";
import { ttsRequestSchema } from "@/lib/validation/chat";
import { checkRateLimitAsync, getClientIp } from "@/lib/security/rate-limit";
import { validateOrigin, csrfErrorResponse } from "@/lib/security/csrf";
import { ttsService } from "@/services/tts.service";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    // 0. Validate Request Origin (CSRF defense)
    if (!validateOrigin(req)) {
      return csrfErrorResponse();
    }

    // 1. Rate limiting for TTS audio generation (distributed Redis with memory fallback)
    const clientIp = getClientIp(req);
    const maxTtsPerMinute = parseInt(process.env.RATE_LIMIT_TTS_PER_MINUTE || "15", 10);
    const rateLimit = await checkRateLimitAsync(`tts_${clientIp}`, maxTtsPerMinute, 60_000);

    if (!rateLimit.allowed) {
      logger.warn("TTS rate limit reached", {
        subsystem: "tts",
        data: { ip: clientIp, resetTime: rateLimit.resetTime },
      });
      return NextResponse.json(
        { error: `Vocal synthesis rate limit reached. Cool down: ${rateLimit.resetTime}s.` },
        { status: 429, headers: { "Retry-After": String(rateLimit.resetTime) } }
      );
    }

    // 2. Validate request
    let rawBody: unknown;
    try {
      rawBody = await req.json();
    } catch {
      return NextResponse.json({ error: "Malformed payload format." }, { status: 400 });
    }

    const validationResult = ttsRequestSchema.safeParse(rawBody);
    if (!validationResult.success) {
      const errorMsg = validationResult.error.issues[0]?.message || "Invalid text parameter.";
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    const { text } = validationResult.data;

    // 3. Delegate synthesis to TTS Domain Service
    const audioBuffer = await ttsService.synthesizeSpeech(text);

    if (!audioBuffer) {
      return NextResponse.json(
        {
          error: "Audio synthesis offline. Check server configuration or ElevenLabs API status.",
        },
        { status: 503 }
      );
    }

    const uint8Array = new Uint8Array(audioBuffer);

    return new NextResponse(uint8Array, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": String(uint8Array.byteLength),
        "Cache-Control": "public, max-age=86400, immutable",
      },
    });
  } catch (error) {
    logger.error("Error in /api/tts route handler", {
      subsystem: "tts",
      error,
    });
    return NextResponse.json(
      { error: "Internal error processing voice transmission." },
      { status: 500 }
    );
  }
}
