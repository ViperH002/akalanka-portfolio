import { logger } from "@/lib/logger";
import { leadStore } from "@/lib/storage/lead-store";

export interface ContactInquiryInput {
  name: string;
  email: string;
  projectType: string;
  budget: string;
  message: string;
  sourceIp: string;
}

export interface ContactInquiryResult {
  success: boolean;
  message: string;
  timestamp: string;
  dispatched: boolean;
  transmissionId: string | null;
}

/**
 * HTML/Script tag sanitization helper
 * Strips dangerous HTML tags and script injection characters
 */
export function sanitizeString(str: string): string {
  return str
    .replace(/<[^>]*>?/gm, "") // Strip HTML tags
    .replace(/[<>]/g, "") // Remove remaining angle brackets
    .trim();
}

/**
 * Context-aware HTML entity escaper to prevent XSS and HTML injection
 */
export function escapeHtml(str: string): string {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Builds standard cybernetic HTML email notification template with strict output encoding
 */
function buildContactEmailHtml(data: {
  name: string;
  email: string;
  projectType: string;
  budget: string;
  message: string;
  sourceIp: string;
  receivedAt: string;
}): string {
  const safeName = escapeHtml(data.name);
  const safeEmail = escapeHtml(data.email);
  const safeProjectType = escapeHtml(data.projectType);
  const safeBudget = escapeHtml(data.budget);
  const safeMessage = escapeHtml(data.message);
  const safeSourceIp = escapeHtml(data.sourceIp);
  const safeReceivedAt = escapeHtml(data.receivedAt);
  const safeMailto = encodeURIComponent(data.email);

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #09090d; color: #e2e8f0; margin: 0; padding: 24px; }
    .card { max-width: 600px; margin: 0 auto; background: #121217; border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; padding: 32px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
    .badge { display: inline-block; font-size: 11px; font-family: monospace; font-weight: bold; padding: 4px 10px; border-radius: 9999px; background: rgba(0,240,255,0.12); color: #00f0ff; border: 1px solid rgba(0,240,255,0.3); text-transform: uppercase; margin-bottom: 16px; }
    h1 { font-size: 20px; color: #ffffff; margin-top: 0; margin-bottom: 20px; font-weight: 700; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 12px; }
    .field { margin-bottom: 16px; }
    .label { font-size: 11px; font-family: monospace; text-transform: uppercase; color: #94a3b8; margin-bottom: 4px; }
    .value { font-size: 15px; color: #f8fafc; font-weight: 500; }
    .msg-box { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 16px; margin-top: 8px; font-size: 14px; line-height: 1.6; white-space: pre-wrap; }
    .footer { margin-top: 28px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.08); font-size: 11px; font-family: monospace; color: #64748b; }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">⚡ INCOMING CLIENT TRANSMISSION</div>
    <h1>New Project Specification Received</h1>
    
    <div class="field">
      <div class="label">Client Name</div>
      <div class="value">${safeName}</div>
    </div>
    
    <div class="field">
      <div class="label">Direct Contact Email</div>
      <div class="value"><a href="mailto:${safeMailto}" style="color: #00f0ff; text-decoration: none;">${safeEmail}</a></div>
    </div>
    
    <div style="display: flex; gap: 24px;">
      <div class="field" style="flex: 1;">
        <div class="label">Project Architecture</div>
        <div class="value" style="text-transform: uppercase;">${safeProjectType}</div>
      </div>
      <div class="field" style="flex: 1;">
        <div class="label">Budget Tier</div>
        <div class="value" style="text-transform: uppercase; color: #4ade80;">${safeBudget}</div>
      </div>
    </div>
    
    <div class="field">
      <div class="label">Project Specifications</div>
      <div class="msg-box">${safeMessage}</div>
    </div>
    
    <div class="footer">
      Dispatched via Akalanka Egodawatte Portfolio Engine • Origin: ${safeSourceIp} • ${safeReceivedAt}
    </div>
  </div>
</body>
</html>
  `.trim();
}

export class ContactService {
  /**
   * Processes, sanitizes, and dispatches a verified client contact inquiry.
   */
  async processInquiry(input: ContactInquiryInput): Promise<ContactInquiryResult> {
    const receivedAt = new Date().toISOString();

    const sanitized = {
      name: sanitizeString(input.name),
      email: input.email.toLowerCase().trim(),
      projectType: input.projectType,
      budget: input.budget,
      message: sanitizeString(input.message),
      sourceIp: input.sourceIp,
      receivedAt,
    };

    logger.info("Received client contact inquiry", {
      subsystem: "contact",
      data: {
        email: sanitized.email,
        projectType: sanitized.projectType,
        budget: sanitized.budget,
        ip: sanitized.sourceIp,
      },
    });

    const leadId = crypto.randomUUID();

    // Persistently buffer the inquiry in the resilient lead store
    await leadStore.saveLead({
      id: leadId,
      receivedAt,
      name: sanitized.name,
      email: sanitized.email,
      projectType: sanitized.projectType,
      budget: sanitized.budget,
      message: sanitized.message,
      sourceIp: sanitized.sourceIp,
      dispatchStatus: "buffered",
      transmissionId: null,
    });

    let emailDispatched = false;
    let emailId: string | null = null;

    if (process.env.RESEND_API_KEY) {
      try {
        const fromAddress = process.env.RESEND_FROM_EMAIL || "contact@akviper.xyz";
        const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || "contact@akviper.xyz";
        const emailHtml = buildContactEmailHtml(sanitized);

        const resendRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: fromAddress,
            to: [adminEmail],
            reply_to: sanitized.email,
            subject: `⚡ [INQUIRY] ${sanitized.name} — ${sanitized.projectType.toUpperCase()} (${sanitized.budget.toUpperCase()})`,
            html: emailHtml,
          }),
        });

        const resendJson = await resendRes.json();
        if (resendRes.ok && resendJson?.id) {
          emailDispatched = true;
          emailId = resendJson.id;
          await leadStore.updateDispatchStatus(leadId, "dispatched", emailId);
          logger.info("Dispatched live email via Resend API", {
            subsystem: "contact",
            data: { emailId },
          });
        } else {
          await leadStore.updateDispatchStatus(leadId, "failed", null);
          logger.warn("Resend API warning during dispatch", {
            subsystem: "contact",
            data: { resendJson },
          });
        }
      } catch (emailErr) {
        await leadStore.updateDispatchStatus(leadId, "failed", null);
        logger.error("Failed to dispatch Resend email notification", {
          subsystem: "contact",
          error: emailErr,
        });
      }
    }

    return {
      success: true,
      message: "Transmission verified and securely dispatched.",
      timestamp: receivedAt,
      dispatched: emailDispatched,
      transmissionId: emailId || leadId,
    };
  }
}

export const contactService = new ContactService();
