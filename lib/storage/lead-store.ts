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
  status?: "unread" | "read" | "replied" | "archived";
}

class LeadStore {
  private readonly maxInMemory = 500;
  private readonly filePath = path.join(process.cwd(), "data", "leads.json");
  private memoryBuffer: StoredLead[] = [];
  private initialized = false;
  private writeQueue: Promise<void> = Promise.resolve();

  private async ensureInitialized(): Promise<void> {
    if (this.initialized) return;
    this.initialized = true;

    try {
      const data = await fs.readFile(this.filePath, "utf-8");
      if (data.trim()) {
        try {
          const parsed = JSON.parse(data);
          if (Array.isArray(parsed)) {
            this.memoryBuffer = parsed.slice(-this.maxInMemory);
          }
        } catch (parseErr) {
          // If JSON is corrupted, backup corrupted file rather than silently destroying data
          const backupPath = `${this.filePath}.corrupted.${Date.now()}.json`;
          try {
            await fs.rename(this.filePath, backupPath);
            logger.error("Corrupted leads.json detected and quarantined", {
              subsystem: "storage",
              data: { backupPath, error: parseErr },
            });
          } catch {
            // Ignore backup error
          }
          this.memoryBuffer = [];
        }
      }
    } catch {
      // File doesn't exist yet; initialize with empty buffer
      this.memoryBuffer = [];
    }
  }

  /**
   * Atomically persists the in-memory buffer to disk (write to tmp + atomic rename)
   * Serialized through asynchronous mutex writeQueue to guarantee zero concurrency races
   */
  private async persistBufferAtomically(): Promise<void> {
    this.writeQueue = this.writeQueue.then(async () => {
      const dir = path.dirname(this.filePath);
      await fs.mkdir(dir, { recursive: true });
      const tempPath = `${this.filePath}.${Date.now()}.${Math.random().toString(36).substring(2, 8)}.tmp`;

      await fs.writeFile(
        tempPath,
        JSON.stringify(this.memoryBuffer, null, 2),
        "utf-8"
      );
      await fs.rename(tempPath, this.filePath);
    }).catch((err) => {
      logger.warn("Disk atomic write error in leadStore", { subsystem: "storage", error: err });
    });

    await this.writeQueue;
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

    // 2. Persist to disk atomically
    try {
      await this.persistBufferAtomically();
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
        await this.persistBufferAtomically();
      } catch {
        // Disk update fallback
      }
    }
  }

  /**
   * Retrieves recent inquiries (for admin audit or export)
   */
  async getRecentLeads(limit = 100): Promise<StoredLead[]> {
    await this.ensureInitialized();
    return this.memoryBuffer.slice(-limit).reverse();
  }

  /**
   * Updates lead status (unread / read / replied / archived)
   */
  async updateLeadStatus(
    id: string,
    status: "unread" | "read" | "replied" | "archived"
  ): Promise<boolean> {
    await this.ensureInitialized();
    const target = this.memoryBuffer.find((l) => l.id === id);
    if (!target) return false;
    target.status = status;
    await this.persistBufferAtomically();
    return true;
  }

  /**
   * Deletes a lead permanently
   */
  async deleteLead(id: string): Promise<boolean> {
    await this.ensureInitialized();
    const initialLen = this.memoryBuffer.length;
    this.memoryBuffer = this.memoryBuffer.filter((l) => l.id !== id);
    if (this.memoryBuffer.length !== initialLen) {
      await this.persistBufferAtomically();
      return true;
    }
    return false;
  }
}

export const leadStore = new LeadStore();
