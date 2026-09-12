type LogLevel = "debug" | "info" | "warn" | "error";

interface LogPayload {
  message: string;
  subsystem?: string;
  correlationId?: string;
  data?: Record<string, unknown>;
  error?: Error | unknown;
}

/**
 * Redacts known sensitive fields from logged data
 */
function sanitizeLogData(obj: Record<string, unknown>): Record<string, unknown> {
  const SENSITIVE_KEYS = new Set([
    "password",
    "passcode",
    "token",
    "secret",
    "apiKey",
    "authorization",
    "cookie",
    "session",
  ]);

  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (SENSITIVE_KEYS.has(key.toLowerCase()) || key.toLowerCase().includes("key")) {
      sanitized[key] = "[REDACTED]";
    } else if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      sanitized[key] = sanitizeLogData(value as Record<string, unknown>);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

class Logger {
  private isProduction = process.env.NODE_ENV === "production";

  private log(level: LogLevel, payload: LogPayload) {
    const timestamp = new Date().toISOString();
    const subsystem = payload.subsystem || "system";
    const correlationId = payload.correlationId;

    const sanitizedData = payload.data ? sanitizeLogData(payload.data) : undefined;
    const errorDetails =
      payload.error instanceof Error
        ? { name: payload.error.name, message: payload.error.message, stack: payload.error.stack }
        : payload.error;

    if (this.isProduction) {
      // Single-line JSON format for production log aggregators
      const record = {
        timestamp,
        level,
        subsystem,
        correlationId,
        message: payload.message,
        data: sanitizedData,
        error: errorDetails,
      };
      console[level === "error" ? "error" : level === "warn" ? "warn" : "log"](
        JSON.stringify(record)
      );
    } else {
      // Formatted developer output
      const prefix = `[${timestamp}] [${level.toUpperCase()}] [${subsystem}]`;
      if (level === "error") {
        console.error(prefix, payload.message, sanitizedData || "", errorDetails || "");
      } else if (level === "warn") {
        console.warn(prefix, payload.message, sanitizedData || "");
      } else {
        console.log(prefix, payload.message, sanitizedData || "");
      }
    }
  }

  debug(message: string, options?: Omit<LogPayload, "message">) {
    if (!this.isProduction) {
      this.log("debug", { message, ...options });
    }
  }

  info(message: string, options?: Omit<LogPayload, "message">) {
    this.log("info", { message, ...options });
  }

  warn(message: string, options?: Omit<LogPayload, "message">) {
    this.log("warn", { message, ...options });
  }

  error(message: string, options?: Omit<LogPayload, "message">) {
    this.log("error", { message, ...options });
  }
}

export const logger = new Logger();
