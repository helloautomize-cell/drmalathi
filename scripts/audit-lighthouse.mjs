// Mobile Lighthouse lab audit: N runs per route, median scores + CWV metrics.
// Usage: AUDIT_BASE_URL=http://localhost:3200 AUDIT_RUNS=3 node scripts/audit-lighthouse.mjs
import lighthouse from "lighthouse";
import puppeteer from "puppeteer-core";
import { existsSync, writeFileSync, mkdirSync } from "node:fs";

const CHROME = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
].find((p) => existsSync(p));

const BASE = process.env.AUDIT_BASE_URL ?? "http://localhost:3200";
const RUNS = Number(process.env.AUDIT_RUNS ?? 3);
const ROUTES = (
  process.env.AUDIT_ROUTES ??
  "/,/services/anomaly-scan,/services/nipt,/doctors,/guides/downs-screening-oscar,/contact"
).split(",");

const median = (xs) => {
  const s = [...xs].sort((a, b) => a - b);
  return s[Math.floor(s.length / 2)];
};

let port = 9400;
const out = {};
for (const route of ROUTES) {
  const runs = [];
  for (let i = 0; i < RUNS; i++) {
    const browser = await puppeteer.launch({
      executablePath: CHROME,
      headless: true,
      args: ["--no-sandbox", `--remote-debugging-port=${port}`],
    });
    try {
      const r = await lighthouse(`${BASE}${route}`, {
        port,
        formFactor: "mobile",
        screenEmulation: { mobile: true },
        onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
      });
      const c = r.lhr.categories;
      const a = r.lhr.audits;
      runs.push({
        perf: Math.round((c.performance.score ?? 0) * 100),
        a11y: Math.round((c.accessibility.score ?? 0) * 100),
        bp: Math.round((c["best-practices"].score ?? 0) * 100),
        seo: Math.round((c.seo.score ?? 0) * 100),
        lcp: a["largest-contentful-paint"]?.numericValue ?? null,
        cls: a["cumulative-layout-shift"]?.numericValue ?? null,
        tbt: a["total-blocking-time"]?.numericValue ?? null,
        fcp: a["first-contentful-paint"]?.numericValue ?? null,
        si: a["speed-index"]?.numericValue ?? null,
        lcpEl:
          a["largest-contentful-paint-element"]?.details?.items?.[0]?.items?.[0]
            ?.node?.snippet?.slice(0, 120) ?? null,
        opportunities: Object.values(a)
          .filter((x) => x.details?.type === "opportunity" && (x.numericValue ?? 0) > 100)
          .map((x) => `${x.id}: ~${Math.round(x.numericValue)}ms`)
          .slice(0, 8),
      });
    } catch (e) {
      runs.push({ error: String(e).slice(0, 200) });
    }
    await browser.close();
    port += 1;
  }
  const ok = runs.filter((r) => !r.error);
  out[route] = {
    runs,
    median: ok.length
      ? {
          perf: median(ok.map((r) => r.perf)),
          a11y: median(ok.map((r) => r.a11y)),
          bp: median(ok.map((r) => r.bp)),
          seo: median(ok.map((r) => r.seo)),
          lcpMs: Math.round(median(ok.map((r) => r.lcp ?? 0))),
          cls: +median(ok.map((r) => r.cls ?? 0)).toFixed(3),
          tbtMs: Math.round(median(ok.map((r) => r.tbt ?? 0))),
          fcpMs: Math.round(median(ok.map((r) => r.fcp ?? 0))),
          siMs: Math.round(median(ok.map((r) => r.si ?? 0))),
        }
      : null,
  };
  console.log(
    route,
    JSON.stringify(out[route].median),
    ok[0]?.lcpEl ?? ""
  );
  if (ok[0]?.opportunities?.length)
    console.log("   opp:", ok[0].opportunities.join(" | "));
}
mkdirSync("docs", { recursive: true });
writeFileSync("docs/lighthouse-audit.json", JSON.stringify(out, null, 1));
console.log("\nWrote docs/lighthouse-audit.json");
process.exit(0);
