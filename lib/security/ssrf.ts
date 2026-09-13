/**
 * SSRF (Server-Side Request Forgery) Defense Utilities
 * Validates external outbound URLs, domain names, and identifiers before network dispatch.
 * Prevents requests to RFC 1918 private subnets, loopbacks, link-local addresses, and cloud metadata services.
 */

const BLOCKED_HOSTS = new Set([
  "localhost",
  "127.0.0.1",
  "::1",
  "0.0.0.0",
  "169.254.169.254", // AWS/GCP/Azure link-local metadata
  "metadata.google.internal",
  "instance-data",
]);

/**
 * Validates outbound URL to prevent SSRF against internal infrastructure,
 * cloud metadata endpoints, or non-HTTP protocols.
 */
export function validateOutboundUrl(targetUrl: string): { valid: boolean; reason?: string } {
  if (!targetUrl || typeof targetUrl !== "string") {
    return { valid: false, reason: "URL string is empty or invalid" };
  }

  try {
    const parsed = new URL(targetUrl.trim());

    // 1. Enforce HTTP/HTTPS protocol only (reject file://, gopher://, dict://, etc.)
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
      return { valid: false, reason: `Unsupported protocol: ${parsed.protocol}` };
    }

    // In production, enforce HTTPS exclusively for external services
    if (process.env.NODE_ENV === "production" && parsed.protocol !== "https:") {
      return { valid: false, reason: "Plain HTTP prohibited in production environment" };
    }

    const hostname = parsed.hostname.toLowerCase().trim();

    // 2. Check explicit blocked hosts
    if (BLOCKED_HOSTS.has(hostname)) {
      return { valid: false, reason: `Direct access to host '${hostname}' is prohibited` };
    }

    // 3. Reject IPv4 Private, Loopback, Link-Local, and Broadcast ranges
    const ipv4Match = hostname.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
    if (ipv4Match) {
      const octet1 = parseInt(ipv4Match[1], 10);
      const octet2 = parseInt(ipv4Match[2], 10);

      // Loopback (127.0.0.0/8)
      if (octet1 === 127) {
        return { valid: false, reason: "Loopback addresses are prohibited" };
      }
      // Zero / current network (0.0.0.0/8)
      if (octet1 === 0) {
        return { valid: false, reason: "Current network addresses are prohibited" };
      }
      // Private Class A (10.0.0.0/8)
      if (octet1 === 10) {
        return { valid: false, reason: "Private Class A addresses are prohibited" };
      }
      // Private Class B (172.16.0.0/12)
      if (octet1 === 172 && octet2 >= 16 && octet2 <= 31) {
        return { valid: false, reason: "Private Class B addresses are prohibited" };
      }
      // Private Class C (192.168.0.0/16)
      if (octet1 === 192 && octet2 === 168) {
        return { valid: false, reason: "Private Class C addresses are prohibited" };
      }
      // Link-Local / AWS Metadata (169.254.0.0/16)
      if (octet1 === 169 && octet2 === 254) {
        return { valid: false, reason: "Link-local cloud metadata addresses are prohibited" };
      }
      // Broadcast (255.255.255.255)
      if (octet1 === 255) {
        return { valid: false, reason: "Broadcast addresses are prohibited" };
      }
    }

    // 4. Reject local network domain extensions
    if (
      hostname.endsWith(".local") ||
      hostname.endsWith(".internal") ||
      hostname.endsWith(".lan") ||
      hostname.endsWith(".localdomain")
    ) {
      return { valid: false, reason: "Internal network top-level domains are prohibited" };
    }

    return { valid: true };
  } catch {
    return { valid: false, reason: "Malformed URL syntax" };
  }
}

/**
 * Validates a GitHub username string to ensure it adheres strictly to GitHub naming rules
 * (max 39 characters, alphanumeric with single hyphens, no consecutive hyphens, no leading/trailing hyphens).
 */
export function isSafeGitHubUsername(username: string): boolean {
  if (!username || typeof username !== "string") return false;
  return /^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/.test(username.trim());
}

/**
 * Validates an ElevenLabs voice ID to ensure alphanumeric/safe character pattern
 */
export function isSafeVoiceId(voiceId: string): boolean {
  if (!voiceId || typeof voiceId !== "string") return false;
  return /^[a-zA-Z0-9_-]{1,64}$/.test(voiceId.trim());
}
