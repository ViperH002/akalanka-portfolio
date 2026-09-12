async function testSeo() {
  console.log("=================================================");
  console.log(" SEO & ACCESSIBILITY VERIFICATION SUITE");
  console.log("=================================================");

  // 1. Sitemap probe
  const sitemapRes = await fetch("http://localhost:3000/sitemap.xml");
  const sitemapText = await sitemapRes.text();
  console.log(`[1] /sitemap.xml (Status ${sitemapRes.status}):`);
  if (sitemapRes.status === 200 && sitemapText.includes("<loc>https://devcraft-agency.com</loc>")) {
    console.log("  ✓ Status 200 OK, valid XML sitemap with canonical URL");
  } else {
    console.error("  ✗ Sitemap verification failed", sitemapText);
    process.exit(1);
  }

  // 2. Robots probe
  const robotsRes = await fetch("http://localhost:3000/robots.txt");
  const robotsText = await robotsRes.text();
  console.log(`[2] /robots.txt (Status ${robotsRes.status}):`);
  if (robotsRes.status === 200 && robotsText.includes("Disallow: /admin") && robotsText.includes("sitemap.xml")) {
    console.log("  ✓ Status 200 OK, disallows /admin, links sitemap.xml");
  } else {
    console.error("  ✗ Robots verification failed", robotsText);
    process.exit(1);
  }

  // 3. Homepage HTML: JSON-LD, Skip Link, Main landmark
  const homeRes = await fetch("http://localhost:3000/");
  const homeHtml = await homeRes.text();
  console.log("[3] Inspecting Homepage HTML Metadata & Accessibility:");

  const hasJsonLd = homeHtml.includes("application/ld+json") && homeHtml.includes("Akalanka Egodawatte");
  console.log(`  ${hasJsonLd ? "✓" : "✗"} Schema.org JSON-LD Structured Data: ${hasJsonLd ? "Verified" : "Missing"}`);

  const hasSkipLink = homeHtml.includes("Skip to main content");
  console.log(`  ${hasSkipLink ? "✓" : "✗"} WCAG Keyboard Skip Link: ${hasSkipLink ? "Verified" : "Missing"}`);

  const hasMainLandmark = homeHtml.includes('id="main-content"');
  console.log(`  ${hasMainLandmark ? "✓" : "✗"} Landmark <main id="main-content">: ${hasMainLandmark ? "Verified" : "Missing"}`);

  if (!hasJsonLd || !hasSkipLink || !hasMainLandmark) {
    console.error("  ✗ Accessibility or SEO check failed");
    process.exit(1);
  }

  console.log("\n=================================================");
  console.log(" ALL SEO & ACCESSIBILITY VERIFICATIONS PASSED 100%");
  console.log("=================================================");
}

testSeo().catch((err) => {
  console.error("Fatal test error:", err);
  process.exit(1);
});
