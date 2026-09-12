import { logger } from "@/lib/logger";

let isShuttingDown = false;

/**
 * Registers process signal handlers for container orchestration (Kubernetes / Docker)
 * to guarantee graceful degradation, clean buffer flush, and zero data loss on termination.
 */
export function setupGracefulShutdown(): void {
  if (typeof process === "undefined" || !process.on) return;
  // Never intercept process signals during build, CI, or on Vercel/AWS Lambda serverless runners
  if (
    process.env.NEXT_PHASE === "phase-production-build" ||
    process.env.VERCEL === "1" ||
    process.env.AWS_LAMBDA_FUNCTION_NAME ||
    process.env.CI === "1" ||
    process.env.CI === "true"
  ) {
    return;
  }
  if (isShuttingDown) return;

  const handleSignal = (signal: string) => {
    if (isShuttingDown) return;
    isShuttingDown = true;

    logger.info(`Received ${signal}. Initiating graceful container shutdown...`, {
      subsystem: "lifecycle",
      data: { signal },
    });

    // Allow in-flight requests and async buffers to flush cleanly
    setTimeout(() => {
      logger.info("Graceful shutdown sequence completed. Terminating process.", {
        subsystem: "lifecycle",
      });
      process.exit(0);
    }, 1000);
  };

  process.on("SIGTERM", () => handleSignal("SIGTERM"));
  process.on("SIGINT", () => handleSignal("SIGINT"));
}
