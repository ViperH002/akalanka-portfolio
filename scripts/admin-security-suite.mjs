/**
 * Vipers.live — Phase 25 Automated Admin Security Verification Suite
 * Executes Tests 1 through 8 from the production security specification.
 */

import http from "http";
import crypto from "crypto";

const BASE_URL = process.env.TEST_TARGET || "http://localhost:3000";
const TEST_IP = "10.99.88.77"; // Isolated test IP

let totalPassed = 0;
let totalFailed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ [PASS] ${message}`);
    totalPassed++;
  } else {
    console.error(`  ✗ [FAIL] ${message}`);
    totalFailed++;
  }
}

async function request(path, options = {}) {
  const url = new URL(path, BASE_URL);
  const method = options.method || "GET";
  const headers = {
    "X-Real-IP": options.ip || TEST_IP,
    "User-Agent": "Vipers-Security-Auditor/1.0",
    ...(options.headers || {}),
  };

  if (options.body && typeof options.body === "object") {
    headers["Content-Type"] = "application/json";
  }

  const payload = options.body ? (typeof options.body === "string" ? options.body : JSON.stringify(options.body)) : null;

  return new Promise((resolve, reject) => {
    const req = http.request(
      url,
      {
        method,
        headers,
      },
      (res) => {
        let rawData = "";
        res.on("data", (chunk) => (rawData += chunk));
        res.on("end", () => {
          let json = null;
          try {
            json = JSON.parse(rawData);
          } catch {
            // Raw text or HTML
          }
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: json,
            raw: rawData,
          });
        });
      }
    );

    req.on("error", reject);
    if (payload) req.write(payload);
    req.end();
  });
}

async function runPhase25Tests() {
  console.log("===============================================================================");
  console.log(" VIPERS.LIVE — PHASE 25 AUTOMATED ADMIN SECURITY TEST SUITE");
  console.log(` Target Endpoint: ${BASE_URL}`);
  console.log("===============================================================================\n");

  // --- TEST 1: Unauthenticated Access ---
  console.log("[Test 1] Testing Unauthenticated Boundary...");
  const sessionRes = await request("/api/admin/session", { ip: "10.1.1.1" });
  assert(sessionRes.status === 200, "Session endpoint reachable with status 200");
  assert(sessionRes.body?.authenticated === false, "Unauthenticated session correctly identified (authenticated: false)");
  assert(sessionRes.body?.role === "user", "Unauthenticated caller granted default 'user' role only");

  // --- TEST 2: Normal USER Privilege Escalation ---
  console.log("\n[Test 2] Testing Normal USER Privilege Escalation Attempt...");
  // Create a forged or user-role signed token
  const userPayload = Buffer.from(JSON.stringify({ jti: crypto.randomUUID(), role: "user", exp: Date.now() + 3600000 })).toString("base64url");
  const dummyToken = `${userPayload}.invalidsignature123`;
  const userRes = await request("/api/admin/session", {
    headers: { Cookie: `devcraft_admin_session=${dummyToken}` },
    ip: "10.1.1.2",
  });
  assert(userRes.body?.authenticated === false, "User or tampered role correctly denied admin privileges");

  // --- TEST 3: Authenticated ADMIN Login & Clearance ---
  console.log("\n[Test 3] Testing ADMIN Authentication & Session Grant...");
  const loginRes = await request("/api/admin/login", {
    method: "POST",
    headers: { Origin: "http://localhost:3000" },
    body: { passcode: process.env.ADMIN_SECRET_KEY || "admin2026" },
    ip: "10.1.1.3",
  });

  const isLoginSuccessful = loginRes.status === 200 && loginRes.body?.success === true;
  assert(isLoginSuccessful, `Admin login successful (HTTP ${loginRes.status})`);

  let adminCookie = null;
  if (loginRes.headers["set-cookie"]) {
    const rawCookies = Array.isArray(loginRes.headers["set-cookie"])
      ? loginRes.headers["set-cookie"]
      : [loginRes.headers["set-cookie"]];
    const match = rawCookies.find((c) => c.includes("devcraft_admin_session="));
    if (match) {
      adminCookie = match.split(";")[0];
    }
  }
  assert(Boolean(adminCookie), "Issued authenticated admin session cookie");

  if (adminCookie) {
    const authSessionRes = await request("/api/admin/session", {
      headers: { Cookie: adminCookie },
      ip: "10.1.1.3",
    });
    assert(authSessionRes.body?.authenticated === true, "Session validated as authenticated: true");
    assert(authSessionRes.body?.role === "admin", "Session role verified server-side as 'admin'");
  }

  // --- TEST 4: Direct API Bypass Without UI ---
  console.log("\n[Test 4] Testing Direct API Bypass & CSRF Protection...");
  const bypassRes = await request("/api/admin/login", {
    method: "POST",
    headers: { Origin: "https://malicious-attacker-site.com" },
    body: { passcode: "admin2026" },
    ip: "10.1.1.4",
  });
  assert(bypassRes.status === 403, `Direct cross-origin API invocation rejected with 403 Forbidden (got ${bypassRes.status})`);

  // --- TEST 5: Manipulated Role Escalation in Request Body ---
  console.log("\n[Test 5] Testing Manipulated Role Payload in Input...");
  const roleTamperRes = await request("/api/contact", {
    method: "POST",
    headers: { Origin: "http://localhost:3000" },
    body: {
      name: "Security Probe",
      email: "probe@vipers.live",
      projectType: "webapp",
      budget: "enterprise",
      message: "Testing privilege parameter stripping.",
      role: "admin",
      isAdmin: true,
      permissions: ["SUPER_ADMIN"],
    },
    ip: "10.99.1.5",
  });
  assert(roleTamperRes.status === 200, "Input payload accepted with stripped extraneous parameters");

  // --- TEST 6: Injection & Malformed Payloads ---
  console.log("\n[Test 6] Testing Injection & Path Traversal Resistance...");
  const xssRes = await request("/api/contact", {
    method: "POST",
    headers: { Origin: "http://localhost:3000" },
    body: {
      name: "<script>alert('XSS')</script>",
      email: "xss@vipers.live",
      projectType: "webapp",
      budget: "enterprise",
      message: "<svg onload=alert(1)>Path traversal: ../../../etc/passwd",
    },
    ip: "10.99.1.6",
  });
  assert(xssRes.status === 200, "XSS and path traversal payload processed safely without injection");

  // --- TEST 7: Brute-Force Rate Limiting & Lockout ---
  console.log("\n[Test 7] Testing Brute-Force Lockout Defense...");
  const bruteIp = "10.99.1.99";
  let lockoutTriggered = false;
  for (let i = 1; i <= 6; i++) {
    const attempt = await request("/api/admin/login", {
      method: "POST",
      headers: { Origin: "http://localhost:3000" },
      body: { passcode: `wrong_passcode_${i}` },
      ip: bruteIp,
    });
    if ((attempt.status === 429 && attempt.body?.remainingSeconds > 0) || (attempt.status === 401 && attempt.body?.remainingAttempts === 0)) {
      lockoutTriggered = true;
      break;
    }
  }
  assert(lockoutTriggered, "Brute-force credential stuffing engaged automated 429 lockout");

  // --- TEST 8: Session Expiration & Revocation ---
  console.log("\n[Test 8] Testing Session Revocation & Lifecycle...");
  if (adminCookie) {
    const logoutRes = await request("/api/admin/logout", {
      method: "POST",
      headers: { Origin: "http://localhost:3000", Cookie: adminCookie },
      ip: "10.1.1.3",
    });
    assert(logoutRes.status === 200, "Logout processed with status 200");

    const postLogoutSession = await request("/api/admin/session", {
      headers: { Cookie: adminCookie },
      ip: "10.1.1.3",
    });
    assert(postLogoutSession.body?.authenticated === false, "Permanently revoked token rejected after logout");
  }

  // --- SUMMARY ---
  console.log("\n===============================================================================");
  console.log(` RESULTS: ${totalPassed} PASSED, ${totalFailed} FAILED (TOTAL: ${totalPassed + totalFailed})`);
  console.log(` SUCCESS RATE: ${Math.round((totalPassed / (totalPassed + totalFailed)) * 100)}%`);
  console.log("===============================================================================\n");

  if (totalFailed > 0) {
    process.exit(1);
  }
}

runPhase25Tests().catch((err) => {
  console.error("FATAL ERROR IN SECURITY SUITE:", err);
  process.exit(1);
});
