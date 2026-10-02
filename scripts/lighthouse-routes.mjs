import lighthouse from "lighthouse";
import puppeteer from "puppeteer-core";
import { existsSync } from "node:fs";

const CHROME = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
].find((p) => existsSync(p));

const BASE = process.env.QA_BASE_URL ?? "http://localhost:3000";
const ROUTES = process.env.QA_ROUTES
  ? process.env.QA_ROUTES.split(",")
  : ["/", "/services/anomaly-scan", "/contact", "/due-date-calculator"];

let port = 9223;
for (const route of ROUTES) {
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
    const scores = Object.fromEntries(
      Object.entries(r.lhr.categories).map(([k, v]) => [
        k,
        Math.round((v.score ?? 0) * 100),
      ])
    );
    const a = r.lhr.audits;
    console.log(
      route,
      JSON.stringify(scores),
      `| LCP ${a["largest-contentful-paint"]?.displayValue}`,
      `| CLS ${a["cumulative-layout-shift"]?.displayValue}`
    );
  } catch (err) {
    console.log(route, "LIGHTHOUSE FAILED:", err.message?.slice(0, 200));
  }
  await browser.close();
  port += 1;
}
process.exit(0);
