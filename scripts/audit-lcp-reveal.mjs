// LCP A/B: Lighthouse mobile passes on 3 routes with default motion vs
// prefers-reduced-motion (which disables the reveal system entirely).
import lighthouse from "lighthouse";
import puppeteer from "puppeteer-core";
import { existsSync } from "node:fs";

const CHROME = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
].find((p) => existsSync(p));
const BASE = process.env.AUDIT_BASE_URL ?? "http://localhost:3200";
const ROUTES = ["/", "/services/anomaly-scan", "/services/genetic-counselling"];

let port = 9800;
for (const route of ROUTES) {
  for (const mode of ["default", "reduced"]) {
    const b = await puppeteer.launch({
      executablePath: CHROME,
      headless: true,
      args: ["--no-sandbox", `--remote-debugging-port=${port}`],
    });
    const r = await lighthouse(BASE + route, {
      port,
      formFactor: "mobile",
      screenEmulation: { mobile: true },
      emulatedMediaFeatures:
        mode === "reduced"
          ? [{ name: "prefers-reduced-motion", value: "reduce" }]
          : [],
      onlyCategories: ["performance"],
    });
    const a = r.lhr.audits;
    console.log(
      `${route} [${mode}] perf ${Math.round((r.lhr.categories.performance.score ?? 0) * 100)} | LCP ${a["largest-contentful-paint"]?.displayValue} | TBT ${a["total-blocking-time"]?.displayValue} | FCP ${a["first-contentful-paint"]?.displayValue}`
    );
    await b.close();
    port++;
  }
}
process.exit(0);
