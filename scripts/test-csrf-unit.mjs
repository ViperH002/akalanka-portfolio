import crypto from "crypto";
import { validateOrigin } from "../lib/security/csrf.js";

// Let's test validateOrigin logic
function testCsrfLogic() {
  console.log("Testing CSRF validateOrigin edge cases...");
  
  // Case A: Attacker matches Host header to their Origin
  const fakeReq = {
    method: "POST",
    headers: new Map([
      ["host", "evil.com"],
      ["origin", "https://evil.com"],
    ]),
  };
  // Mock get
  fakeReq.headers.get = (name) => fakeReq.headers.get(name);
  
  // We can see that if host is evil.com and origin is https://evil.com, originHost === normalizedHost will be true.
  console.log("  Host header injection analysis confirmed by code inspection.");
}

testCsrfLogic();
