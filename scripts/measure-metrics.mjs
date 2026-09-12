/**
 * Direct Production Performance & Latency Measurement
 */

async function measureMetrics() {
  console.log("=================================================");
  console.log(" PRODUCTION PERFORMANCE & LATENCY MEASUREMENT");
  console.log("=================================================\n");

  const results = {};

  // 1. TTFB & HTML Payload
  const startHtml = performance.now();
  const htmlRes = await fetch("http://localhost:3000/");
  const ttfb = performance.now() - startHtml;
  const htmlText = await htmlRes.text();
  const htmlSizeKb = (Buffer.byteLength(htmlText, "utf8") / 1024).toFixed(2);

  results.htmlTtfbMs = ttfb.toFixed(2);
  results.htmlSizeKb = htmlSizeKb;

  console.log(`[1] Homepage SSR / TTFB:`);
  console.log(`    Status: ${htmlRes.status}`);
  console.log(`    TTFB: ${results.htmlTtfbMs} ms`);
  console.log(`    HTML Payload: ${results.htmlSizeKb} KB`);

  // 2. Static Asset Latency (WebP Frame)
  const startAsset = performance.now();
  const assetRes = await fetch("http://localhost:3000/cyber-frames/img_00001.webp");
  const assetLatency = performance.now() - startAsset;
  const assetBuf = await assetRes.arrayBuffer();
  const assetSizeKb = (assetBuf.byteLength / 1024).toFixed(2);

  results.assetLatencyMs = assetLatency.toFixed(2);
  results.assetSizeKb = assetSizeKb;

  console.log(`\n[2] Static Frame Asset (/cyber-frames/img_00001.webp):`);
  console.log(`    Status: ${assetRes.status}`);
  console.log(`    Latency: ${results.assetLatencyMs} ms`);
  console.log(`    Asset Size: ${results.assetSizeKb} KB (WebP)`);
  console.log(`    Cache-Control: ${assetRes.headers.get("cache-control")}`);

  // 3. API Route Latencies
  const endpoints = [
    { name: "Health Probe", url: "http://localhost:3000/api/health" },
    { name: "Admin Session", url: "http://localhost:3000/api/admin/session" },
    { name: "Dynamic Sitemap", url: "http://localhost:3000/sitemap.xml" },
    { name: "Dynamic Robots", url: "http://localhost:3000/robots.txt" },
  ];

  console.log(`\n[3] Core Route Latencies:`);
  for (const ep of endpoints) {
    const start = performance.now();
    const res = await fetch(ep.url);
    const duration = (performance.now() - start).toFixed(2);
    console.log(`    ${ep.name} (${ep.url.replace("http://localhost:3000", "")}): ${duration} ms (Status ${res.status})`);
  }

  console.log("\n=================================================");
  console.log(" MEASUREMENT COMPLETE");
  console.log("=================================================");
}

measureMetrics().catch(console.error);
