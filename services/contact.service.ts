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
 * Builds cybernetic emerald ambient card HTML email notification template
 */
function buildContactEmailHtml(data: {
  leadId?: string;
  name: string;
  email: string;
  projectType: string;
  budget: string;
  message: string;
  sourceIp: string;
  receivedAt: string;
}): string {
  const shortId = (data.leadId || "28630384").replace(/-/g, "").slice(0, 8).toUpperCase();
  const dateFormatted = new Date(data.receivedAt || Date.now()).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
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
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Client Message</title>
</head>
<body style="margin: 0; padding: 32px 14px; background-color: #030a06; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <table width="100%" border="0" cellpadding="0" cellspacing="0" align="center" style="max-width: 620px; margin: 0 auto;">
    <tr>
      <td>
        <!-- Emerald Ambient Glow Container Card -->
        <div style="background-color: #071f14; background-image: radial-gradient(circle at 20% 30%, #165231 0%, #092c1c 45%, #04140c 90%); border: 1px solid rgba(74, 222, 128, 0.28); border-radius: 24px; padding: 32px 34px; box-shadow: 0 20px 45px rgba(0, 0, 0, 0.65);">
          
          <!-- Top Row Header: Transmission ID & Date -->
          <table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin-bottom: 12px;">
            <tr>
              <td align="left" style="font-size: 13px; font-weight: 500; color: #cbd5e1; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                Transmission ID: <span style="color: #4ade80; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-weight: 700;">#${shortId}</span>
              </td>
              <td align="right" style="font-size: 13px; font-weight: 500; color: #cbd5e1; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                Order date: <span style="color: #f1f5f9; font-weight: 600;">${dateFormatted}</span>
              </td>
            </tr>
          </table>

          <!-- Divider Line -->
          <div style="height: 1px; background-color: rgba(255, 255, 255, 0.18); width: 100%; margin: 0 0 24px 0;"></div>

          <!-- Headline -->
          <h1 style="font-size: 26px; line-height: 1.25; font-weight: 700; color: #ffffff; margin: 0 0 20px 0; letter-spacing: -0.5px;">
            New message for you, Akalanka!
          </h1>

          <!-- Pill Actions -->
          <table border="0" cellpadding="0" cellspacing="0" style="margin-bottom: 28px;">
            <tr>
              <td>
                <a href="https://www.vipers.live/admin" target="_blank" style="display: inline-block; background-color: #72e382; color: #022c16; font-size: 13px; font-weight: 700; padding: 11px 24px; border-radius: 9999px; text-decoration: none;">Account Dashboard</a>
              </td>
              <td style="padding-left: 10px;">
                <a href="mailto:${safeMailto}" style="display: inline-block; background-color: rgba(255, 255, 255, 0.08); color: #f1f5f9; border: 1px solid rgba(255, 255, 255, 0.18); font-size: 13px; font-weight: 600; padding: 10px 20px; border-radius: 9999px; text-decoration: none;">Reply to Client</a>
              </td>
            </tr>
          </table>

          <!-- Client Details Box -->
          <div style="background-color: rgba(0, 0, 0, 0.45); border: 1px solid rgba(74, 222, 128, 0.2); border-radius: 16px; padding: 22px 24px; margin-bottom: 20px;">
            
            <!-- Client Name -->
            <div style="margin-bottom: 16px;">
              <div style="font-size: 11px; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; text-transform: uppercase; color: #86efac; letter-spacing: 0.8px; margin-bottom: 4px;">CLIENT NAME</div>
              <div style="font-size: 16px; color: #ffffff; font-weight: 600;">${safeName}</div>
            </div>

            <!-- Direct Contact Email -->
            <div style="margin-bottom: 16px;">
              <div style="font-size: 11px; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; text-transform: uppercase; color: #86efac; letter-spacing: 0.8px; margin-bottom: 4px;">DIRECT CONTACT EMAIL</div>
              <div><a href="mailto:${safeMailto}" style="color: #38bdf8; font-size: 15px; font-weight: 600; text-decoration: none;">${safeEmail}</a></div>
            </div>

            <!-- Architecture & Budget (Table columns ensure zero bunching in Gmail) -->
            <table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin-bottom: 16px;">
              <tr>
                <td width="50%" valign="top" style="padding-right: 12px;">
                  <div style="font-size: 11px; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; text-transform: uppercase; color: #86efac; letter-spacing: 0.8px; margin-bottom: 4px;">PROJECT ARCHITECTURE</div>
                  <div style="font-size: 15px; color: #ffffff; font-weight: 700; text-transform: uppercase;">${safeProjectType}</div>
                </td>
                <td width="50%" valign="top" style="padding-left: 12px;">
                  <div style="font-size: 11px; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; text-transform: uppercase; color: #86efac; letter-spacing: 0.8px; margin-bottom: 4px;">BUDGET TIER</div>
                  <div style="font-size: 15px; color: #4ade80; font-weight: 700; text-transform: uppercase;">${safeBudget}</div>
                </td>
              </tr>
            </table>

            <!-- Project Specifications Message Content -->
            <div>
              <div style="font-size: 11px; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; text-transform: uppercase; color: #86efac; letter-spacing: 0.8px; margin-bottom: 6px;">PROJECT SPECIFICATIONS</div>
              <div style="background-color: rgba(4, 20, 12, 0.7); border: 1px solid rgba(74, 222, 128, 0.25); border-radius: 10px; padding: 14px 16px; font-size: 14px; line-height: 1.6; color: #f1f5f9; white-space: pre-wrap;">${safeMessage}</div>
            </div>

          </div>

          <!-- Footer Metadata -->
          <div style="font-size: 11px; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; color: #94a3b8; text-align: left; opacity: 0.85; line-height: 1.5;">
            Dispatched via Akalanka Egodawatte Portfolio Engine • Origin: ${safeSourceIp} • ${safeReceivedAt}
          </div>

        </div>
      </td>
    </tr>
  </table>
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
      name: sanitizeString(input.name).replace(/[\r\n]/g, " ").trim(),
      email: input.email.toLowerCase().trim().replace(/[\r\n]/g, ""),
      projectType: input.projectType.replace(/[\r\n]/g, ""),
      budget: input.budget.replace(/[\r\n]/g, ""),
      message: sanitizeString(input.message),
      sourceIp: input.sourceIp.replace(/[\r\n]/g, ""),
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
        const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || "chandiraakalanka@gmail.com";
        const emailHtml = buildContactEmailHtml({ ...sanitized, leadId });

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
