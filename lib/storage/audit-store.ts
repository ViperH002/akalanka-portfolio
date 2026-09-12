import fs from "fs/promises";
import path from "path";
import { logger } from "@/lib/logger";

export interface AuditEvent {
  id: string;
  timestamp: string;
  action:
    | "login_success"
    | "login_failed"
    | "lockout_triggered"
    | "logout"
    | "rate_limit_exceeded";
  ip: string;
  details?: Record<string, unknown>;
}

class AuditStore {
  private readonly maxInMemory = 500;
  private readonly logPath = path.join(process.cwd(), "data", "audit.log");
  private memoryBuffer: AuditEvent[] = [];

  /**
   * Records a security or authentication audit event
   */
  async recordEvent(
    eventData: Omit<AuditEvent, "id" | "timestamp">
  ): Promise<AuditEvent> {
    const event: AuditEvent = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      action: eventData.action,
      ip: eventData.ip.replace(/[\r\n]/g, ""), // Sanitize to prevent log injection
      details: eventData.details,
    };

    // 1. In-memory buffer
    this.memoryBuffer.push(event);
    if (this.memoryBuffer.length > this.maxInMemory) {
      this.memoryBuffer.shift();
    }

    // 2. Append JSON Line to audit log file
    try {
      const dir = path.dirname(this.logPath);
      await fs.mkdir(dir, { recursive: true });
      const line = JSON.stringify(event) + "\n";
      await fs.appendFile(this.logPath, line, "utf-8");
    } catch (err) {
      logger.warn("Audit disk write failed, preserved in memory buffer", {
        subsystem: "audit",
        error: err,
      });
    }

    return event;
  }

  /**
   * Retrieves recent audit events for administrative inspection
   */
  getRecentEvents(limit = 50): AuditEvent[] {
    return this.memoryBuffer.slice(-limit).reverse();
  }
}

export const auditStore = new AuditStore();
