import fs from "fs/promises";
import path from "path";
import { logger } from "@/lib/logger";

export interface StoredLead {
  id: string;
  receivedAt: string;
  name: string;
  email: string;
  projectType: string;
  budget: string;
  message: string;
  sourceIp: string;
  dispatchStatus: "dispatched" | "buffered" | "failed";
  transmissionId: string | null;
}

class LeadStore {
  private readonly maxInMemory = 500;
  private readonly filePath = path.join(process.cwd(), "data", "leads.json");
  private memoryBuffer: StoredLead[] = [];
  private initialized = false;

  private async ensureInitialized(): Promise<void> {
    if (this.initialized) return;
    this.initialized = true;

    try {
      const data = await fs.readFile(this.filePath, "utf-8");
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        this.memoryBuffer = parsed.slice(-this.maxInMemory);
      }
    } catch {
      // File doesn't exist yet or read failed; initialize with empty buffer
      this.memoryBuffer = [];
    }
  }

  /**
   * Persistently saves an inquiry to disk and in-memory fail-safe ring
   */
  async saveLead(lead: StoredLead): Promise<void> {
    await this.ensureInitialized();

    // 1. Maintain in-memory sliding buffer
    this.memoryBuffer.push(lead);
    if (this.memoryBuffer.length > this.maxInMemory) {
      this.memoryBuffer.shift();
    }

    // 2. Persist to disk
    try {
      const dir = path.dirname(this.filePath);
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(
        this.filePath,
        JSON.stringify(this.memoryBuffer, null, 2),
        "utf-8"
      );
      logger.info("Lead safely persisted to resilient storage", {
        subsystem: "storage",
        data: { leadId: lead.id, status: lead.dispatchStatus },
      });
    } catch (err) {
      logger.warn("Disk write failed for lead, kept in resilient memory buffer", {
        subsystem: "storage",
        error: err,
        data: { leadId: lead.id },
      });
    }
  }

  /**
   * Updates dispatch status of an existing lead (e.g. after third-party API response)
   */
  async updateDispatchStatus(
    id: string,
    dispatchStatus: "dispatched" | "failed",
    transmissionId?: string | null
  ): Promise<void> {
    await this.ensureInitialized();

    const target = this.memoryBuffer.find((l) => l.id === id);
    if (target) {
      target.dispatchStatus = dispatchStatus;
      if (transmissionId !== undefined) {
        target.transmissionId = transmissionId;
      }

      try {
        await fs.writeFile(
          this.filePath,
          JSON.stringify(this.memoryBuffer, null, 2),
          "utf-8"
        );
      } catch {
        // Disk update fallback
      }
    }
  }

  /**
   * Retrieves recent inquiries (for admin audit or export)
   */
  async getRecentLeads(limit = 50): Promise<StoredLead[]> {
    await this.ensureInitialized();
    return this.memoryBuffer.slice(-limit).reverse();
  }
}

export const leadStore = new LeadStore();
